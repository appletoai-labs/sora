const mongoose = require("mongoose")

const lastsessionSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        sessionId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "ChatSession",
            required: true,
        },
        isViewingPastSession: {
            type: Boolean,
            default: false,
        },
    })

module.exports = mongoose.model("lastsession", lastsessionSchema)
