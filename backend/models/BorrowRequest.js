const mongoose = require('mongoose');

const borrowRequestSchema = new mongoose.Schema({
    resourceId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Resource',
    },
    borrowerId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
    },
    ownerId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
    },
    startDate: {
        type: Date,
        required: true,
    },
    endDate: {
        type: Date,
        required: true,
    },
    status: {
        type: String,
        enum: ['Pending', 'Approved', 'Rejected', 'Returned'],
        default: 'Pending',
    },
}, {
    timestamps: true,
});

const BorrowRequest = mongoose.model('BorrowRequest', borrowRequestSchema);

module.exports = BorrowRequest;
