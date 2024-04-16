// [IMPORT MONGOOSE LIBRARY]
const mongoose = require("mongoose");

// [DEFINE CART SCHEMA]
const cartSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: [true, "User ID is required"],
  },
  cartItems: [
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
});

// Exporting the mongoose model with the defined schema, named "Cart"
module.exports = mongoose.model("Cart", cartSchema);