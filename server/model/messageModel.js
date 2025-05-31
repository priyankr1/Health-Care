const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    chat: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Chat",
      required: true,
    },
    content: {
      type: String,
      required: [true, "Message can't be empty"],
    },
    fileUrl: {
      type: String, // Stores the Firebase URL or local path
      default: null,
    },
  },
  { timestamps: true }
);

const messageModel = mongoose.model("Message", messageSchema);
module.exports = messageModel;
