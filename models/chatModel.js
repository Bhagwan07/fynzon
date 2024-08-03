const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema(
  {
    firstUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    secondUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    chat: [
      {
        senderId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "users",
        },
        receiverId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "users",
        },
        message: {
          type: String,
          default: "",
        },
        files: [
          {
            type: { type: String },
            mimeType: { type: String },
            originalName: { type: String },
            size: { type: Number },
            url: { type: String },
            isDeleted: { type: Boolean, default: false },
          },
        ],
        isSeen: {
          type: Boolean,
          default: false,
        },
        time: {
          type: String,
          require: [true, "Time is required"],
        },
        isDeleted: {
          type: Boolean,
          default: false,
        },
        _id: false,
      },
    ],
  },
  { timestamps: true, versionKey: false }
);

const chatModel = mongoose.model("chat", chatSchema);
module.exports = { chatModel };
