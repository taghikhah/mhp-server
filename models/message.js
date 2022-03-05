// Loading Libraries
const Joi = require("joi");
const mongoose = require("mongoose");

// Defining the Messages Schema
const messageSchema = new mongoose.Schema(
  {
    partition: {
      type: Number,
      required: true,
    },
    topic: {
      type: String,
      required: true,
    },
    value: {
      type: mongoose.SchemaTypes.Mixed,
      required: true,
    },
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  }
);

const Message = mongoose.model("Message", messageSchema);

// Category Validation
function validateMessage(message) {
  const schema = Joi.object({
    partition: Joi.number().integer().required(),
    topic: Joi.string().required(),
    value: Joi.object().required(),
  });

  return schema.validate(message);
}

// Exporting the Module
exports.messageSchema = messageSchema;
exports.Message = Message;
exports.validate = validateMessage;
