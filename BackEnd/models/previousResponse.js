const mongoose = require("mongoose")

const responseschema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  previousResponseId: {
    type: String,
    required: true,
  }
})

module.exports = mongoose.model("ResponseDB", responseschema)
