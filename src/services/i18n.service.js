'use strict';

/**
 * Lightweight localization for customer-facing product/quotation/selection
 * replies in English (en), Bahasa Melayu (ms) and Chinese (zh).
 *
 * Usage: t(lang, 'key', { ...vars })
 *   - falls back to English if the language or key is missing.
 *   - {vars} are substituted into the template (e.g. {price}, {n}).
 *
 * Only the STRINGS are localized; product names/prices stay as-is (they are
 * brand/model data). This keeps the assistant replying in the customer's
 * detected language without touching the deterministic catalogue.
 */

const DEFAULT = 'en';

const STRINGS = {
  // Product search intro (no budget) and budget variants.
  found_intro: {
    en: "Here's what I found:",
    ms: 'Ini yang saya jumpa:',
    zh: '以下是我为您找到的：',
  },
  found_under_budget: {
    en: "Here's what we have under {cur} {budget}:",
    ms: 'Ini pilihan kami di bawah {cur} {budget}:',
    zh: '以下是 {cur} {budget} 以内的选择：',
  },
  nothing_fits: {
    en: 'Sorry, nothing fits under {cur} {budget}. Our closest options are:',
    ms: 'Maaf, tiada yang sesuai di bawah {cur} {budget}. Pilihan terdekat kami:',
    zh: '抱歉，{cur} {budget} 以内没有合适的。最接近的选择：',
  },
  // Shortlist footer (select by number or name).
  select_footer: {
    en: "Reply with the number (1-{n}), or just type the item name — I'll prepare a quotation right away.",
    ms: 'Balas dengan nombor (1-{n}), atau taip nama barang — saya akan sediakan sebut harga dengan segera.',
    zh: '回复编号 (1-{n})，或直接输入商品名称，我会立即为您准备报价。',
  },
  // Selection -> ask quantity.
  selected_ask_qty: {
    en: 'You selected: {name} — {cur} {price}.\nHow many units would you like? (e.g. "2")',
    ms: 'Anda pilih: {name} — {cur} {price}.\nBerapa unit yang anda mahu? (cth: "2")',
    zh: '您选择了：{name} — {cur} {price}。\n请问需要多少件？（例如："2"）',
  },
  // Quotation.
  quotation_title: { en: '🧾 Quotation', ms: '🧾 Sebut Harga', zh: '🧾 报价单' },
  quo_item: { en: 'Item: {name}', ms: 'Barang: {name}', zh: '商品：{name}' },
  quo_unit: { en: 'Unit price: {cur} {price}', ms: 'Harga seunit: {cur} {price}', zh: '单价：{cur} {price}' },
  quo_qty: { en: 'Quantity: {qty}', ms: 'Kuantiti: {qty}', zh: '数量：{qty}' },
  quo_stock: { en: 'Stock: {qty} in stock', ms: 'Stok: {qty} dalam stok', zh: '库存：{qty} 件' },
  quo_subtotal: { en: 'Subtotal: {cur} {total}', ms: 'Jumlah kecil: {cur} {total}', zh: '小计：{cur} {total}' },
  quo_delivery_note: {
    en: '(Delivery is a flat {cur} 5, free above {cur} 80. Prices include GST where applicable.)',
    ms: '(Penghantaran {cur} 5 sekata, percuma untuk pesanan melebihi {cur} 80. Harga termasuk GST jika berkenaan.)',
    zh: '（运费统一 {cur} 5，订单满 {cur} 80 免运费。价格已含消费税（如适用）。）',
  },
  quo_confirm_cta: {
    en: 'Reply "confirm" to proceed and our sales team will finalise your order,\nor reply with a different quantity, or "sales" to talk to our team.',
    ms: 'Balas "confirm" untuk teruskan dan pasukan jualan kami akan memuktamadkan pesanan anda,\natau balas dengan kuantiti berbeza, atau "sales" untuk berhubung dengan pasukan kami.',
    zh: '回复"confirm"继续，我们的销售团队将为您完成订单，\n或回复不同的数量，或回复"sales"联系我们的团队。',
  },
  // Order confirmation + handoff.
  order_confirmed: {
    en: [
      'Thank you for confirming your order. ✅',
      '',
      'One of our sales representatives will follow up with you shortly to arrange payment and to confirm your preferred delivery mode — either self-collection at our shop or delivery to your address.',
      '',
      'Please note: a transport charge of {cur} 20 applies to any single order below {cur} 60.',
      '',
      'Your quotation above remains valid while our team gets in touch.',
    ].join('\n'),
    ms: [
      'Terima kasih kerana mengesahkan pesanan anda. ✅',
      '',
      'Wakil jualan kami akan menghubungi anda sebentar lagi untuk mengatur pembayaran dan mengesahkan cara penghantaran pilihan anda — sama ada ambil sendiri di kedai kami atau dihantar ke alamat anda.',
      '',
      'Perhatian: caj pengangkutan {cur} 20 dikenakan untuk mana-mana pesanan tunggal di bawah {cur} 60.',
      '',
      'Sebut harga di atas kekal sah sementara pasukan kami menghubungi anda.',
    ].join('\n'),
    zh: [
      '感谢您确认订单。✅',
      '',
      '我们的销售代表将尽快与您联系，安排付款并确认您的取货方式，到店自取或送货上门。',
      '',
      '请注意：任何单张订单金额低于 {cur} 60，将收取 {cur} 20 运输费。',
      '',
      '在我们联系您期间，以上报价仍然有效。',
    ].join('\n'),
  },
};

