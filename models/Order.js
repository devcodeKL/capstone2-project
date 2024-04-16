// [IMPORT MONGOOSE LIBRARY]
const mongoose = require("mongoose");

// [DEFINE ORDER SCHEMA]
const orderSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: [true, "User ID is required"],
  },
  productsOrdered: [
    {
      productId: {
        type: String,
        required: [true, "Product ID is required"],
      },
      quantity: {
        type: Number,
        required: [true, "Quantity is required"],
      },
      subtotal: {
        type: Number,
        required: [true, "Subtotal is required"],
      },
    },
  ],
  totalPrice: {
    type: Number,
    required: [true, "Total price is required"],
  },
  orderedOn: {
    type: Date,
    default: Date.now(),
  },
  status: {
    type: String,
    default: "Pending",
  },
});

// Exporting the mongoose model with the defined schema, named "Order"
module.exports = mongoose.model("Order", orderSchema);