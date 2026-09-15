'use strict';

/**
 * Webhook route (spec Task 7, Req 1.2).
 *
 * POST /webhook  { from, text }
 *   - validates the payload with express-validator
 *   - a missing/empty `from` or `text` is rejected with 400 and NO enquiry is
 *     created (validation runs before the controller)
 *   - otherwise the enquiry pipeline runs and the bot reply is returned
 */

const express = require('express');
const { body, validationResult } = require('express-validator');
const webhookController = require('../controllers/webhook.controller');

const router = express.Router();

const validateInbound = [
  body('from')
    .exists({ checkFalsy: true })
    .withMessage('from is required')
    .bail()
    .isString()
    .withMessage('from must be a string'),
  body('text')
    .exists({ checkFalsy: true })
    .withMessage('text is required')
    .bail()
    .isString()
    .withMessage('text must be a string'),
];

function checkValidation(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: 'invalid_payload',
      details: errors.array().map((e) => ({ field: e.path, message: e.msg })),
    });
  }
  return next();
}

router.post('/', validateInbound, checkValidation, webhookController.handleWebhook);

// Image-based product identification (base64 image in JSON body).
router.post('/image', webhookController.handleImageWebhook);

module.exports = router;