// --- Online booking (onsite + carry-in) ---
// Onsite: step 1 - choose service type. {list} is the numbered service lines.
STRINGS.onsite_book_service = {
  en: [
    '🚗 Onsite Repair Booking',
    '',
    'I can arrange an onsite service appointment. Please select your preferred service:',
    '{list}',
    '',
    'Reply with the number (1-3).',
    '',
    'Note: an onsite service fee of SGD 60 applies per visit (call-out and diagnosis), excluding any replacement parts.',
  ].join('\n'),
  ms: [
    '🚗 Tempahan Pembaikan di Lokasi',
    '',
    'Saya boleh mengatur temu janji perkhidmatan di lokasi. Sila pilih perkhidmatan pilihan anda:',
    '{list}',
    '',
    'Balas dengan nombor (1-3).',
    '',
    'Nota: caj perkhidmatan di lokasi SGD 60 dikenakan bagi setiap lawatan (panggilan dan diagnosis), tidak termasuk alat ganti.',
  ].join('\n'),
  zh: [
    '🚗 上门维修预约',
    '',
    '我可以为您安排上门服务预约。请选择您需要的服务：',
    '{list}',
    '',
    '请回复编号 (1-3)。',
    '',
    '注意：每次上门收取服务费 SGD 60（含上门与诊断），不含更换零件。',
  ].join('\n'),
};
// Shared date picker. {list} is the numbered date lines.
STRINGS.book_pick_date = {
  en: ['📅 Please select your preferred date:', '{list}', '', 'Reply with the number.'].join('\n'),
  ms: ['📅 Sila pilih tarikh pilihan anda:', '{list}', '', 'Balas dengan nombor.'].join('\n'),
  zh: ['📅 请选择您偏好的日期：', '{list}', '', '请回复编号。'].join('\n'),
};
// Shared time-slot picker. {list} is the numbered slot lines.
STRINGS.book_pick_slot = {
  en: ['🕒 Please select your preferred time:', '{list}', '', 'Reply with the number (1-4).'].join('\n'),
  ms: ['🕒 Sila pilih masa pilihan anda:', '{list}', '', 'Balas dengan nombor (1-4).'].join('\n'),
  zh: ['🕒 请选择您偏好的时间：', '{list}', '', '请回复编号 (1-4)。'].join('\n'),
};
// Onsite: collect the remaining details in one reply.
STRINGS.onsite_book_details = {
  en: [
    '📝 Almost done. Please provide the following in one message:',
    '• Your name',
    '• Address (including postal code)',
    '• Contact number',
    '• Brief problem description',
    '',
    'For example: "Mr Tan, 10 Simei Ave 1 #02-01 S486570, 91234567, PC won\'t start".',
  ].join('\n'),
  ms: [
    '📝 Hampir siap. Sila berikan maklumat berikut dalam satu mesej:',
    '• Nama anda',
    '• Alamat (termasuk poskod)',
    '• Nombor telefon',
    '• Penerangan ringkas masalah',
    '',
    'Contoh: "Encik Tan, 10 Simei Ave 1 #02-01 S486570, 91234567, PC tidak boleh hidup".',
  ].join('\n'),
  zh: [
    '📝 就快完成了。请在一条讯息中提供以下资料：',
    '• 您的姓名',
    '• 地址（含邮区编号）',
    '• 联络电话',
    '• 简要问题描述',
    '',
    '例如："陈先生，10 Simei Ave 1 #02-01 S486570，91234567，电脑无法开机"。',
  ].join('\n'),
};
// Onsite: final confirmation.
STRINGS.onsite_book_confirmed = {
  en: [
    '✅ Appointment confirmed',
    '',
    'Booking: {ref}',
    'Service: {service}',
    'Date: {date}',
    'Time: {slot}',
    'Name: {name}',
    'Address: {address}',
    'Contact: {phone}',
    'Problem: {problem}',
    'Status: CONFIRMED',
    '',
    'Our technician will contact you before the appointment. An onsite fee of SGD 60 applies (excluding parts).',
  ].join('\n'),
  ms: [
    '✅ Temu janji disahkan',
    '',
    'Tempahan: {ref}',
    'Perkhidmatan: {service}',
    'Tarikh: {date}',
    'Masa: {slot}',
    'Nama: {name}',
    'Alamat: {address}',
    'Hubungan: {phone}',
    'Masalah: {problem}',
    'Status: DISAHKAN',
    '',
    'Juruteknik kami akan menghubungi anda sebelum temu janji. Caj di lokasi SGD 60 dikenakan (tidak termasuk alat ganti).',
  ].join('\n'),
  zh: [
    '✅ 预约已确认',
    '',
    '预约编号：{ref}',
    '服务：{service}',
    '日期：{date}',
    '时间：{slot}',
    '姓名：{name}',
    '地址：{address}',
    '联络：{phone}',
    '问题：{problem}',
    '状态：已确认',
    '',
    '我们的技术人员会在预约前与您联系。每次上门收取 SGD 60（不含零件）。',
  ].join('\n'),
};
// Carry-in: step - choose device type. {list} is the numbered device lines.
STRINGS.carry_in_book_device = {
  en: ['💻 What device are you bringing in?', '{list}', '', 'Reply with the number (1-4).'].join('\n'),
  ms: ['💻 Peranti apa yang anda bawa masuk?', '{list}', '', 'Balas dengan nombor (1-4).'].join('\n'),
  zh: ['💻 您要送修哪种设备？', '{list}', '', '请回复编号 (1-4)。'].join('\n'),
};
// Carry-in: ask for the problem description.
STRINGS.carry_in_book_problem = {
  en: 'Please describe the problem (e.g. "very slow", "no display", "won\'t turn on").',
  ms: 'Sila terangkan masalah (cth: "sangat perlahan", "tiada paparan", "tidak boleh hidup").',
  zh: '请描述问题（例如"运行很慢"、"无显示"、"无法开机"）。',
};
// Carry-in: final confirmation.
STRINGS.carry_in_book_confirmed = {
  en: [
    '✅ Carry-in service booked',
    '',
    'Booking: {ref}',
    'Device: {device}',
    'Problem: {problem}',
    'Drop-off date: {date}',
    'Time: {slot}',
    'Status: Awaiting Drop-Off',
    '',
    'Please bring your device to our service centre:',
    '10 Simei Avenue 1, Tech Block, #02-01, Singapore 486570',
    'Mon-Fri, 8:00am-5:30pm (closed Sundays & public holidays).',
    '',
    'A standard service charge of SGD 30 applies (diagnosis and labour, parts excluded), with a typical turnaround of 1-2 working days.',
  ].join('\n'),
  ms: [
    '✅ Perkhidmatan bawa masuk ditempah',
    '',
    'Tempahan: {ref}',
    'Peranti: {device}',
    'Masalah: {problem}',
    'Tarikh hantar: {date}',
    'Masa: {slot}',
    'Status: Menunggu Penghantaran',
    '',
    'Sila bawa peranti anda ke pusat servis kami:',
    '10 Simei Avenue 1, Tech Block, #02-01, Singapore 486570',
    'Isnin-Jumaat, 8:00 pagi-5:30 petang (tutup Ahad & cuti umum).',
    '',
    'Caj perkhidmatan standard SGD 30 dikenakan (diagnosis dan tenaga kerja, tidak termasuk alat ganti), dengan tempoh biasa 1-2 hari bekerja.',
  ].join('\n'),
  zh: [
    '✅ 送修服务已预约',
    '',
    '预约编号：{ref}',
    '设备：{device}',
    '问题：{problem}',
    '送修日期：{date}',
    '时间：{slot}',
    '状态：等待送修',
    '',
    '请将设备送至我们的服务中心：',
    '10 Simei Avenue 1, Tech Block, #02-01, Singapore 486570',
    '星期一至五，上午8:00-下午5:30（星期日及公共假期休息）。',
    '',
    '收取标准服务费 SGD 30（含诊断与工时，不含零件），一般 1-2 个工作日完成。',
  ].join('\n'),
};
// --- Warranty check ---
// Prompt shown when the customer picks the Warranty Status menu option.
STRINGS.warranty_prompt = {
  en: [
    '🛡️ Warranty Status',
    '',
    'I can check your product warranty. Reply with any one of these:',
    '• Serial number (e.g. SG26-ASU-0003-22173)',
    '• Invoice number (e.g. INV-26003)',
    '• The mobile number or name on the purchase',
  ].join('\n'),
  ms: [
    '🛡️ Status Waranti',
    '',
    'Saya boleh menyemak waranti produk anda. Balas dengan salah satu daripada:',
    '• Nombor siri (cth: SG26-ASU-0003-22173)',
    '• Nombor invois (cth: INV-26003)',
    '• Nombor telefon atau nama pada pembelian',
  ].join('\n'),
  zh: [
    '🛡️ 保修状态',
    '',
    '我可以为您查询产品保修。请回复以下任一项：',
    '• 序列号（例如 SG26-ASU-0003-22173）',
    '• 发票编号（例如 INV-26003）',
    '• 购买时使用的手机号码或姓名',
  ].join('\n'),
};
// The warranty result reply (product/serial/dates stay English).
STRINGS.warranty_found = {
  en: [
    'Hi {name} 👋',
    '',
    'We have checked your warranty details:',
    '',
    '📦 Product: {product}',
    '🔢 Serial Number: {serial}',
    '🛡️ Warranty: {coverage}',
    '{statusIcon} Status: {status}',
    '📅 Warranty Valid Until: {end}',
    '',
    'Would you like to:',
    '1️⃣ Book an onsite service',
    '2️⃣ Arrange a carry-in repair',
    '3️⃣ Speak to our service team',
    '',
    'Reply with 1, 2 or 3.',
  ].join('\n'),
  ms: [
    'Hai {name} 👋',
    '',
    'Kami telah menyemak butiran waranti anda:',
    '',
    '📦 Produk: {product}',
    '🔢 Nombor Siri: {serial}',
    '🛡️ Waranti: {coverage}',
    '{statusIcon} Status: {status}',
    '📅 Waranti Sah Sehingga: {end}',
    '',
    'Adakah anda ingin:',
    '1️⃣ Tempah servis di lokasi',
    '2️⃣ Atur pembaikan bawa masuk',
    '3️⃣ Bercakap dengan pasukan servis kami',
    '',
    'Balas dengan 1, 2 atau 3.',
  ].join('\n'),
  zh: [
    '您好 {name} 👋',
    '',
    '我们已为您查询保修详情：',
    '',
    '📦 产品：{product}',
    '🔢 序列号：{serial}',
    '🛡️ 保修：{coverage}',
    '{statusIcon} 状态：{status}',
    '📅 保修有效期至：{end}',
    '',
    '您是否需要：',
    '1️⃣ 预约上门服务',
    '2️⃣ 安排送修',
    '3️⃣ 联系我们的服务团队',
    '',
    '请回复 1、2 或 3。',
  ].join('\n'),
};
STRINGS.warranty_multiple = {
  en: 'I found a few products under that. Please reply with the serial number to check the right one:',
  ms: 'Saya jumpa beberapa produk. Sila balas dengan nombor siri untuk menyemak yang betul:',
  zh: '我找到多件产品。请回复序列号以查询正确的那一件：',
};
STRINGS.warranty_not_found = {
  en: 'Sorry, I couldn\'t find a warranty record for "{query}". Please check your serial number (e.g. SG26-ASU-0003-22173) or invoice number, or reply "sales" to talk to our team.',
  ms: 'Maaf, saya tidak menemui rekod waranti untuk "{query}". Sila semak nombor siri (cth: SG26-ASU-0003-22173) atau nombor invois anda, atau balas "sales" untuk berhubung dengan pasukan kami.',
  zh: '抱歉，找不到"{query}"的保修记录。请检查您的序列号（例如 SG26-ASU-0003-22173）或发票编号，或回复"sales"联系我们的团队。',
};
STRINGS.warranty_option_invalid = {
  en: 'Please reply 1 to book an onsite service, 2 for a carry-in repair, or 3 to speak to our service team.',
  ms: 'Sila balas 1 untuk tempah servis di lokasi, 2 untuk pembaikan bawa masuk, atau 3 untuk bercakap dengan pasukan servis kami.',
  zh: '请回复 1 预约上门服务，2 送修，或 3 联系我们的服务团队。',
};

