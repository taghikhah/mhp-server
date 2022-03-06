// Loading Libraries
const Joi = require("joi");
const mongoose = require("mongoose");

// Defining the Filess Schema
const fileSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    path: {
      type: String,
      required: true,
    },
    destination: {
      type: String,
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

const Files = mongoose.model("Files", fileSchema);

// Category Validation
function validateFiles(file) {
  const schema = Joi.object({
    name: Joi.string().required(),
    path: Joi.string().required(),
    destination: Joi.string().required(),
  });

  return schema.validate(file);
}

// Exporting the Module
exports.fileSchema = fileSchema;
exports.Files = Files;
exports.validate = validateFiles;
