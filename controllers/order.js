const bcrypt = require('bcrypt');
const auth = require("../auth");
const Order = require("../models/Order");
const Cart = require("../models/Cart");
const User = require("../models/User");
const Product = require("../models/Product");

const { sendCheckoutNotification } = require("../emailService");
const nodemailer = require("nodemailer");
require("dotenv").config();

// [CREATE ORDER]
module.exports.createOrder = async (req, res) => {
  const userId = req.user.id;
  const { email } = req.user;
  try {
    if (req.user.isAdmin) {
      return res.status(403).send({ message: "Admin Access is Not Allowed" });
    }

    const cart = await Cart.findOne({ userId });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    const { cartItems, totalPrice } = cart;

    for (const item of cartItems) {
      const product = await Product.findById(item.productId);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      if (!product.inventoryStock) {
        return res
          .status(404)
          .json({
            message: "Kindly notify the admin about the product's stock",
          });
      }
      if (item.quantity > product.inventoryStock) {
        return res
          .status(400)
          .json({ message: "Insufficient inventory stock for the product" });
      }

      product.inventoryStock -= item.quantity;
      await product.save();
    }

    const orderedProducts = new Order({
      userId: userId,
      productsOrdered: cartItems.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
        subtotal: item.subtotal,
      })),
      totalPrice: totalPrice,
    });

    const checkout = await orderedProducts.save();

    cart.cartItems = [];
    cart.totalPrice = 0;
    await cart.save();

    await sendCheckoutNotification(email);

    res.status(201).json({ message: "Order created successfully", checkout });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// [RETRIEVE ALL ORDERS - ADMIN]
module.exports.retrievedByAdmin = async (req, res) => {
  try {

    const orders = await Order.find({});

    if (!orders || orders.length === 0) {
      return res.status(404).json({ message: "No orders found" });
    }
    res.status(200).json({ message: "Orders retrieved successfully", orders });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// [RETRIEVE ORDERS - CUSTOMER]
module.exports.retrievedByAuthUser = async (req, res) => {
  console.log(req.user.id);
  const userId = req.user.id;
  try {
    if (req.user.isAdmin) {
      return res.status(403).send({ message: "Admin Access is Not Allowed" });
    } else {

      const orders = await Order.find({ userId });

      if (!orders || orders.length === 0) {
        return res.status(404).json({ message: "No orders found" });
      }

      res.status(200).json({ message: "Order retrieved successfully", orders });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};