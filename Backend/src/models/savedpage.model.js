const mongoose = require("mongoose");

const savedPageSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    title: {
        type: String
    },
    url: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})

const SavedPageModel = mongoose.model('savedpage', savedPageSchema)
module.exports = SavedPageModel
