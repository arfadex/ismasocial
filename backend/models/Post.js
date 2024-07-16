const mongoose = require('mongoose')

const PostSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    title: {
        type: String,
        default: 'Untitled',
    },
    desc: {
        type: String,
        default: 'No description provided',
    },
    photo: {
        type: String,
        default: null
    },
    likes: {
        type: [String],
        default: []
    },
    location: {
        type: String,
        default: ''
    }
}, {timestamps: true})

module.exports = mongoose.model("Post", PostSchema)