// Sent to the customer when a rep is assigned to their escalated enquiry.
STRINGS.assigned_note = {
  en: '👤 {rep} from our sales team has been assigned to your enquiry and will assist you shortly.',
  ms: '👤 {rep} daripada pasukan jualan kami telah ditugaskan untuk pertanyaan anda dan akan membantu anda sebentar lagi.',
  zh: '👤 我们销售团队的 {rep} 已负责您的咨询，将很快为您提供协助。',
};

// Navigation footer hint shown under multi-step prompts.
STRINGS.nav_hint = {
  en: '(Reply 0 for the main menu, or "back" to go back a step.)',
  ms: '(Balas 0 untuk menu utama, atau "back" untuk kembali satu langkah.)',
  zh: '(回复 0 返回主菜单，或回复"back"返回上一步。)',
};

// Shared invalid-choice reprompt for booking steps.
STRINGS.book_choice_invalid = {
  en: 'Sorry, that\'s not a valid choice. Please reply with one of the numbers shown above.',
  ms: 'Maaf, pilihan itu tidak sah. Sila balas dengan salah satu nombor di atas.',
  zh: '抱歉，这不是有效的选项。请回复上方显示的其中一个编号。',
};

// --- Payment / conversational-commerce journey ---
// Shown after the customer confirms a quotation: offer payment methods.
STRINGS.pay_choose_method = {
  en: [
    'Great — your order is confirmed. ✅',
    'Quote {quoteRef} · Amount: {cur} {amount}',
    '',
    'How would you like to pay?',
    '1. 💳 Pay by Card',
    '2. 🏦 PayNow / SGQR',
    '',
    'Reply with 1 or 2 to receive your secure payment link.',
  ].join('\n'),
  ms: [
    'Bagus — pesanan anda telah disahkan. ✅',
    'Sebut harga {quoteRef} · Jumlah: {cur} {amount}',
    '',
    'Bagaimana anda mahu membayar?',
    '1. 💳 Bayar dengan Kad',
    '2. 🏦 PayNow / SGQR',
    '',
    'Balas dengan 1 atau 2 untuk menerima pautan pembayaran selamat anda.',
  ].join('\n'),
  zh: [
    '太好了，您的订单已确认。✅',
    '报价 {quoteRef} · 金额：{cur} {amount}',
    '',
    '您想如何付款？',
    '1. 💳 刷卡付款',
    '2. 🏦 PayNow / SGQR',
    '',
    '请回复 1 或 2 以获取您的安全付款链接。',
  ].join('\n'),
};
// The secure (test) payment link message.
STRINGS.pay_link = {
  en: [
    '🔒 Secure Payment — {methodLabel}',
    'Amount: {cur} {amount}',
    'Quote: {quoteRef}',
    '',
    'Tap the link below to complete your payment:',
    '{payUrl}',
    '',
    "Once payment is received, I'll send your order and invoice details right here.",
    '(This is a secure test payment for demonstration — no real charge is made.)',
  ].join('\n'),
  ms: [
    '🔒 Pembayaran Selamat — {methodLabel}',
    'Jumlah: {cur} {amount}',
    'Sebut harga: {quoteRef}',
    '',
    'Ketik pautan di bawah untuk melengkapkan pembayaran anda:',
    '{payUrl}',
    '',
    'Sebaik sahaja pembayaran diterima, saya akan hantar butiran pesanan dan invois anda di sini.',
    '(Ini pembayaran ujian selamat untuk demonstrasi — tiada caj sebenar dikenakan.)',
  ].join('\n'),
  zh: [
    '🔒 安全付款 — {methodLabel}',
    '金额：{cur} {amount}',
    '报价：{quoteRef}',
    '',
    '点击下方链接完成付款：',
    '{payUrl}',
    '',
    '收到付款后，我会在这里发送您的订单和发票详情。',
    '（这是用于演示的安全测试付款，不会产生任何实际扣款。）',
  ].join('\n'),
};
// Sent (to WhatsApp) after the simulated gateway confirms payment.
STRINGS.pay_received = {
  en: [
    '✅ Payment received. Thank you!',
    '',
    'Order: {orderRef}',
    'Invoice: {invoiceRef}',
    'Item: {productName} × {qty}',
    'Amount Paid: {cur} {amount}',
    'Status: Preparing Order',
    '',
    '🚚 Delivery Order: {deliveryRef}',
    'Driver: {driverName} ({driverPhone})',
    'Estimated delivery: {eta}',
    '',
    'You can track your delivery anytime — reply "7" (Delivery Status) and enter {deliveryRef}.',
  ].join('\n'),
  ms: [
    '✅ Pembayaran diterima. Terima kasih!',
    '',
    'Pesanan: {orderRef}',
    'Invois: {invoiceRef}',
    'Barang: {productName} × {qty}',
    'Jumlah Dibayar: {cur} {amount}',
    'Status: Menyediakan Pesanan',
    '',
    '🚚 Pesanan Penghantaran: {deliveryRef}',
    'Pemandu: {driverName} ({driverPhone})',
    'Anggaran penghantaran: {eta}',
    '',
    'Anda boleh menjejaki penghantaran bila-bila masa — balas "7" (Status Penghantaran) dan masukkan {deliveryRef}.',
  ].join('\n'),
  zh: [
    '✅ 已收到付款。谢谢您！',
    '',
    '订单：{orderRef}',
    '发票：{invoiceRef}',
    '商品：{productName} × {qty}',
    '已付金额：{cur} {amount}',
    '状态：备货中',
    '',
    '🚚 送货订单：{deliveryRef}',
    '司机：{driverName}（{driverPhone}）',
    '预计送达：{eta}',
    '',
    '您可随时追踪送货 — 回复"7"（送货状态）并输入 {deliveryRef}。',
  ].join('\n'),
};
// Reply if the customer sends a number that isn't 1/2 at the payment step.
STRINGS.pay_method_invalid = {
  en: 'Please reply 1 for 💳 Card or 2 for 🏦 PayNow / SGQR to receive your payment link.',
  ms: 'Sila balas 1 untuk 💳 Kad atau 2 untuk 🏦 PayNow / SGQR untuk menerima pautan pembayaran anda.',
  zh: '请回复 1 选择 💳 刷卡，或回复 2 选择 🏦 PayNow / SGQR，以获取付款链接。',
};

