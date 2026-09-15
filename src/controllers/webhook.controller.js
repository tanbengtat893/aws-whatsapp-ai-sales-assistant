'use strict';

/**
 * Webhook controller - the enquiry pipeline (spec Task 7).
 *
 * Flow (design "The enquiry pipeline"):
 *   1. validate    - handled by the route (express-validator); missing from/text -> 400
 *   2. sanitize    - clean the inbound text before storing/processing (Req 1.3)
 *   3. record      - persist the enquiry (Req 1.1)
 *   4. detect      - language.service.detect (Req 2)
 *   5. match       - faq.service.match (Req 3)
 *   6. product     - if no confident FAQ but the text names products, answer with
 *                    prices/stock (sales value-add; still deterministic)
 *   7. decide      - escalation.service.decide (Req 4)
 *   8. respond     - sender.send: auto-answer OR localized escalation ack
 *   9. persist     - update enquiry outcome; create escalation record if escalated
 *  10. return      - echo the bot reply so it can be inspected (Req 8.2)
 *
 * Reliability (Non-Functional): the whole pipeline is wrapped so an error while
 * handling one enquiry is caught, logged server-side, and results in a safe
 * escalation rather than a crash. Raw errors are never returned to callers.
 */

const store = require('../data/store');
const language = require('../services/language.service');
const faq = require('../services/faq.service');
const escalation = require('../services/escalation.service');
const product = require('../services/product.service');
const sender = require('../services/whatsapp/sender');
const openclaw = require('../services/ai/openclaw.client');
const menu = require('../services/menu.service');
const vision = require('../services/ai/vision.provider');
const delivery = require('../services/delivery.service');
const salesflow = require('../services/salesflow.service');
const onsite = require('../services/onsite.service');
const i18n = require('../services/i18n.service');
const payment = require('../services/payment.service');
const booking = require('../services/booking.service');
const warranty = require('../services/warranty.service');

// Common categories offered when an uploaded photo can't be auto-identified.
// The customer taps a number -> we list priced items in that category.
const IMAGE_CATEGORY_PICKS = [
  { category: 'mouse', label: 'Mouse' },
  { category: 'keyboard', label: 'Keyboard' },
  { category: 'monitor', label: 'Monitor' },
  { category: 'gpu', label: 'Graphics card (GPU)' },
  { category: 'ram', label: 'Memory (RAM)' },
  { category: 'ssd', label: 'SSD / Storage' },
  { category: 'router', label: 'Router / WiFi' },
  { category: 'webcam', label: 'Webcam' },
];

/**
 * Did this customer's most recent PRIOR enquiry select the Delivery Status
 * option (or is mid delivery lookup)? If so, their current message is the
 * order no / name / phone we should look up. We reconstruct the short-lived
 * "conversation state" from the stored enquiries rather than a session store.
 *
 * @param {string} from      the customer id
 * @param {string} currentId the just-created enquiry id (excluded from the scan)
 */
function lastPriorEnquiry(from, currentId) {
  const prior = store
    .list('enquiries')
    // Exclude rep→customer outbound messages so they don't corrupt the
    // customer's conversation state (they are not customer turns).
    .filter((e) => e.from === from && e.id !== currentId && e.menuRoute && e.author !== 'rep')
    .sort((a, b) => String(b.receivedAt || '').localeCompare(String(a.receivedAt || '')));
  return prior.length > 0 ? prior[0] : null;
}

function wasLastRouteDeliveryStatus(from, currentId) {
  const last = lastPriorEnquiry(from, currentId);
  return Boolean(last && last.menuRoute === 'delivery_status');
}

/** Was the customer's previous message the Warranty Status prompt (menu 8)? */
function wasLastRouteWarranty(from, currentId) {
  const last = lastPriorEnquiry(from, currentId);
  return Boolean(last && last.menuRoute === 'warranty');
}

/**
 * The customer's sticky language preference, if they explicitly chose one via
 * the Language option. Scans their prior enquiries for the most recent stored
 * `langPref`. Returns 'en'|'ms'|'zh' or null.
 */
function getLangPref(from, currentId) {
  const prior = store
    .list('enquiries')
    .filter((e) => e.from === from && e.id !== currentId && e.langPref)
    .sort((a, b) => String(b.receivedAt || '').localeCompare(String(a.receivedAt || '')));
  return prior.length > 0 ? prior[0].langPref : null;
}

/** Was the customer's previous message the language picker? */
function wasLanguagePicker(from, currentId) {
  const last = lastPriorEnquiry(from, currentId);
  return Boolean(last && last.menuRoute === 'language_picker');
}

/**
 * Professional post-confirmation message (localized). Covers payment follow-up,
 * delivery mode (shop collection or delivery), and the transport surcharge.
 */
function buildOrderConfirmationReply(lang) {
  return i18n.t(lang || 'en', 'order_confirmed', { cur: 'SGD' });
}

/**
 * Basic input sanitization: trim, collapse whitespace, strip control chars, and
 * cap length. Deliberately conservative - we keep the original wording so the
 * language/FAQ services see real text (Req 1.3).
 */
function sanitizeText(text) {
  return String(text)
    // eslint-disable-next-line no-control-regex
    .replace(/[\u0000-\u001F\u007F]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 2000);
}

/**
 * Localized live-stock text for a product. Shows the actual unit count when the
 * item is stocked (e.g. "100 in stock" / "库存 100 件"), otherwise a made-to-order
 * label. Keeps the customer informed of real availability, never a wrong guess.
 */
function stockText(p, lang) {
  const lng = lang || 'en';
  const qty = Number(p && p.quantity);
  const stocked = p && (p.stockStatus === 'in_stock' || p.stockStatus === 'low_stock');
  if (stocked && Number.isFinite(qty) && qty > 0) {
    return i18n.t(lng, 'stock_in_units', { qty });
  }
  return i18n.t(lng, 'stock_made_to_order');
}

/** Render one product as a bullet line with price and localized stock. */
function productLine(p, currency, lang) {
  const stock = stockText(p, lang);
  return `- ${p.name}: ${p.currency || currency || 'SGD'} ${p.price} (${stock})`;
}

// --- Booking picker builders (numbered lists for onsite / carry-in) -------

/** Append the localized navigation hint (0 = menu, "back" = previous step). */
function withNavHint(text, lang) {
  return `${text}\n\n${i18n.t(lang, 'nav_hint')}`;
}

/** Numbered onsite service-type picker (localized, with nav hint). */
function buildOnsiteServicePicker(lang) {
  const list = booking.ONSITE_SERVICES.map((s) => `${s.id}. ${s.emoji} ${booking.label(s, lang)}`).join('\n');
  return withNavHint(i18n.t(lang, 'onsite_book_service', { list }), lang);
}

/** Numbered carry-in device picker (localized, with nav hint). */
function buildCarryInDevicePicker(lang) {
  const list = booking.CARRY_IN_DEVICES.map((d) => `${d.id}. ${d.emoji} ${booking.label(d, lang)}`).join('\n');
  return withNavHint(i18n.t(lang, 'carry_in_book_device', { list }), lang);
}

/** Numbered date picker (localized, with nav hint). Caller keeps the dates. */
function buildDatePicker(lang, dates) {
  const list = dates.map((d) => `${d.id}. ${d.label}`).join('\n');
  return withNavHint(i18n.t(lang, 'book_pick_date', { list }), lang);
}

/** Numbered time-slot picker (localized, with nav hint). */
function buildSlotPicker(lang) {
  const list = booking.TIME_SLOTS.map((s) => `${s.id}. ${s.label}`).join('\n');
  return withNavHint(i18n.t(lang, 'book_pick_slot', { list }), lang);
}

/**
 * Handle a "back" command by stepping to the PREVIOUS step of the active flow.
 * Returns { reply, update } to send/persist, or null when there's nothing to go
 * back to (the caller then falls back to the main menu).
 *
 * @param {string} from
 * @param {string} currentId
 * @param {string} route      the prior enquiry's menuRoute (current step)
 * @param {object} prior      the prior enquiry (carries flow data)
 * @param {string} lang
 * @param {number} langConfidence
 */
