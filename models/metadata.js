// Loading Libraries
const Joi = require("joi");
const mongoose = require("mongoose");

// Defining the Meta Schema
const metaSchema = new mongoose.Schema(
  {
    data: {
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

const Meta = mongoose.model("Meta", metaSchema);

// Category Validation
function validateMeta(meta) {
  const schema = Joi.object({
    data: Joi.object().required(),
  });

  return schema.validate(meta);
}

// Exporting the Module
exports.metaSchema = metaSchema;
exports.Meta = Meta;
exports.validate = validateMeta;