// --- Language picker + confirmation (shown when the customer taps "Language") ---
STRINGS.language_picker = {
  en: '🌐 Please select your preferred language:\n\n1. 🇬🇧 English\n2. 🇨🇳 中文 (Chinese)\n3. 🇲🇾 Bahasa Melayu\n\nReply with 1, 2 or 3 — or type English, 中文, or Bahasa Melayu.',
  ms: '🌐 Sila pilih bahasa pilihan anda:\n\n1. 🇬🇧 English\n2. 🇨🇳 中文 (Chinese)\n3. 🇲🇾 Bahasa Melayu\n\nBalas dengan 1, 2 atau 3 — atau taip English, 中文, atau Bahasa Melayu.',
  zh: '🌐 请选择您偏好的语言：\n\n1. 🇬🇧 English\n2. 🇨🇳 中文\n3. 🇲🇾 Bahasa Melayu\n\n请回复 1、2 或 3，或输入 English、中文 或 Bahasa Melayu。',
};
// Confirmation is shown in the language the customer just chose.
STRINGS.language_set = {
  en: '👍 Great! You\'ve selected English. Just let me know how I can help you.',
  ms: '👍 Baik! Anda telah memilih Bahasa Melayu. Beritahu saya bagaimana saya boleh membantu anda.',
  zh: '好的！您已选择中文。\n如果您需要任何帮助，请告诉我。',
};

