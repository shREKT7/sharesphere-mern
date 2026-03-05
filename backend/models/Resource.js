const mongoose = require('mongoose');

const resourceSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        required: true,
    },
    condition: {
        type: String,
        required: true,
    },
    imageUrl: {
        type: String,
        required: false,
    },
    availability: {
        type: Boolean,
        default: true,
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
    },
}, {
    timestamps: true,
});

const Resource = mongoose.model('Resource', resourceSchema);

module.exports = Resource;
