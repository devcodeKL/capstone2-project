// [IMPORT MONGOOSE LIBRARY]
const mongoose = require("mongoose");

// [DEFINE PRODUCT SCHEMA]
const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is Required"],
  },
  description: {
    type: String,
    required: [true, "Description is Required"],
  },
  price: {
    type: Number,
    required: [true, "Price is Required"],
  },
  inventoryStock: {
    type: Number,
    required: [true, "Inventory stock is Required"],
  },
  imageUrl: {
    type: String, 
    default: "",
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  createdOn: {
    type: Date,
    default: Date.now,
  },
});

// Exporting the mongoose model with the defined schema, named "Product"
module.exports = mongoose.model("Product", productSchema);