function handleBack(from, currentId, route, prior, lang, langConfidence) {
  const bkLang = (prior && prior.language) || lang;
  const bookingData = (prior && prior.booking) ? { ...prior.booking } : {};
  const base = { language: bkLang, languageConfidence: langConfidence, status: 'auto_answered' };

  // Onsite booking steps.
  if (route === 'onsite_book_date') {
    return { reply: buildOnsiteServicePicker(bkLang), update: { ...base, menuRoute: 'onsite_book_service', booking: bookingData } };
  }
  if (route === 'onsite_book_slot') {
    const dates = bookingData.dates || booking.availableDates();
    bookingData.dates = dates;
    return { reply: buildDatePicker(bkLang, dates), update: { ...base, menuRoute: 'onsite_book_date', booking: bookingData } };
  }
  if (route === 'onsite_book_details') {
    return { reply: buildSlotPicker(bkLang), update: { ...base, menuRoute: 'onsite_book_slot', booking: bookingData } };
  }

  // Carry-in booking steps.
  if (route === 'carry_in_book_slot') {
    const dates = bookingData.dates || booking.availableDates();
    bookingData.dates = dates;
    return { reply: buildDatePicker(bkLang, dates), update: { ...base, menuRoute: 'carry_in_book_date', booking: bookingData } };
  }
  if (route === 'carry_in_book_device') {
    return { reply: buildSlotPicker(bkLang), update: { ...base, menuRoute: 'carry_in_book_slot', booking: bookingData } };
  }
  if (route === 'carry_in_book_problem') {
    return { reply: buildCarryInDevicePicker(bkLang), update: { ...base, menuRoute: 'carry_in_book_device', booking: bookingData } };
  }

  // Product flow: quantity step -> back to the shortlist.
  if (route === 'awaiting_quantity' && Array.isArray(prior.priorShortlist || prior.shortlist)) {
    const shortlist = prior.priorShortlist || prior.shortlist;
    const lines = [i18n.t(bkLang, 'found_intro')];
    shortlist.forEach((it, i) => {
      const priceStr = `${it.currency || 'SGD'} ${it.price}${it.priceNote === 'from' ? ' (from)' : ''}`;
      lines.push(`${i + 1}. ${it.name} — ${priceStr}`);
    });
    lines.push('');
    lines.push(i18n.t(bkLang, 'select_footer', { n: shortlist.length }));
    return { reply: lines.join('\n'), update: { ...base, menuRoute: 'product_shortlist', shortlist } };
  }

  // First step of a flow, or a step with no defined "previous" (service picker,
  // date picker, payment method, shortlist): fall back to the main menu.
  return null;
}

/**
 * Build a human-like product reply from a budget-aware search result.
 * Handles three cases:
 *   1. budget set + items fit      -> list only the affordable ones
 *   2. budget set + nothing fits   -> honestly say so + name the cheapest option
 *   3. no budget                   -> list the best matches
 * Returns null if there is nothing relevant at all (caller then escalates).
 */
function formatProductAnswer(result, currency, lang) {
  const cur = currency || 'SGD';
  const lng = lang || 'en';
  const { budget, withinBudget, overBudget, matched } = result;

  if (!matched) return null;

  // Build a NUMBERED shortlist (up to 5) so the customer can simply reply with
  // a number (1-5) to select, instead of typing the full item name. Replies are
  // localized to the customer's detected language (en/ms/zh).
  const buildNumbered = (rows, intro) => {
    const shortlist = rows.slice(0, 5).map((m) => ({
      id: m.product.id,
      name: m.product.name,
      price: Number(m.product.price),
      currency: m.product.currency || cur,
      priceNote: m.product.priceNote || null,
      stockStatus: m.product.stockStatus,
      quantity: m.product.quantity,
    }));
    const lines = [intro];
    shortlist.forEach((it, i) => {
      const priceStr = `${it.currency} ${it.price}${it.priceNote === 'from' ? ' (from)' : ''}`;
      // Show live availability so the customer sees how many units are in stock.
      const stockStr = stockText(it, lng);
      lines.push(`${i + 1}. ${it.name} — ${priceStr} · ${stockStr}`);
    });
    lines.push('');
    lines.push(i18n.t(lng, 'select_footer', { n: shortlist.length }));
    return { reply: lines.join('\n'), shortlist };
  };

  // Case 1 & 3: we have items to show (within budget, or no budget given).
  if (withinBudget.length > 0) {
    const intro =
      budget != null
        ? i18n.t(lng, 'found_under_budget', { cur, budget })
        : i18n.t(lng, 'found_intro');
    return buildNumbered(withinBudget, intro);
  }

  // Case 2: a budget was given but nothing fits. Show the closest options,
  // still numbered, and be honest about the budget.
  if (budget != null && overBudget.length > 0) {
    const intro = i18n.t(lng, 'nothing_fits', { cur, budget });
    return buildNumbered(overBudget, intro);
  }

  return null;
}

/**
 * Run the enquiry pipeline for a validated { from, text } payload.
 * Returns an object describing the outcome (also used as the HTTP response body).
 */