// --- Menu-option responses (localized) ---
STRINGS.about = {
  en: [
    'ℹ️ About BIS Computer Services',
    '',
    '1. Who we are',
    '   We sell computer components, build custom PCs, and provide repair services (carry-in at our service centre and onsite).',
    '',
    '2. Address',
    '   10 Simei Avenue 1, Tech Block, #02-01, Singapore 486570.',
    '',
    '3. Operating hours',
    '   Sales & enquiries: every day, 8:00am to 8:00pm.',
    '   Service centre (carry-in repairs): Monday to Friday, 8:00am to 5:30pm.',
    '   Service centre closed on Sundays and public holidays.',
    '',
    '4. How we can help',
    '   Ask us about products, PC builds, repairs, delivery, or payment. Or reply with a menu number anytime.',
  ].join('\n'),
  ms: [
    'ℹ️ Mengenai BIS Computer Services',
    '',
    '1. Siapa kami',
    '   Kami menjual komponen komputer, membina PC tersuai, dan menyediakan perkhidmatan pembaikan (bawa masuk ke pusat servis kami dan di lokasi anda).',
    '',
    '2. Alamat',
    '   10 Simei Avenue 1, Tech Block, #02-01, Singapore 486570.',
    '',
    '3. Waktu operasi',
    '   Jualan & pertanyaan: setiap hari, 8:00 pagi hingga 8:00 malam.',
    '   Pusat servis (pembaikan bawa masuk): Isnin hingga Jumaat, 8:00 pagi hingga 5:30 petang.',
    '   Pusat servis tutup pada hari Ahad dan cuti umum.',
    '',
    '4. Bagaimana kami boleh membantu',
    '   Tanya kami tentang produk, pemasangan PC, pembaikan, penghantaran, atau pembayaran. Atau balas dengan nombor menu bila-bila masa.',
  ].join('\n'),
  zh: [
    'ℹ️ 关于 BIS Computer Services',
    '',
    '1. 我们是谁',
    '   我们销售电脑配件、组装定制电脑，并提供维修服务（可送修至我们的服务中心或上门维修）。',
    '',
    '2. 地址',
    '   10 Simei Avenue 1, Tech Block, #02-01, Singapore 486570。',
    '',
    '3. 营业时间',
    '   销售与咨询：每天上午8:00至晚上8:00。',
    '   服务中心（送修）：星期一至星期五，上午8:00至下午5:30。',
    '   服务中心逢星期日及公共假期休息。',
    '',
    '4. 我们能如何帮助您',
    '   欢迎咨询产品、电脑组装、维修、送货或付款事宜。也可随时回复菜单编号。',
  ].join('\n'),
};

