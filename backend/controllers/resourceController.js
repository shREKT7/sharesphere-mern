const Resource = require('../models/Resource');

// @desc    Fetch all available resources
// @route   GET /api/resources
// @access  Public
const getResources = async (req, res, next) => {
    try {
        const { search, category, condition, availability } = req.query;

        let query = {};

        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } }
            ];
        }

        if (category) {
            query.category = { $regex: category, $options: 'i' };
        }

        if (condition) {
            query.condition = { $regex: condition, $options: 'i' };
        }

        if (availability !== undefined) {
            query.availability = availability === 'true';
        } else {
            query.availability = true;
        }

        const resources = await Resource.find(query)
            .populate('owner', 'name email location trustScore')
            .sort({ createdAt: -1 });

        res.json({ success: true, count: resources.length, data: resources });
    } catch (error) {
        next(error);
    }
};

// @desc    Fetch single resource
// @route   GET /api/resources/:id
// @access  Public
const getResourceById = async (req, res, next) => {
    try {
        const resource = await Resource.findById(req.params.id)
            .populate('owner', 'name email');

        if (resource) {
            res.json({ success: true, data: resource });
        } else {
            res.status(404);
            throw new Error('Resource not found');
        }
    } catch (error) {
        next(error);
    }
};

// @desc    Create a new resource
// @route   POST /api/resources
// @access  Private
const createResource = async (req, res, next) => {
    try {
        const { title, description, category, condition, imageUrl } = req.body;

        const resource = new Resource({
            title,
            description,
            category,
            condition,
            imageUrl,
            owner: req.user._id,
            availability: true
        });

        const createdResource = await resource.save();

        res.status(201).json({ success: true, data: createdResource });
    } catch (error) {
        next(error);
    }
};

// @desc    Delete a resource
// @route   DELETE /api/resources/:id
// @access  Private
const deleteResource = async (req, res, next) => {
    try {
        const resource = await Resource.findById(req.params.id);

        if (!resource) {
            res.status(404);
            throw new Error('Resource not found');
        }

        // Check ownership
        if (resource.owner.toString() !== req.user._id.toString()) {
            res.status(401);
            throw new Error('Not authorized to delete this resource');
        }

        await resource.deleteOne();

        res.json({ success: true, message: 'Resource removed' });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getResources,
    getResourceById,
    createResource,
    deleteResource,
};
