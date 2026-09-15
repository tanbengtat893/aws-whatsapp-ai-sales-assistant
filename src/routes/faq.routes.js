'use strict';

/**
 * FAQ management routes (spec Task 9, Req 6).
 * Mounted at /api/faqs.
 */

const express = require('express');
const { body, validationResult } = require('express-validator');
const faqController = require('../controllers/faq.controller');

const router = express.Router();

function checkValidation(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: 'invalid_faq',
      details: errors.array().map((e) => ({ field: e.path, message: e.msg })),
    });
  }
  return next();
}

const validateCreate = [
  body('intent').isString().trim().notEmpty().withMessage('intent is required'),
  body('answers').isObject().withMessage('answers object is required'),
  body('answers.en')
    .isString()
    .trim()
    .notEmpty()
    .withMessage('an English (en) answer is required'),
];

router.get('/', faqController.listFaqs);
router.post('/', validateCreate, checkValidation, faqController.createFaq);
router.put('/:id', faqController.updateFaq);

module.exports = router;