STRINGS.menu_components = {
  en: 'Sure! What component are you looking for? For example: CPU, GPU, RAM, SSD, motherboard, monitor, PSU, case or cooler. You can also tell me a budget, e.g. "32GB DDR5 RAM under $200".',
  ms: 'Baik! Komponen apa yang anda cari? Contohnya: CPU, GPU, RAM, SSD, papan induk, monitor, bekalan kuasa, kotak atau penyejuk. Anda juga boleh beritahu bajet, cth: "RAM DDR5 32GB bawah $200".',
  zh: '好的！您在找哪种配件？例如：处理器(CPU)、显卡(GPU)、内存(RAM)、固态硬盘(SSD)、主板、显示器、电源、机箱或散热器。您也可以告诉我预算，例如"32GB DDR5 内存 $200 以内"。',
};

STRINGS.menu_product_availability = {
  en: 'Sure! I can check live stock for any item. Just tell me the product you\'re interested in — for example "RTX 5070", "32GB DDR5 RAM", or "Intel Core i5". I\'ll show you the price and how many units we have in stock.',
  ms: 'Baik! Saya boleh menyemak stok terkini untuk mana-mana barang. Beritahu saya produk yang anda minati — contohnya "RTX 5070", "RAM DDR5 32GB", atau "Intel Core i5". Saya akan tunjukkan harga dan berapa unit yang ada dalam stok.',
  zh: '好的！我可以为任何商品查询实时库存。请告诉我您感兴趣的产品，例如"RTX 5070"、"32GB DDR5 内存"或"Intel Core i5"。我会显示价格以及现有库存数量。',
};

// Stock label shown in shortlists / quotations, e.g. "100 in stock".
STRINGS.stock_in_units = {
  en: '{qty} in stock',
  ms: '{qty} dalam stok',
  zh: '库存 {qty} 件',
};
STRINGS.stock_made_to_order = {
  en: 'made to order',
  ms: 'dibuat atas pesanan',
  zh: '按订单供应',
};

STRINGS.menu_delivery_payment = {
  en: 'Delivery within the city is a flat SGD 5, free for orders above SGD 80. We accept PayNow, bank transfer, major credit cards, and cash on collection. Share your postal code for an exact delivery quote.',
  ms: 'Penghantaran dalam bandar ialah SGD 5 sekata, percuma untuk pesanan melebihi SGD 80. Kami menerima PayNow, pindahan bank, kad kredit utama, dan tunai semasa pengambilan. Kongsi poskod anda untuk sebut harga penghantaran yang tepat.',
  zh: '市区内送货统一收费 SGD 5，订单满 SGD 80 免运费。我们接受 PayNow、银行转账、主要信用卡，以及自取时付现金。请提供您的邮区编号以获取准确的送货报价。',
};

