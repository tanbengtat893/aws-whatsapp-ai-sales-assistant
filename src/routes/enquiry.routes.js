'use strict';

/**
 * Enquiries routes for the dashboard (spec Task 10, Req 5).
 * Mounted at /api/enquiries.
 */

const express = require('express');
const enquiryController = require('../controllers/enquiry.controller');

const router = express.Router();

router.get('/', enquiryController.listEnquiries);
router.post('/clear', enquiryController.clearHistory);
router.get('/:id', enquiryController.getEnquiry);
router.post('/:id/resolve', enquiryController.resolveEnquiry);
router.post('/:id/assign', enquiryController.assignEnquiry);
router.post('/:id/reply', enquiryController.replyToEnquiry);

module.exports = router;
