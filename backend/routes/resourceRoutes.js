const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { protect } = require('../middleware/authMiddleware');
const { validate } = require('../middleware/validationMiddleware');
const {
    getResources,
    getResourceById,
    createResource,
    deleteResource
} = require('../controllers/resourceController');

// GET all resources
router.get('/', getResources);

// GET single resource
router.get('/:id', getResourceById);

// POST create resource
router.post(
    '/',
    protect,
    [
        body('title', 'Title is required').not().isEmpty(),
        body('description', 'Description is required').not().isEmpty(),
        body('category', 'Category is required').not().isEmpty(),
        body('condition', 'Condition is required').not().isEmpty(),
    ],
    validate,
    createResource
);

// DELETE resource
router.delete('/:id', protect, deleteResource);

module.exports = router;