STRINGS.carry_in = {
  en: [
    '🔧 Carry-in Service (Service Centre Repair)',
    '',
    'Bring your desktop or laptop to our service centre and our technicians will diagnose and repair it for you.',
    '',
    '📍 Service Centre',
    '10 Simei Avenue 1, Tech Block, #02-01, Singapore 486570',
    '',
    '🕒 Operating Hours',
    'Monday to Friday, 8:00am - 5:30pm',
    'Closed on Sundays and public holidays',
    '',
    '💵 A standard service charge of SGD 30 applies per repair (diagnosis and labour). This excludes the cost of any replacement parts, which are quoted separately for your approval before any work is carried out.',
    '',
    '⏱️ Typical turnaround is 1-2 working days after the unit is received at the centre.',
    '',
    'To proceed, please reply with the issue you are experiencing (e.g. "no display", "won\'t turn on", "very slow") and whether it is a desktop or laptop. Our service team will then advise you on the next steps.',
  ].join('\n'),
  ms: [
    '🔧 Perkhidmatan Bawa Masuk (Pembaikan di Pusat Servis)',
    '',
    'Bawa komputer meja atau komputer riba anda ke pusat servis kami dan juruteknik kami akan mendiagnos serta membaikinya untuk anda.',
    '',
    '📍 Pusat Servis',
    '10 Simei Avenue 1, Tech Block, #02-01, Singapore 486570',
    '',
    '🕒 Waktu Operasi',
    'Isnin hingga Jumaat, 8:00 pagi - 5:30 petang',
    'Tutup pada hari Ahad dan cuti umum',
    '',
    '💵 Caj perkhidmatan standard SGD 30 dikenakan bagi setiap pembaikan (diagnosis dan tenaga kerja). Ini tidak termasuk kos alat ganti, yang akan disebut harga secara berasingan untuk kelulusan anda sebelum sebarang kerja dijalankan.',
    '',
    '⏱️ Tempoh pembaikan biasa ialah 1-2 hari bekerja selepas unit diterima di pusat servis.',
    '',
    'Untuk meneruskan, sila balas dengan masalah yang anda alami (cth: "tiada paparan", "tidak boleh hidup", "sangat perlahan") dan sama ada ia komputer meja atau komputer riba. Pasukan servis kami akan memaklumkan langkah seterusnya.',
  ].join('\n'),
  zh: [
    '🔧 送修服务（服务中心维修）',
    '',
    '将您的台式机或笔记本电脑送到我们的服务中心，我们的技术人员将为您诊断并维修。',
    '',
    '📍 服务中心',
    '10 Simei Avenue 1, Tech Block, #02-01, Singapore 486570',
    '',
    '🕒 营业时间',
    '星期一至星期五，上午8:00 - 下午5:30',
    '逢星期日及公共假期休息',
    '',
    '💵 每次维修收取标准服务费 SGD 30（含诊断与工时），不含更换零件费用；任何零件将另行报价，经您同意后才进行维修。',
    '',
    '⏱️ 一般维修时间为收到机器后的 1-2 个工作日。',
    '',
    '请回复您遇到的问题（例如"无显示"、"无法开机"、"运行很慢"）以及是台式机还是笔记本电脑，我们的服务团队会告知您后续步骤。',
  ].join('\n'),
};

STRINGS.menu_pc_bundle = {
  en: "Great choice! We build custom PCs. What's your budget and main use (gaming, office, or content creation)? For example: \"gaming PC around $2000\".",
  ms: 'Pilihan yang baik! Kami memasang PC tersuai. Apakah bajet dan kegunaan utama anda (permainan, pejabat, atau penciptaan kandungan)? Contohnya: "gaming PC sekitar $2000".',
  zh: '好选择！我们提供定制电脑组装。请问您的预算和主要用途是什么（游戏、办公或内容创作）？例如："游戏电脑 约 $2000"。',
};

STRINGS.delivery_status_prompt = {
  en: [
    '🚚 Delivery Status',
    '',
    'To check your delivery, just reply with any one of these:',
    '• Your delivery-order number (e.g. DO202600001)',
    '• The name on your order (e.g. Cheryl Ng)',
    '• The handphone number used at purchase',
    '',
    "I'll tell you the current status, the driver's ETA, and the driver's contact — no need to call the hotline.",
  ].join('\n'),
  ms: [
    '🚚 Status Penghantaran',
    '',
    'Untuk menyemak penghantaran anda, balas dengan salah satu daripada berikut:',
    '• Nombor pesanan penghantaran anda (cth: DO202600001)',
    '• Nama pada pesanan anda (cth: Cheryl Ng)',
    '• Nombor telefon bimbit yang digunakan semasa pembelian',
    '',
    'Saya akan beritahu status semasa, anggaran masa tiba pemandu, dan hubungan pemandu — tanpa perlu menghubungi talian hotline.',
  ].join('\n'),
  zh: [
    '🚚 送货状态',
    '',
    '要查询您的送货情况，只需回复以下任一项：',
    '• 您的送货订单编号（例如 DO202600001）',
    '• 订单上的姓名（例如 Cheryl Ng）',
    '• 购买时使用的手机号码',
    '',
    '我会告诉您当前状态、司机的预计送达时间和司机联系方式，无需拨打热线。',
  ].join('\n'),
};

STRINGS.onsite_intro = {
  en: [
    '🚗 Onsite Repair Service',
    '',
    "I'll take a few quick details to arrange your visit.",
    '',
    'Please note: an onsite service fee of SGD 60 applies per visit. This covers the technician call-out and diagnosis, and excludes the cost of any replacement parts, which are quoted separately for your approval before any work is carried out.',
    '',
    'Step 1 of 3 — please reply with your address (home or office), including the postal code.',
  ].join('\n'),
  ms: [
    '🚗 Perkhidmatan Pembaikan di Lokasi',
    '',
    'Saya perlukan beberapa maklumat ringkas untuk mengatur lawatan anda.',
    '',
    'Perhatian: caj perkhidmatan di lokasi SGD 60 dikenakan bagi setiap lawatan. Ini merangkumi panggilan juruteknik dan diagnosis, dan tidak termasuk kos alat ganti, yang akan disebut harga secara berasingan untuk kelulusan anda sebelum sebarang kerja dijalankan.',
    '',
    'Langkah 1 daripada 3 — sila balas dengan alamat anda (rumah atau pejabat), termasuk poskod.',
  ].join('\n'),
  zh: [
    '🚗 上门维修服务',
    '',
    '我需要几项简单资料来为您安排上门服务。',
    '',
    '请注意：每次上门收取服务费 SGD 60，含技术人员上门与诊断，不含更换零件费用；任何零件将另行报价，经您同意后才进行维修。',
    '',
    '第 1 步（共 3 步）——请回复您的地址（住家或办公室），并附上邮区编号。',
  ].join('\n'),
};

