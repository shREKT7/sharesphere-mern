const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { protect } = require('../middleware/authMiddleware');
const { validate } = require('../middleware/validationMiddleware');
const {
    createBorrowRequest,
    approveRequest,
    rejectRequest,
    returnItem,
    getMyReceivedRequests,
    getMyBorrowedItems
} = require('../controllers/borrowController');

// POST create borrow request
router.post(
    '/request',
    protect,
    [
        body('resourceId', 'Resource ID is required').not().isEmpty(),
        body('startDate', 'Start Date is required').isISO8601(),
        body('endDate', 'End Date is required').isISO8601()
    ],
    validate,
    createBorrowRequest
);

// PATCH approve request
router.patch('/approve/:id', protect, approveRequest);

// PATCH reject request
router.patch('/reject/:id', protect, rejectRequest);

// PATCH mark item returned
router.patch('/return/:id', protect, returnItem);

// GET my received requests (dashboard)
router.get('/requests', protect, getMyReceivedRequests);

// GET my borrowed items (dashboard)
router.get('/borrowed', protect, getMyBorrowedItems);

module.exports = router;
