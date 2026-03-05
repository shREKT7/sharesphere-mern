const BorrowRequest = require('../models/BorrowRequest');
const Resource = require('../models/Resource');
const Notification = require('../models/Notification');

// @desc    Create borrow request
// @route   POST /api/borrow/request
// @access  Private
const createBorrowRequest = async (req, res, next) => {
    try {
        const { resourceId, startDate, endDate } = req.body;

        const resource = await Resource.findById(resourceId);

        if (!resource) {
            res.status(404);
            throw new Error('Resource not found');
        }

        if (!resource.availability) {
            res.status(400);
            throw new Error('Resource is currently not available');
        }

        // Owner cannot borrow their own item
        if (resource.owner.toString() === req.user._id.toString()) {
            res.status(400);
            throw new Error('You cannot borrow your own resource');
        }

        const borrowRequest = new BorrowRequest({
            resourceId,
            borrowerId: req.user._id,
            ownerId: resource.owner,
            startDate,
            endDate,
            status: 'Pending'
        });

        const createdRequest = await borrowRequest.save();

        // Notify the owner
        await Notification.create({
            userId: resource.owner,
            message: `${req.user.name} has requested to borrow: ${resource.title}`
        });

        res.status(201).json({ success: true, data: createdRequest });
    } catch (error) {
        next(error);
    }
};

// @desc    Owner approves request
// @route   PATCH /api/borrow/approve/:id
// @access  Private
const approveRequest = async (req, res, next) => {
    try {
        const borrowRequest = await BorrowRequest.findById(req.params.id);

        if (!borrowRequest) {
            res.status(404);
            throw new Error('Borrow request not found');
        }

        if (borrowRequest.ownerId.toString() !== req.user._id.toString()) {
            res.status(401);
            throw new Error('Not authorized to approve this request');
        }

        borrowRequest.status = 'Approved';
        await borrowRequest.save();

        // Mark resource as unavailable
        const resource = await Resource.findById(borrowRequest.resourceId);
        if (resource) {
            resource.availability = false;
            await resource.save();

            // Notify the borrower
            await Notification.create({
                userId: borrowRequest.borrowerId,
                message: `Your request to borrow ${resource.title} was APPROVED.`
            });
        }

        res.json({ success: true, data: borrowRequest });
    } catch (error) {
        next(error);
    }
};

// @desc    Owner rejects request
// @route   PATCH /api/borrow/reject/:id
// @access  Private
const rejectRequest = async (req, res, next) => {
    try {
        const borrowRequest = await BorrowRequest.findById(req.params.id);

        if (!borrowRequest) {
            res.status(404);
            throw new Error('Borrow request not found');
        }

        if (borrowRequest.ownerId.toString() !== req.user._id.toString()) {
            res.status(401);
            throw new Error('Not authorized to reject this request');
        }

        borrowRequest.status = 'Rejected';
        await borrowRequest.save();

        // Notify the borrower
        const resource = await Resource.findById(borrowRequest.resourceId);
        await Notification.create({
            userId: borrowRequest.borrowerId,
            message: `Your request to borrow ${resource.title} was REJECTED.`
        });

        res.json({ success: true, data: borrowRequest });
    } catch (error) {
        next(error);
    }
};

// @desc    Mark item returned
// @route   PATCH /api/borrow/return/:id
// @access  Private
const returnItem = async (req, res, next) => {
    try {
        // Both owner and borrower should ideally be able to mark it returned,
        // let's allow owner to confirm return.
        const borrowRequest = await BorrowRequest.findById(req.params.id);

        if (!borrowRequest) {
            res.status(404);
            throw new Error('Borrow request not found');
        }

        if (borrowRequest.ownerId.toString() !== req.user._id.toString()) {
            res.status(401);
            throw new Error('Not authorized to mark this returned');
        }

        borrowRequest.status = 'Returned';
        await borrowRequest.save();

        // Mark resource as available again
        const resource = await Resource.findById(borrowRequest.resourceId);
        if (resource) {
            resource.availability = true;
            await resource.save();

            // Notify the borrower
            await Notification.create({
                userId: borrowRequest.borrowerId,
                message: `Owner has confirmed the return of: ${resource.title}. Thank you!`
            });
        }

        res.json({ success: true, data: borrowRequest });
    } catch (error) {
        next(error);
    }
};

// @desc    Get borrow requests received by user (Owner)
// @route   GET /api/borrow/requests
// @access  Private
const getMyReceivedRequests = async (req, res, next) => {
    try {
        const requests = await BorrowRequest.find({ ownerId: req.user._id })
            .populate('resourceId', 'title imageUrl condition')
            .populate('borrowerId', 'name email')
            .sort({ createdAt: -1 });

        res.json({ success: true, data: requests });
    } catch (error) {
        next(error);
    }
};

// @desc    Get resources borrowed by user (Borrower)
// @route   GET /api/borrow/borrowed
// @access  Private
const getMyBorrowedItems = async (req, res, next) => {
    try {
        const items = await BorrowRequest.find({ borrowerId: req.user._id })
            .populate('resourceId', 'title imageUrl condition owner')
            .populate('ownerId', 'name email')
            .sort({ createdAt: -1 });

        res.json({ success: true, data: items });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    createBorrowRequest,
    approveRequest,
    rejectRequest,
    returnItem,
    getMyReceivedRequests,
    getMyBorrowedItems
};