// --- Onsite slot-filling steps + repair/onsite acknowledgements ---
STRINGS.onsite_ask_issue = {
  en: '📍 Got it, I have noted your address.\n\nStep 2 of 3 — please describe the issue you are experiencing (e.g. "PC keeps restarting", "no display", "very slow").',
  ms: '📍 Baik, saya telah mencatat alamat anda.\n\nLangkah 2 daripada 3 — sila terangkan masalah yang anda alami (cth: "PC asyik restart", "tiada paparan", "sangat perlahan").',
  zh: '📍 好的，已记下您的地址。\n\n第 2 步（共 3 步）——请描述您遇到的问题（例如"电脑一直重启"、"无显示"、"运行很慢"）。',
};
STRINGS.onsite_ask_datetime = {
  en: '🛠️ Thank you. Step 3 of 3 — please share your preferred date and time for the onsite visit (e.g. "12 Sep 2026, 2pm").',
  ms: '🛠️ Terima kasih. Langkah 3 daripada 3 — sila kongsi tarikh dan masa pilihan anda untuk lawatan di lokasi (cth: "12 Sep 2026, 2 petang").',
  zh: '🛠️ 谢谢。第 3 步（共 3 步）——请提供您希望上门的日期和时间（例如"2026年9月12日 下午2点"）。',
};
STRINGS.onsite_ask_address = {
  en: '📍 Step 1 of 3 — please reply with your address (home or office), including the postal code.',
  ms: '📍 Langkah 1 daripada 3 — sila balas dengan alamat anda (rumah atau pejabat), termasuk poskod.',
  zh: '📍 第 1 步（共 3 步）——请回复您的地址（住家或办公室），并附上邮区编号。',
};
STRINGS.onsite_complete = {
  en: [
    '✅ Thank you. Your onsite repair request is complete and has been sent to our service team.',
    '',
    'Summary of your request:',
    '• Address: {address}',
    '• Issue: {issue}',
    '• Preferred date/time: {datetime}',
    '',
    'Reminder: an onsite service fee of SGD 60 applies per visit (technician call-out and diagnosis). Any replacement parts are quoted separately for your approval before any work is carried out.',
    '',
    'A service representative will contact you shortly to confirm the appointment.',
  ].join('\n'),
  ms: [
    '✅ Terima kasih. Permintaan pembaikan di lokasi anda telah lengkap dan dihantar kepada pasukan servis kami.',
    '',
    'Ringkasan permintaan anda:',
    '• Alamat: {address}',
    '• Masalah: {issue}',
    '• Tarikh/masa pilihan: {datetime}',
    '',
    'Peringatan: caj perkhidmatan di lokasi SGD 60 dikenakan bagi setiap lawatan (panggilan juruteknik dan diagnosis). Sebarang alat ganti disebut harga secara berasingan untuk kelulusan anda sebelum sebarang kerja dijalankan.',
    '',
    'Wakil servis akan menghubungi anda sebentar lagi untuk mengesahkan temu janji.',
  ].join('\n'),
  zh: [
    '✅ 谢谢。您的上门维修申请已完成并已发送给我们的服务团队。',
    '',
    '您的申请摘要：',
    '• 地址：{address}',
    '• 问题：{issue}',
    '• 希望日期/时间：{datetime}',
    '',
    '温馨提示：每次上门收取服务费 SGD 60（含技术人员上门与诊断）。任何更换零件将另行报价，经您同意后才进行维修。',
    '',
    '服务代表将尽快与您联系以确认预约。',
  ].join('\n'),
};
STRINGS.carry_in_ack = {
  en: [
    '✅ Thank you. Your carry-in service request has been recorded and sent to our service team.',
    '',
    'A service representative will contact you shortly with the next steps. A standard service charge of SGD 30 applies per repair (diagnosis and labour, parts excluded), with a typical turnaround of 1-2 working days after the unit is received at our centre.',
  ].join('\n'),
  ms: [
    '✅ Terima kasih. Permintaan perkhidmatan bawa masuk anda telah direkodkan dan dihantar kepada pasukan servis kami.',
    '',
    'Wakil servis akan menghubungi anda sebentar lagi dengan langkah seterusnya. Caj perkhidmatan standard SGD 30 dikenakan bagi setiap pembaikan (diagnosis dan tenaga kerja, tidak termasuk alat ganti), dengan tempoh biasa 1-2 hari bekerja selepas unit diterima di pusat kami.',
  ].join('\n'),
  zh: [
    '✅ 谢谢。您的送修服务申请已记录并发送给我们的服务团队。',
    '',
    '服务代表将尽快与您联系告知后续步骤。每次维修收取标准服务费 SGD 30（含诊断与工时，不含零件），一般在服务中心收到机器后 1-2 个工作日内完成。',
  ].join('\n'),
};

/** Substitute {vars} in a template string. */
function fill(template, vars) {
  return String(template).replace(/\{(\w+)\}/g, (m, k) => (vars && vars[k] != null ? String(vars[k]) : m));
}

/**
 * Translate a key into the given language with variable substitution.
 * @param {string} lang 'en'|'ms'|'zh'
 * @param {string} key
 * @param {object} [vars]
 */
function t(lang, key, vars) {
  const entry = STRINGS[key];
  if (!entry) return '';
  const template = entry[lang] || entry[DEFAULT];
  return fill(template, vars || {});
}

module.exports = { t, STRINGS };