async function processEnquiry({ from, text }) {
  const receivedAt = new Date().toISOString();
  const sanitized = sanitizeText(text);

  // 3. Record the enquiry up front (Req 1.1).
  const enquiry = store.create(
    'enquiries',
    {
      from,
      text: sanitized,
      status: 'received',
      receivedAt,
      language: null,
      languageConfidence: 0,
      matchedFaqId: null,
      matchConfidence: 0,
      fallbackLanguageUsed: false,
      resolvedAt: null,
      resolvedBy: null,
    },
    'enq'
  );

  try {
    // 4. Detect language (Req 2). A customer's EXPLICIT language choice (via the
    // Language option) is sticky and wins over per-message auto-detection.
    const detected = language.detect(sanitized);
    const langPref = getLangPref(from, enquiry.id);
    let lang = langPref || detected.language;
    const langConfidence = langPref ? 1 : detected.confidence;

    // If the customer is mid-selection (previous message was a numbered product
    // shortlist, or we asked for a quantity), a bare number means "select item
    // N" or "quantity N" - NOT a main-menu choice. Detect that first so menu
    // routing doesn't hijack the guided sales flow.
    const priorForFlow = lastPriorEnquiry(from, enquiry.id);
    const priorFlowRoute = (priorForFlow && String(priorForFlow.menuRoute || '')) || '';
    const midSelection =
      priorForFlow &&
      (priorFlowRoute === 'product_shortlist' ||
        priorFlowRoute === 'awaiting_quantity' ||
        // During the payment step a bare "1"/"2" chooses a PAYMENT METHOD,
        // not a main-menu option, so don't let menu routing hijack it.
        priorFlowRoute === 'payment_method' ||
        // After a warranty result, a bare "1"/"2"/"3" is a service-action pick.
        priorFlowRoute === 'warranty_result' ||
        // During a booking flow, bare numbers choose service/date/slot/device,
        // not a main-menu option.
        priorFlowRoute.startsWith('onsite_book') ||
        priorFlowRoute.startsWith('carry_in_book'));

    // 4.3b Universal HOME command ("0" / "menu" / "home" + MS/ZH). Works at any
    // step: clears the current flow and returns the customer to the main menu.
    // Placed before the flow handlers so it always takes precedence, but after
    // language detection so the welcome shows in the customer's language.
    if (menu.isHomeCommand(sanitized)) {
      const welcome = menu.buildWelcome();
      await sender.send(from, welcome);
      store.update('enquiries', enquiry.id, {
        language: lang,
        languageConfidence: langConfidence,
        status: 'auto_answered',
        menuRoute: 'menu_home', // fresh state; no active flow
        reply: welcome,
      });
      return { enquiryId: enquiry.id, language: lang, reply: welcome, status: 'auto_answered', escalated: false, home: true };
    }

    // 4.3c Universal BACK command ("back" / "previous" + MS/ZH). Steps one back
    // within a multi-step flow (booking, payment, product selection). From the
    // first step of a flow (or with nothing to go back to) it returns to the
    // main menu, which keeps the behaviour predictable.
    if (menu.isBackCommand(sanitized)) {
      const backOutcome = handleBack(from, enquiry.id, priorFlowRoute, priorForFlow, lang, langConfidence);
      if (backOutcome) {
        await sender.send(from, backOutcome.reply);
        store.update('enquiries', enquiry.id, backOutcome.update);
        return { enquiryId: enquiry.id, language: lang, reply: backOutcome.reply, status: 'auto_answered', escalated: false, back: true, menuRoute: backOutcome.update.menuRoute };
      }
      // Nothing to go back to -> main menu.
      const welcome = menu.buildWelcome();
      await sender.send(from, welcome);
      store.update('enquiries', enquiry.id, {
        language: lang,
        languageConfidence: langConfidence,
        status: 'auto_answered',
        menuRoute: 'menu_home',
        reply: welcome,
      });
      return { enquiryId: enquiry.id, language: lang, reply: welcome, status: 'auto_answered', escalated: false, back: true, home: true };
    }

    // 4.4 Language option (un-numbered). Two steps:
    //   (a) a "language" request -> show the picker (in current language);
    //   (b) a language CHOICE (right after the picker, or a standalone flag/name)
    //       -> store a sticky langPref and confirm in the chosen language.
    // A choice is only accepted standalone if the previous message was the
    // picker, so a product named e.g. "english keyboard" isn't misread.
    if (menu.isLanguageRequest(sanitized)) {
      const reply = i18n.t(lang, 'language_picker');
      await sender.send(from, reply);
      store.update('enquiries', enquiry.id, {
        language: lang,
        languageConfidence: langConfidence,
        status: 'auto_answered',
        menuRoute: 'language_picker',
        reply,
      });
      return { enquiryId: enquiry.id, language: lang, reply, status: 'auto_answered', escalated: false, languagePicker: true };
    }
    if (wasLanguagePicker(from, enquiry.id)) {
      const choice = menu.detectLanguageChoice(sanitized);
      if (choice) {
        const reply = i18n.t(choice, 'language_set');
        await sender.send(from, reply);
        store.update('enquiries', enquiry.id, {
          language: choice,
          languageConfidence: 1,
          status: 'auto_answered',
          menuRoute: 'language_set',
          langPref: choice, // sticky preference for all future replies
          reply,
        });
        return { enquiryId: enquiry.id, language: choice, reply, status: 'auto_answered', escalated: false, langSet: choice };
      }
      // Not a recognised choice: re-show the picker so they can pick clearly.
      const reply = i18n.t(lang, 'language_picker');
      await sender.send(from, reply);
      store.update('enquiries', enquiry.id, {
        language: lang,
        languageConfidence: langConfidence,
        status: 'auto_answered',
        menuRoute: 'language_picker',
        reply,
      });
      return { enquiryId: enquiry.id, language: lang, reply, status: 'auto_answered', escalated: false, languagePicker: true };
    }

    // 4.5 Menu & greeting handling (hybrid assistant). Runs first so greetings
    //     welcome the customer (never escalate) and numbered choices route.
    const menuChoice = midSelection ? null : menu.detectMenuChoice(sanitized);
    if (menuChoice) {
      const m = menu.buildMenuResponse(menuChoice, lang);
      if (m.escalate) {
        // Option 7 (Talk to Sales) -> human handover.
        const ack = escalation.acknowledgementFor(lang);
        await sender.send(from, ack);
        store.update('enquiries', enquiry.id, {
          language: lang,
          languageConfidence: langConfidence,
          status: 'pending',
        });
        store.create(
          'escalations',
          { enquiryId: enquiry.id, reason: m.reason, status: 'pending', createdAt: new Date().toISOString() },
          'esc'
        );
        return { enquiryId: enquiry.id, language: lang, reply: ack, status: 'pending', escalated: true, reason: m.reason, menu: menuChoice.id };
      }
      // Option 2 (DIY PC Package): answer immediately with a NUMBERED shortlist
      // of real packages (component parts in brackets, single price). Store the
      // shortlist so the customer can select by number or name, exactly like
      // the Option 1 guided flow.
      let menuReply = m.reply;
      let pkgShortlist = null;
      let storedRoute = m.route;
      let bookingData;
      if (m.route === 'pc_bundle') {
        const pkgList = formatPcPackages();
        if (pkgList && pkgList.reply) {
          menuReply = pkgList.reply;
          pkgShortlist = pkgList.shortlist;
        }
      } else if (m.route === 'onsite') {
        // Option 4: begin the onsite booking with the service-type picker.
        menuReply = buildOnsiteServicePicker(lang);
        storedRoute = 'onsite_book_service';
      } else if (m.route === 'repair') {
        // Option 3: begin the carry-in booking with the date picker.
        bookingData = { dates: booking.availableDates() };
        menuReply = buildDatePicker(lang, bookingData.dates);
        storedRoute = 'carry_in_book_date';
      }
      await sender.send(from, menuReply);
      store.update('enquiries', enquiry.id, {
        language: lang,
        languageConfidence: langConfidence,
        status: 'auto_answered',
        menuRoute: pkgShortlist && pkgShortlist.length ? 'product_shortlist' : storedRoute,
        shortlist: pkgShortlist && pkgShortlist.length ? pkgShortlist : undefined,
        booking: bookingData || undefined,
        reply: menuReply,
      });
      return { enquiryId: enquiry.id, language: lang, reply: menuReply, status: 'auto_answered', escalated: false, menu: menuChoice.id, menuRoute: pkgShortlist && pkgShortlist.length ? 'product_shortlist' : storedRoute };
    }

    if (menu.isGreeting(sanitized)) {
      const welcome = menu.buildWelcome();
      await sender.send(from, welcome);
      store.update('enquiries', enquiry.id, {
        language: lang,
        languageConfidence: langConfidence,
        status: 'auto_answered',
        menuRoute: 'welcome',
        reply: welcome,
      });
      return { enquiryId: enquiry.id, language: lang, reply: welcome, status: 'auto_answered', escalated: false, greeting: true };
    }

    // A bare number outside 1-8 ("0", "99") is an invalid menu pick, not a
    // product query. Skip this while mid-selection (the number is a selection
    // or quantity, handled below).
    const invalidNum = midSelection ? null : menu.detectInvalidMenuNumber(sanitized);
    if (invalidNum) {
      const reply = menu.buildInvalidOption(invalidNum);
      await sender.send(from, reply);
      store.update('enquiries', enquiry.id, {
        language: lang,
        languageConfidence: langConfidence,
        status: 'auto_answered',
        menuRoute: 'invalid_option',
        reply,
      });
      return { enquiryId: enquiry.id, language: lang, reply, status: 'auto_answered', escalated: false, invalidOption: invalidNum };
    }

    const priorRouteEnq = lastPriorEnquiry(from, enquiry.id);

    // 4a. ONSITE REPAIR BOOKING (menu 4). Structured, numbered multi-step flow
    // that ends in a confirmed booking (OS-YYYYMMDD-NNN):
    //   service type -> date -> time slot -> details -> CONFIRMED.
    // Entry points: picking menu 4 ('onsite'), being mid-flow, OR typing an
    // ADDRESS directly (we recognise it and jump to the address-aware step).
    {
      const onsiteRoute = priorRouteEnq && String(priorRouteEnq.menuRoute || '');
      const inOnsiteBooking = onsiteRoute && onsiteRoute.startsWith('onsite_book');
      const startedOnsite = onsiteRoute === 'onsite'; // just picked menu 4
      const looksAddr = onsite.looksLikeAddress(sanitized);
      const freeTextAddressStart = !inOnsiteBooking && !startedOnsite && looksAddr;

      if (startedOnsite || inOnsiteBooking || freeTextAddressStart) {
        const bkLang = (priorRouteEnq && priorRouteEnq.language) || lang;
        const data = (priorRouteEnq && priorRouteEnq.booking) ? { ...priorRouteEnq.booking } : {};
        let reply;
        let route;
        let created = null;

        if (freeTextAddressStart) {
          // Customer typed an address without choosing option 4: start the
          // onsite booking and pre-fill the address, then ask for service type.
          data.address = sanitized;
          reply = buildOnsiteServicePicker(bkLang);
          route = 'onsite_book_service';
        } else if (startedOnsite) {
          // Step 1: choose the service type.
          reply = buildOnsiteServicePicker(bkLang);
          route = 'onsite_book_service';
        } else if (onsiteRoute === 'onsite_book_service') {
          const choice = booking.parseChoice(sanitized, booking.ONSITE_SERVICES.length);
          const svc = choice ? booking.serviceById(choice) : null;
          if (!svc) {
            reply = i18n.t(bkLang, 'book_choice_invalid') + '\n\n' + buildOnsiteServicePicker(bkLang);
            route = 'onsite_book_service';
          } else {
            data.serviceKey = svc.key;
            data.serviceLabel = booking.label(svc, bkLang);
            data.dates = booking.availableDates();
            reply = buildDatePicker(bkLang, data.dates);
            route = 'onsite_book_date';
          }
        } else if (onsiteRoute === 'onsite_book_date') {
          const dates = data.dates || booking.availableDates();
          const choice = booking.parseChoice(sanitized, dates.length);
          const picked = choice ? dates[choice - 1] : null;
          if (!picked) {
            reply = i18n.t(bkLang, 'book_choice_invalid') + '\n\n' + buildDatePicker(bkLang, dates);
            route = 'onsite_book_date';
          } else {
            data.dateIso = picked.iso;
            data.dateLabel = picked.label;
            reply = buildSlotPicker(bkLang);
            route = 'onsite_book_slot';
          }
        } else if (onsiteRoute === 'onsite_book_slot') {
          const choice = booking.parseChoice(sanitized, booking.TIME_SLOTS.length);
          const slot = choice ? booking.slotById(choice) : null;
          if (!slot) {
            reply = i18n.t(bkLang, 'book_choice_invalid') + '\n\n' + buildSlotPicker(bkLang);
            route = 'onsite_book_slot';
          } else {
            data.slotLabel = slot.label;
            reply = withNavHint(i18n.t(bkLang, 'onsite_book_details'), bkLang);
            route = 'onsite_book_details';
          }
        } else if (onsiteRoute === 'onsite_book_details') {
          // Final step: the message carries name/address/phone/problem. We keep
          // the whole text as the details and try to split out an address/phone.
          const parts = sanitized.split(/\s*[,|;]\s*/).filter(Boolean);
          data.customerName = data.customerName || parts[0] || null;
          const phoneMatch = sanitized.match(/(?:\+?65[\s-]?)?\b\d{7,8}\b/);
          data.phone = phoneMatch ? phoneMatch[0] : (data.phone || null);
          if (!data.address) {
            const addrPart = parts.find((p) => onsite.looksLikeAddress(p));
            data.address = addrPart || parts[1] || sanitized;
          }
          data.problem = parts[parts.length - 1] || sanitized;
          created = booking.createOnsiteBooking({
            from,
            serviceKey: data.serviceKey,
            serviceLabel: data.serviceLabel,
            dateIso: data.dateIso,
            dateLabel: data.dateLabel,
            slotLabel: data.slotLabel,
            customerName: data.customerName,
            address: data.address,
            phone: data.phone,
            problem: data.problem,
            lang: bkLang,
          });
          reply = i18n.t(bkLang, 'onsite_book_confirmed', {
            ref: created.ref,
            service: created.serviceLabel || '-',
            date: created.dateLabel || '-',
            slot: created.slotLabel || '-',
            name: created.customerName || '-',
            address: created.address || '-',
            phone: created.phone || '-',
            problem: created.problem || '-',
          });
          route = 'onsite_book_confirmed';
        } else {
          // Fallback: (re)start the onsite booking at step 1.
          reply = buildOnsiteServicePicker(bkLang);
          route = 'onsite_book_service';
        }

        await sender.send(from, reply);
        const isComplete = route === 'onsite_book_confirmed';
        store.update('enquiries', enquiry.id, {
          language: bkLang,
          languageConfidence: langConfidence,
          status: isComplete ? 'pending' : 'auto_answered',
          menuRoute: route,
          booking: data,
          bookingRef: created ? created.ref : (priorRouteEnq && priorRouteEnq.bookingRef) || null,
          reply,
        });
        if (isComplete && created) {
          store.create(
            'escalations',
            {
              enquiryId: enquiry.id,
              reason: 'onsite_booking',
              status: 'pending',
              details: `Booking ${created.ref} | ${created.serviceLabel} | ${created.dateLabel} ${created.slotLabel} | ${created.address}`,
              bookingRef: created.ref,
              createdAt: new Date().toISOString(),
            },
            'esc'
          );
        }
        return {
          enquiryId: enquiry.id,
          language: bkLang,
          reply,
          status: isComplete ? 'pending' : 'auto_answered',
          escalated: isComplete,
          reason: isComplete ? 'onsite_booking' : undefined,
          menuRoute: route,
          bookingRef: created ? created.ref : undefined,
        };
      }
    }

    // 4a-2. CARRY-IN SERVICE BOOKING (menu 3). Structured, numbered flow ending
    // in a booking (CI-YYYYMMDD-NNN): date -> device -> problem -> Awaiting Drop-Off.
    {
      const ciRoute = priorRouteEnq && String(priorRouteEnq.menuRoute || '');
      const inCarryInBooking = ciRoute && ciRoute.startsWith('carry_in_book');
      const startedCarryIn = ciRoute === 'repair'; // just picked menu 3

      if (startedCarryIn || inCarryInBooking) {
        const bkLang = (priorRouteEnq && priorRouteEnq.language) || lang;
        const data = (priorRouteEnq && priorRouteEnq.booking) ? { ...priorRouteEnq.booking } : {};
        let reply;
        let route;
        let created = null;

        if (startedCarryIn) {
          data.dates = booking.availableDates();
          reply = buildDatePicker(bkLang, data.dates);
          route = 'carry_in_book_date';
        } else if (ciRoute === 'carry_in_book_date') {
          const dates = data.dates || booking.availableDates();
          const choice = booking.parseChoice(sanitized, dates.length);
          const picked = choice ? dates[choice - 1] : null;
          if (!picked) {
            reply = i18n.t(bkLang, 'book_choice_invalid') + '\n\n' + buildDatePicker(bkLang, dates);
            route = 'carry_in_book_date';
          } else {
            data.dateIso = picked.iso;
            data.dateLabel = picked.label;
            reply = buildSlotPicker(bkLang);
            route = 'carry_in_book_slot';
          }
        } else if (ciRoute === 'carry_in_book_slot') {
          const choice = booking.parseChoice(sanitized, booking.TIME_SLOTS.length);
          const slot = choice ? booking.slotById(choice) : null;
          if (!slot) {
            reply = i18n.t(bkLang, 'book_choice_invalid') + '\n\n' + buildSlotPicker(bkLang);
            route = 'carry_in_book_slot';
          } else {
            data.slotLabel = slot.label;
            reply = buildCarryInDevicePicker(bkLang);
            route = 'carry_in_book_device';
          }
        } else if (ciRoute === 'carry_in_book_device') {
          const choice = booking.parseChoice(sanitized, booking.CARRY_IN_DEVICES.length);
          const dev = choice ? booking.deviceById(choice) : null;
          if (!dev) {
            reply = i18n.t(bkLang, 'book_choice_invalid') + '\n\n' + buildCarryInDevicePicker(bkLang);
            route = 'carry_in_book_device';
          } else {
            data.deviceKey = dev.key;
            data.deviceLabel = booking.label(dev, bkLang);
            reply = withNavHint(i18n.t(bkLang, 'carry_in_book_problem'), bkLang);
            route = 'carry_in_book_problem';
          }
        } else if (ciRoute === 'carry_in_book_problem') {
          data.problem = sanitized;
          created = booking.createCarryInBooking({
            from,
            deviceKey: data.deviceKey,
            deviceLabel: data.deviceLabel,
            dateIso: data.dateIso,
            dateLabel: data.dateLabel,
            slotLabel: data.slotLabel,
            problem: data.problem,
            lang: bkLang,
          });
          reply = i18n.t(bkLang, 'carry_in_book_confirmed', {
            ref: created.ref,
            device: created.deviceLabel || '-',
            problem: created.problem || '-',
            date: created.dateLabel || '-',
            slot: created.slotLabel || '-',
          });
          route = 'carry_in_book_confirmed';
        } else {
          data.dates = booking.availableDates();
          reply = buildDatePicker(bkLang, data.dates);
          route = 'carry_in_book_date';
        }

        await sender.send(from, reply);
        const isComplete = route === 'carry_in_book_confirmed';
        store.update('enquiries', enquiry.id, {
          language: bkLang,
          languageConfidence: langConfidence,
          status: isComplete ? 'pending' : 'auto_answered',
          menuRoute: route,
          booking: data,
          bookingRef: created ? created.ref : (priorRouteEnq && priorRouteEnq.bookingRef) || null,
          reply,
        });
        if (isComplete && created) {
          store.create(
            'escalations',
            {
              enquiryId: enquiry.id,
              reason: 'carry_in_booking',
              status: 'pending',
              details: `Booking ${created.ref} | ${created.deviceLabel} | ${created.dateLabel} ${created.slotLabel} | ${created.problem}`,
              bookingRef: created.ref,
              createdAt: new Date().toISOString(),
            },
            'esc'
          );
        }
        return {
          enquiryId: enquiry.id,
          language: bkLang,
          reply,
          status: isComplete ? 'pending' : 'auto_answered',
          escalated: isComplete,
          reason: isComplete ? 'carry_in_booking' : undefined,
          menuRoute: route,
          bookingRef: created ? created.ref : undefined,
        };
      }
    }

    // 4b. Delivery-status lookup. Two triggers:
    //   (i) the message contains a delivery-order number (e.g. DO202600001) -
    //       unambiguous, so we look it up wherever it appears; or
    //  (ii) the customer's PREVIOUS message chose "Delivery Status" (menu 8),
    //       so this reply is their order no / name / phone to look up.
    // 4a-3. WARRANTY: after a warranty result, "1/2/3" hands off to a service
    // action (onsite booking / carry-in booking / talk to service).
    const priorWarrantyEnq = lastPriorEnquiry(from, enquiry.id);
    if (priorWarrantyEnq && priorWarrantyEnq.menuRoute === 'warranty_result') {
      const wLang = priorWarrantyEnq.language || lang;
      const pick = sanitized.trim().match(/^(?:option\s*|#\s*)?([123])\b\.?$/);
      if (pick) {
        const choice = parseInt(pick[1], 10);
        if (choice === 1) {
          // -> Onsite booking (start at the service-type picker).
          const reply = buildOnsiteServicePicker(wLang);
          await sender.send(from, reply);
          store.update('enquiries', enquiry.id, {
            language: wLang, languageConfidence: langConfidence, status: 'auto_answered',
            menuRoute: 'onsite_book_service', booking: {}, reply,
          });
          return { enquiryId: enquiry.id, language: wLang, reply, status: 'auto_answered', escalated: false, menuRoute: 'onsite_book_service', fromWarranty: true };
        }
        if (choice === 2) {
          // -> Carry-in booking (start at the date picker).
          const dates = booking.availableDates();
          const reply = buildDatePicker(wLang, dates);
          await sender.send(from, reply);
          store.update('enquiries', enquiry.id, {
            language: wLang, languageConfidence: langConfidence, status: 'auto_answered',
            menuRoute: 'carry_in_book_date', booking: { dates }, reply,
          });
          return { enquiryId: enquiry.id, language: wLang, reply, status: 'auto_answered', escalated: false, menuRoute: 'carry_in_book_date', fromWarranty: true };
        }
        // choice === 3 -> talk to the service team (escalate).
        const ack = escalation.acknowledgementFor(wLang);
        await sender.send(from, ack);
        store.update('enquiries', enquiry.id, {
          language: wLang, languageConfidence: langConfidence, status: 'pending', menuRoute: 'warranty_service', reply: ack,
        });
        store.create('escalations', { enquiryId: enquiry.id, reason: 'warranty_service', status: 'pending', createdAt: new Date().toISOString() }, 'esc');
        return { enquiryId: enquiry.id, language: wLang, reply: ack, status: 'pending', escalated: true, reason: 'warranty_service' };
      }
      // Not 1/2/3: re-prompt the options.
      const reply = i18n.t(wLang, 'warranty_option_invalid');
      await sender.send(from, reply);
      store.update('enquiries', enquiry.id, {
        language: wLang, languageConfidence: langConfidence, status: 'auto_answered', menuRoute: 'warranty_result', reply,
      });
      return { enquiryId: enquiry.id, language: wLang, reply, status: 'auto_answered', escalated: false, menuRoute: 'warranty_result' };
    }

    // 4a-4. WARRANTY lookup. Triggers when the message contains a serial or
    // invoice number (unambiguous, looked up wherever it appears), OR when the
    // customer's previous message was the Warranty Status prompt (menu 8).
    const askedWarrantyBefore = wasLastRouteWarranty(from, enquiry.id);
    if (warranty.looksLikeSerial(sanitized) || warranty.looksLikeInvoice(sanitized) || askedWarrantyBefore) {
      const wLang = (priorWarrantyEnq && priorWarrantyEnq.language) || lang;
      const result = warranty.lookup(sanitized, wLang);
      await sender.send(from, result.reply);
      store.update('enquiries', enquiry.id, {
        language: wLang,
        languageConfidence: langConfidence,
        status: 'auto_answered',
        // A single found record -> offer 1/2/3 next; otherwise stay on the
        // warranty prompt so a follow-up (correct serial) still looks up.
        menuRoute: result.found && result.record ? 'warranty_result' : 'warranty',
        warrantySerial: result.record ? result.record.serial : undefined,
        reply: result.reply,
      });
      return {
        enquiryId: enquiry.id,
        language: wLang,
        reply: result.reply,
        status: 'auto_answered',
        escalated: false,
        warrantyFound: result.found,
        warrantyMatches: result.matches.length,
      };
    }

    const askedDeliveryBefore = wasLastRouteDeliveryStatus(from, enquiry.id);
    if (delivery.looksLikeOrderNo(sanitized) || askedDeliveryBefore) {
      const result = delivery.lookup(sanitized);
      await sender.send(from, result.reply);
      store.update('enquiries', enquiry.id, {
        language: lang,
        languageConfidence: langConfidence,
        status: 'auto_answered',
        reply: result.reply,
        // Keep the delivery-status route sticky while not found, so a follow-up
        // (e.g. they first typed a wrong name, then the correct one) still looks
        // up rather than falling through to product/AI.
        menuRoute: result.found ? 'delivery_result' : 'delivery_status',
      });
      return {
        enquiryId: enquiry.id,
        language: lang,
        reply: result.reply,
        status: 'auto_answered',
        escalated: false,
        deliveryFound: result.found,
        deliveryMatches: result.matches.length,
      };
    }

    // 4b-0. Guided selection flow (numbered shortlist -> quantity -> quotation).
    //   (a) If the previous message was a numbered product shortlist and the
    //       customer replied with a number (1-5), select that item and ask qty.
    //   (b) If the previous message asked for quantity, build the quotation.
    const priorEnq = lastPriorEnquiry(from, enquiry.id);
    // Carry the conversation language forward: a follow-up like "2" or "confirm"
    // detects as English, but the customer's thread language is on the prior
    // enquiry. Use it so quotation/selection replies stay in their language.
    const flowLang = (priorEnq && priorEnq.language) || lang;

    // (a) after a shortlist, the customer can either:
    //   - reply with a NUMBER (1-5)  -> select, then ask quantity, OR
    //   - TYPE the item name loosely  -> quote 1 unit immediately (no need to
    //     type the exact words or a quantity).
    if (priorEnq && priorEnq.menuRoute === 'product_shortlist' && Array.isArray(priorEnq.shortlist)) {
      const sel = salesflow.parseSelectionNumber(sanitized, priorEnq.shortlist.length);
      if (sel) {
        const item = priorEnq.shortlist[sel - 1];
        const reply = withNavHint(salesflow.askQuantity(item, flowLang), flowLang);
        await sender.send(from, reply);
        store.update('enquiries', enquiry.id, {
          language: flowLang, // carry the thread language forward
          languageConfidence: langConfidence,
          status: 'auto_answered',
          menuRoute: 'awaiting_quantity',
          selectedItem: item,
          priorShortlist: priorEnq.shortlist, // keep for "back" to the shortlist
          reply,
        });
        return { enquiryId: enquiry.id, language: lang, reply, status: 'auto_answered', escalated: false, selected: item.id };
      }
      // Fuzzy name match against the shortlist -> immediate 1-unit quotation.
      const picked = salesflow.matchShortlistByName(sanitized, priorEnq.shortlist);
      if (picked) {
        const qty = salesflow.parseQuantityReply(sanitized) || 1; // default 1 unit
        const ref = `Q-${(enquiry.id || '').slice(-6).toUpperCase() || Date.now().toString(36).toUpperCase()}`;
        const fullPicked = store.list('products').find((p) => p.id === picked.id);
        const reply =
          fullPicked && fullPicked.category === 'pc_bundle'
            ? product.formatQuotationReply(fullPicked, qty, ref)
            : salesflow.buildQuotation(picked, qty, ref, flowLang);
        await sender.send(from, reply);
        store.update('enquiries', enquiry.id, {
          language: flowLang,
          languageConfidence: langConfidence,
          status: 'auto_answered',
          menuRoute: 'quotation',
          quotedProductId: picked.id,
          quotedQuantity: qty,
          reply,
        });
        return { enquiryId: enquiry.id, language: lang, reply, status: 'auto_answered', escalated: false, quoted: true, quotedQuantity: qty };
      }
    }

    // (b) quantity after a selection
    if (priorEnq && priorEnq.menuRoute === 'awaiting_quantity' && priorEnq.selectedItem) {
      const qty = salesflow.parseQuantityReply(sanitized);
      if (qty) {
        const item = priorEnq.selectedItem;
        const ref = `Q-${(enquiry.id || '').slice(-6).toUpperCase() || Date.now().toString(36).toUpperCase()}`;
        // For a PC package, use the richer quotation that shows the full
        // "What's included" component breakdown (look up the full product by id).
        const fullProduct = store.list('products').find((p) => p.id === item.id);
        const reply =
          fullProduct && fullProduct.category === 'pc_bundle'
            ? product.formatQuotationReply(fullProduct, qty, ref)
            : salesflow.buildQuotation(item, qty, ref, flowLang);
        await sender.send(from, reply);
        store.update('enquiries', enquiry.id, {
          language: flowLang,
          languageConfidence: langConfidence,
          status: 'auto_answered',
          menuRoute: 'quotation',
          quotedProductId: item.id,
          quotedQuantity: qty,
          reply,
        });
        return { enquiryId: enquiry.id, language: lang, reply, status: 'auto_answered', escalated: false, quoted: true, quotedQuantity: qty };
      }
    }

    // 4b-2. "confirm" after a quotation -> offer PAYMENT (conversational
    // commerce). The customer's previous message was a quotation (menuRoute
    // 'quotation'); "confirm"/"yes"/"proceed" now moves them into the payment
    // step: we show the payment methods and remember the quoted item/amount so
    // the chosen method can generate a secure (simulated) payment link.
    const priorForConfirm = lastPriorEnquiry(from, enquiry.id);
    const isConfirmWord = /^(confirm|confirmed|proceed|yes|ok|okay|yes please|go ahead)\.?$/i.test(sanitized.trim());
    if (isConfirmWord && priorForConfirm && priorForConfirm.menuRoute === 'quotation') {
      const flowLang = priorForConfirm.language || lang;
      // Resolve the quoted product + amount from the stored quotation.
      const quotedId = priorForConfirm.quotedProductId || null;
      const quotedQty = Number(priorForConfirm.quotedQuantity) || 1;
      const quotedProduct = quotedId ? store.list('products').find((p) => p.id === quotedId) : null;
      const unitPrice = quotedProduct ? Number(quotedProduct.price) || 0 : 0;
      const amount = Math.round(unitPrice * quotedQty * 100) / 100;
      const cur = (quotedProduct && quotedProduct.currency) || 'SGD';
      const quoteRef = payment.newQuoteRef().ref;

      const reply = withNavHint(i18n.t(flowLang, 'pay_choose_method', { quoteRef, cur, amount }), flowLang);
      await sender.send(from, reply);
      store.update('enquiries', enquiry.id, {
        language: flowLang,
        languageConfidence: langConfidence,
        status: 'auto_answered',
        menuRoute: 'payment_method',
        quoteRef,
        quotedProductId: quotedId,
        quotedQuantity: quotedQty,
        quotedUnitPrice: unitPrice,
        quotedAmount: amount,
        quotedCurrency: cur,
        quotedProductName: quotedProduct ? quotedProduct.name : (priorForConfirm.quotedProductName || null),
        reply,
      });
      return {
        enquiryId: enquiry.id,
        language: flowLang,
        reply,
        status: 'auto_answered',
        escalated: false,
        menuRoute: 'payment_method',
        quoteRef,
        amount,
      };
    }

    // 4b-3. Payment-method selection after a confirmed quotation. The prior
    // message offered "1. Card / 2. PayNow"; a reply of 1/2 (or the method
    // word) generates a pending payment and returns the secure (test) pay link.
    if (priorForConfirm && priorForConfirm.menuRoute === 'payment_method') {
      const flowLang = priorForConfirm.language || lang;
      const t = sanitized.trim().toLowerCase();
      let method = null;
      if (/^1\b|card|credit|debit|visa|master/.test(t)) method = 'card';
      else if (/^2\b|paynow|pay now|sgqr|qr/.test(t)) method = 'paynow';

      if (!method) {
        const reply = i18n.t(flowLang, 'pay_method_invalid');
        await sender.send(from, reply);
        store.update('enquiries', enquiry.id, {
          language: flowLang,
          languageConfidence: langConfidence,
          status: 'auto_answered',
          menuRoute: 'payment_method', // stay on this step
          // carry the quote details forward so a valid retry still has them
          quoteRef: priorForConfirm.quoteRef,
          quotedProductId: priorForConfirm.quotedProductId,
          quotedQuantity: priorForConfirm.quotedQuantity,
          quotedUnitPrice: priorForConfirm.quotedUnitPrice,
          quotedAmount: priorForConfirm.quotedAmount,
          quotedCurrency: priorForConfirm.quotedCurrency,
          quotedProductName: priorForConfirm.quotedProductName,
          reply,
        });
        return { enquiryId: enquiry.id, language: flowLang, reply, status: 'auto_answered', escalated: false, menuRoute: 'payment_method' };
      }

      const { payment: payRec, payUrl } = payment.createPayment({
        from,
        method,
        productId: priorForConfirm.quotedProductId,
        productName: priorForConfirm.quotedProductName,
        quantity: priorForConfirm.quotedQuantity,
        unitPrice: priorForConfirm.quotedUnitPrice,
        amount: priorForConfirm.quotedAmount,
        currency: priorForConfirm.quotedCurrency,
        quoteRef: priorForConfirm.quoteRef,
        lang: flowLang,
      });
      const methodLabel = (payment.PAYMENT_METHODS.find((m) => m.id === method) || {}).label || 'Card';
      const reply = i18n.t(flowLang, 'pay_link', {
        methodLabel,
        cur: payRec.currency,
        amount: payRec.amount,
        quoteRef: payRec.quoteRef,
        payUrl,
      });
      await sender.send(from, reply);
      store.update('enquiries', enquiry.id, {
        language: flowLang,
        languageConfidence: langConfidence,
        status: 'auto_answered',
        menuRoute: 'payment_pending',
        paymentId: payRec.id,
        reply,
      });
      return {
        enquiryId: enquiry.id,
        language: flowLang,
        reply,
        status: 'auto_answered',
        escalated: false,
        menuRoute: 'payment_pending',
        paymentId: payRec.id,
        payUrl,
      };
    }

    // 4c. Purchase / confirmation -> QUOTATION. When the customer selects a
    // specific item and (optionally) a quantity ("I prefer this PC Package ...,
    // 1 set"), they expect a quotation, not another search. We resolve the
    // product they named from the catalogue and reply with a proper quote.
    if (product.detectPurchaseIntent(sanitized)) {
      const catalogue = store.list('products');
      const matches = product.findProducts(sanitized, catalogue, { limit: 8, minScore: 4 });
      // Disambiguate by the exact price the customer pasted. Many PC packages
      // share the same CPU+GPU name and differ only by price (e.g. $1010 vs
      // $1040), so a quoted line like "... : SGD 1449" pins the exact one.
      const chosen = product.resolvePurchaseChoice(sanitized, matches);
      if (chosen) {
        const qty = product.parseQuantity(sanitized);
        const ref = `Q-${(enquiry.id || '').slice(-6).toUpperCase() || Date.now().toString(36).toUpperCase()}`;
        const quoteReply = product.formatQuotationReply(chosen, qty, ref);
        await sender.send(from, quoteReply);
        store.update('enquiries', enquiry.id, {
          language: lang,
          languageConfidence: langConfidence,
          status: 'auto_answered',
          menuRoute: 'quotation',
          reply: quoteReply,
          quotedProductId: chosen.id,
          quotedQuantity: qty,
        });
        return {
          enquiryId: enquiry.id,
          language: lang,
          reply: quoteReply,
          status: 'auto_answered',
          escalated: false,
          quoted: true,
          quotedProductId: chosen.id,
          quotedQuantity: qty,
        };
      }
      // No clear single item to quote: fall through to normal product search,
      // which will list options and ask the customer to pick one.
    }

    // 5. Match FAQ (Req 3).
    const faqs = store.list('faqs');
    const faqMatch = faq.match(sanitized, lang, faqs);

    // A FAQ only "short-circuits" the product/AI path when it matched STRONGLY.
    // A borderline FAQ hit (e.g. a vague build request grazing the availability
    // FAQ at ~0.63) should defer to the product/AI path so "build me a gaming
    // rig, 2k" isn't answered with a generic stock reply.
    const STRONG_FAQ = 0.75;
    // The pricing/availability FAQs are GENERIC fallbacks ("prices depend on the
    // product..."). If the customer actually named a product ("keyboard how
    // much?"), the concrete product answer should win over these two - so we
    // always try the product path when they match, even strongly.
    const GENERIC_FAQS = new Set(['faq_pricing', 'faq_availability']);
    const faqIsGeneric = faqMatch.matched && GENERIC_FAQS.has(faqMatch.faqId);
    const faqIsStrong = faqMatch.matched && faqMatch.confidence >= STRONG_FAQ && !faqIsGeneric;
    const tryProductPath = !faqIsStrong;

    // 6. Product enrichment: if no strong FAQ, try the catalogue.
    //    6a. First, deterministic budget-aware search (fast, always available).
    //    6b. If AI is enabled, ask OpenClaw to interpret the (possibly vague)
    //        message, then re-search using its category/keywords/budget. Falls
    //        back safely to the deterministic result.
    let productResult = null;
    let aiUsed = false;
    let aiDomain = null;
    let aiWantsHuman = false;

    if (tryProductPath) {
      // Component-not-stocked guard: if the customer explicitly asks for a
      // component CATEGORY we don't hold as a standalone item (e.g. CPUs), do
      // NOT answer with PC packages dressed up as that component. Reply
      // honestly and offer the complete builds + a sales handoff instead.
      const askedCategory = product.detectComponentCategory(sanitized);
      const NOT_STOCKED_STANDALONE = ['cpu', 'motherboard'];
      const catalogueForGuard = store.list('products');
      if (
        askedCategory &&
        NOT_STOCKED_STANDALONE.includes(askedCategory) &&
        !product.categoryHasStock(askedCategory, catalogueForGuard)
      ) {
        const label = product.CATEGORY_LABELS[askedCategory] || askedCategory;
        const reply = product.formatComponentNotStocked(label, sanitized, catalogueForGuard);
        await sender.send(from, reply);
        store.update('enquiries', enquiry.id, {
          language: lang,
          languageConfidence: langConfidence,
          status: 'auto_answered',
          menuRoute: 'component_not_stocked',
          reply,
        });
        return {
          enquiryId: enquiry.id,
          language: lang,
          reply,
          status: 'auto_answered',
          escalated: false,
          notStocked: askedCategory,
        };
      }

      // Deterministic budget-aware search first (fast, always available).
      productResult = product.findProductsWithBudget(sanitized, store.list('products'));

      // When AI is enabled, let OpenClaw interpret the message too. It runs on
      // the whole product path (not only when deterministic found nothing) so
      // it can (a) understand vague phrasing keyword-matching misses and
      // (b) surface an explicit human request. Its result is used only if it
      // finds something; otherwise the deterministic result stands (fallback).
      if (openclaw.isEnabled()) {
        const intent = await openclaw.extractIntent(sanitized);
        if (intent) {
          aiUsed = true;
          aiDomain = intent.domain;
          aiWantsHuman = intent.wantsHuman;

          // Build an enriched query from AI-understood keywords + category.
          const aiTerms = [...(intent.keywords || [])];
          if (intent.category && intent.category !== 'other') aiTerms.push(intent.category);
          const enrichedQuery = aiTerms.join(' ').trim();

          if (enrichedQuery) {
            const aiSearch = product.findProductsWithBudget(
              enrichedQuery,
              store.list('products'),
              intent.maxPrice != null ? { maxPrice: null } : {}
            );
            // Apply the AI's explicit budget, if any.
            if (intent.maxPrice != null) {
              const all = [...aiSearch.withinBudget, ...aiSearch.overBudget];
              aiSearch.budget = intent.maxPrice;
              aiSearch.withinBudget = all.filter((m) => Number(m.product.price) <= intent.maxPrice);
              aiSearch.overBudget = all
                .filter((m) => Number(m.product.price) > intent.maxPrice)
                .sort((a, b) => Number(a.product.price) - Number(b.product.price));
              aiSearch.matched = aiSearch.withinBudget.length > 0 || aiSearch.overBudget.length > 0;
            }
            // Prefer the AI-enriched result when it found something relevant.
            if (aiSearch.matched) {
              productResult = aiSearch;
            }
          }
        }
      }
    }

    // Choose the answer source. Priority:
    //   1. a concrete product/quote result (from deterministic or AI search)
    //   2. any FAQ match (strong, or a weak one that had no better product hit)
    const hasProduct = Boolean(productResult && productResult.matched);
    const useProductAnswer = hasProduct;
    const useFaqAnswer = !useProductAnswer && faqMatch.matched;

    // 7. Decide auto-answer vs escalate (Req 4). Answerable if we have a product
    // result or a usable FAQ. An explicit AI-detected human request forces
    // escalation regardless.
    const canAnswer = !aiWantsHuman && (useProductAnswer || useFaqAnswer);
    const decision = escalation.decide({
      faqMatch: { matched: canAnswer },
      text: aiWantsHuman ? 'talk to a person' : sanitized,
      language: lang,
    });

    let reply;
    let outcome;

    if (decision.escalate) {
      // 8a. Escalation path: localized acknowledgement (Req 4.4).
      reply = decision.acknowledgement;
      await sender.send(from, reply);

      // 9a. Mark pending + create an escalation record (Req 4.3).
      store.update('enquiries', enquiry.id, {
        language: lang,
        languageConfidence: langConfidence,
        status: 'pending',
        matchedFaqId: null,
        matchConfidence: faqMatch.confidence || 0,
        reply, // store the ack so the dashboard can show the conversation
      });
      store.create(
        'escalations',
        {
          enquiryId: enquiry.id,
          reason: decision.reason,
          status: 'pending',
          createdAt: new Date().toISOString(),
        },
        'esc'
      );

      outcome = {
        status: 'pending',
        escalated: true,
        reason: decision.reason,
      };
    } else {
      // 8b. Auto-answer path: FAQ answer, or a product/quote reply.
      let answerLanguage = lang;
      let fallbackLanguageUsed = false;
      let matchedFaqId = null;
      let matchConfidence = 0;

      let productShortlist = null;
      if (useProductAnswer) {
        const pa = formatProductAnswer(productResult, 'SGD', lang);
        reply = pa && pa.reply;
        productShortlist = pa && pa.shortlist;
      } else {
        // useFaqAnswer
        reply = faqMatch.answer;
        answerLanguage = faqMatch.language;
        fallbackLanguageUsed = faqMatch.fallbackLanguageUsed;
        matchedFaqId = faqMatch.faqId;
        matchConfidence = faqMatch.confidence;
      }

      await sender.send(from, reply);

      // 9b. Record the auto-answer outcome (Req 3.4). When we showed a numbered
      // product shortlist, store it + mark the route so a follow-up bare number
      // (1-5) selects that item.
      store.update('enquiries', enquiry.id, {
        language: lang,
        languageConfidence: langConfidence,
        status: 'auto_answered',
        matchedFaqId,
        matchConfidence,
        fallbackLanguageUsed,
        answerLanguage,
        aiUsed,
        aiDomain,
        reply, // store the answer so the dashboard can show the conversation
        menuRoute: productShortlist && productShortlist.length ? 'product_shortlist' : undefined,
        shortlist: productShortlist && productShortlist.length ? productShortlist : undefined,
      });

      outcome = {
        status: 'auto_answered',
        escalated: false,
        aiUsed,
        matchedFaqId,
        fallbackLanguageUsed,
      };
    }

    // 10. Return the bot reply for inspection (Req 8.2).
    return {
      enquiryId: enquiry.id,
      language: lang,
      reply,
      ...outcome,
    };
  } catch (err) {
    // Reliability: never crash on one enquiry. Log server-side, escalate safely.
    // eslint-disable-next-line no-console
    console.error(`[webhook] Error handling enquiry ${enquiry.id}:`, err.message);

    const ack = escalation.acknowledgementFor('en');
    try {
      await sender.send(from, ack);
    } catch (_sendErr) {
      // If even the ack fails, still record the escalation below.
    }
    store.update('enquiries', enquiry.id, { status: 'pending' });
    store.create(
      'escalations',
      {
        enquiryId: enquiry.id,
        reason: 'low_confidence',
        status: 'pending',
        createdAt: new Date().toISOString(),
        note: 'auto-escalated after processing error',
      },
      'esc'
    );

    return {
      enquiryId: enquiry.id,
      language: 'en',
      reply: ack,
      status: 'pending',
      escalated: true,
      reason: 'low_confidence',
    };
  }
}

/**
 * Build the DIY PC Package reply (menu option 2).
 *
 * The catalogue has many packages that share the same CPU+GPU build and differ
 * only by price (e.g. the same "i3-14100 + Integrated Graphics" at $500/$510/
 * $530...). Listing each is noisy, so we COLLAPSE same-spec packages into ONE
 * line showing a price range ("from SGD 500" when it's a spread, or a single
 * price when there's only one). Grouped lines are then bucketed by budget tier
 * using the group's lowest price.
 */
function formatPcPackages() {
  const pkgs = store.list('products').filter((p) => p.category === 'pc_bundle');
  if (pkgs.length === 0) return null;

  // Group by spec name (text after "PC Package - "); keep the CHEAPEST product
  // of each group as the representative (one selectable item per distinct build).
  const groups = new Map();
  for (const p of pkgs) {
    const spec = p.name.replace(/^PC Package - /, '');
    const cur = groups.get(spec);
    if (!cur || Number(p.price) < Number(cur.price)) groups.set(spec, p);
  }
  const reps = [...groups.values()].sort((a, b) => Number(a.price) - Number(b.price));

  // A short component summary in brackets: (CPU · Motherboard · RAM · SSD ·
  // GPU · PSU · Case). Built from each package's structured specs.
  const bracketSummary = (p) => {
    if (!Array.isArray(p.specs) || !p.specs.length) return '';
    const wanted = ['Processor (CPU)', 'Motherboard', 'Memory (RAM)', 'Storage', 'Graphics (GPU)', 'Power Supply (PSU)', 'Case'];
    const parts = [];
    for (const label of wanted) {
      const s = p.specs.find((x) => x && x.label === label);
      if (s) parts.push(s.value);
    }
    return parts.length ? ` (${parts.join(' · ')})` : '';
  };

  const tiers = [
    { label: 'Entry (under SGD 1,500)', min: 0, max: 1500 },
    { label: 'Mid-range (SGD 1,500 - 3,000)', min: 1500, max: 3000 },
    { label: 'High-end (above SGD 3,000)', min: 3000, max: Infinity },
  ];

  const lines = ['🛠️ Our DIY PC Packages (each is a complete, ready-to-build set — single price includes all listed parts):'];
  const shortlist = [];
  let n = 0;
  for (const t of tiers) {
    const inTier = reps.filter((p) => Number(p.price) >= t.min && Number(p.price) < t.max).slice(0, 4);
    if (inTier.length === 0) continue;
    lines.push('');
    lines.push(`— ${t.label} —`);
    for (const p of inTier) {
      n += 1;
      const spec = p.name.replace(/^PC Package - /, '');
      lines.push(`${n}. ${spec}${bracketSummary(p)} — SGD ${p.price}`);
      shortlist.push({
        id: p.id,
        name: p.name,
        price: Number(p.price),
        currency: p.currency || 'SGD',
        priceNote: p.priceNote || null,
      });
    }
  }
  lines.push('');
  lines.push(
    `Reply with the number (1-${shortlist.length}) of the package you want, or just type its name — ` +
      "I'll prepare a quotation with the full component list."
  );
  return { reply: lines.join('\n'), shortlist };
}

/**
 * Build the numbered "5 similar items" reply from a list of catalogue products.
 * Every item is numbered in sequence, with brand/model and unit price.
 */
function formatIdentifiedList(label, items, currency, limited) {
  const cur = currency || 'SGD';
  const lines = [];
  const lead = limited
    ? `I think this looks like a ${label} (image type has limited accuracy, please confirm).`
    : `I think this looks like a ${label}. Here are options we carry:`;
  lines.push(lead);
  items.forEach((p, i) => {
    const stock = stockText(p, 'en');
    lines.push(`${i + 1}. ${p.name} - ${p.currency || cur} ${p.price} (${stock})`);
  });
  lines.push('');
  lines.push('Reply with the number, or just type the item name, and I\'ll prepare a quotation.');
  return lines.join('\n');
}

/**
 * Handle an image-based product enquiry (Option B).
 * @param {{ from, imageBuffer, mime, hint }} input
 */
async function processImageEnquiry({ from, imageBuffer, mime, hint }) {
  const receivedAt = new Date().toISOString();
  const enquiry = store.create(
    'enquiries',
    {
      from,
      text: hint ? `[image] ${sanitizeText(hint)}` : '[image upload]',
      status: 'received',
      receivedAt,
      language: 'en',
      languageConfidence: 1,
      isImage: true,
      resolvedAt: null,
      resolvedBy: null,
    },
    'enq'
  );

  try {
    const identified = await vision.identifyImage(imageBuffer, mime, hint);

    // Validation error (bad type / too large / empty).
    if (identified && identified.error) {
      const msg =
        identified.error === 'unsupported_type'
          ? 'Sorry, please upload a JPG, JPEG or PNG image.'
          : identified.error === 'image_too_large'
          ? 'That image is too large (max 8 MB). Please send a smaller photo.'
          : 'I could not read that image. Please try another photo.';
      await sender.send(from, msg);
      store.update('enquiries', enquiry.id, { status: 'auto_answered', imageError: identified.error });
      return { enquiryId: enquiry.id, reply: msg, status: 'auto_answered', escalated: false, identified: false };
    }

    // Could not identify -> honest fallback (never a wrong guess). Instead of a
    // dead end, tell the customer they can simply TYPE the item name and we'll
    // show prices (which flows into the guided numbered shortlist).
    if (!identified || !identified.category) {
      // Rather than a dead end, offer a quick NUMBERED category picker so the
      // customer can tap what the item is in one step -> then we show prices.
      // We store this as a category shortlist that the next number selects.
      const catShortlist = IMAGE_CATEGORY_PICKS.map((c) => ({ picker: true, category: c.category, label: c.label }));
      const lines = [
        "I couldn't confidently identify the item from that photo. No problem — which of these is it?",
        '',
      ];
      catShortlist.forEach((c, i) => lines.push(`${i + 1}. ${c.label}`));
      lines.push('');
      lines.push('Reply with the number, or just type the item name (e.g. "mouse", "graphics card"). Or reply "sales" to speak with our team.');
      const msg = lines.join('\n');
      await sender.send(from, msg);
      store.update('enquiries', enquiry.id, {
        status: 'auto_answered',
        identified: false,
        menuRoute: 'image_category_pick',
        categoryPicks: catShortlist,
        reply: msg,
      });
      return { enquiryId: enquiry.id, reply: msg, status: 'auto_answered', escalated: false, identified: false };
    }

    // Identified a category -> offer up to 5 numbered items.
    const items = product.listByCategory(identified.category, store.list('products'), 5);
    if (items.length === 0) {
      const msg =
        `I think this is a ${identified.label}, but we don't currently stock that category. ` +
        'Reply 7 to talk to a sales rep, or tell me what else you need.';
      await sender.send(from, msg);
      store.update('enquiries', enquiry.id, { status: 'auto_answered', identifiedCategory: identified.category, identified: true });
      return { enquiryId: enquiry.id, reply: msg, status: 'auto_answered', escalated: false, identified: true, category: identified.category };
    }

    const reply = formatIdentifiedList(identified.label, items, 'SGD', identified.limited);
    await sender.send(from, reply);
    // Store the shortlist so the customer can select by number or name, exactly
    // like the text-based guided flow (select -> quantity -> quotation).
    const shortlist = items.map((p) => ({
      id: p.id,
      name: p.name,
      price: Number(p.price),
      currency: p.currency || 'SGD',
      priceNote: p.priceNote || null,
    }));
    store.update('enquiries', enquiry.id, {
      status: 'auto_answered',
      identified: true,
      identifiedCategory: identified.category,
      visionProvider: identified.provider,
      menuRoute: 'product_shortlist',
      shortlist,
    });
    return {
      enquiryId: enquiry.id,
      reply,
      status: 'auto_answered',
      escalated: false,
      identified: true,
      category: identified.category,
      itemCount: items.length,
    };
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(`[webhook] Error handling image enquiry ${enquiry.id}:`, err.message);
    const ack = escalation.acknowledgementFor('en');
    try { await sender.send(from, ack); } catch (_e) { /* ignore */ }
    store.update('enquiries', enquiry.id, { status: 'pending' });
    store.create(
      'escalations',
      { enquiryId: enquiry.id, reason: 'low_confidence', status: 'pending', createdAt: new Date().toISOString(), note: 'image processing error' },
      'esc'
    );
    return { enquiryId: enquiry.id, reply: ack, status: 'pending', escalated: true, reason: 'low_confidence', identified: false };
  }
}

/** Express handler for POST /webhook. */
async function handleWebhook(req, res) {
  const { from, text } = req.body;
  const result = await processEnquiry({ from, text });
  return res.status(200).json(result);
}

/**
 * Express handler for POST /webhook/image.
 * Body: { from, image (base64, optionally a data: URL), mime, hint? }
 */
async function handleImageWebhook(req, res) {
  const { from, image, mime, hint } = req.body || {};
  if (!from || typeof from !== 'string') {
    return res.status(400).json({ error: 'invalid_payload', message: 'from is required' });
  }
  if (!image || typeof image !== 'string') {
    return res.status(400).json({ error: 'invalid_payload', message: 'image (base64) is required' });
  }
  // Accept a raw base64 string or a data: URL.
  let base64 = image;
  let detectedMime = mime;
  const dataUrl = image.match(/^data:([^;]+);base64,(.*)$/s);
  if (dataUrl) {
    detectedMime = detectedMime || dataUrl[1];
    base64 = dataUrl[2];
  }
  let buffer;
  try {
    buffer = Buffer.from(base64, 'base64');
  } catch (_e) {
    return res.status(400).json({ error: 'invalid_payload', message: 'image is not valid base64' });
  }
  const result = await processImageEnquiry({ from, imageBuffer: buffer, mime: detectedMime, hint });
  return res.status(200).json(result);
}

module.exports = {
  handleWebhook,
  handleImageWebhook,
  processEnquiry,
  processImageEnquiry,
  // exposed for testing
  _internal: { sanitizeText, formatProductAnswer, formatIdentifiedList },
};
