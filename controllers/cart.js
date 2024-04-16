const bcrypt = require('bcrypt');
const Cart = require("../models/Cart");
const Product = require("../models/Product");
const User = require("../models/User");
const auth = require("../auth");

// [ADD TO CART]
module.exports.addToCartMultipleItems = async (req, res) => {
  const { cartItems } = req.body;
  const  userId  = req.user.id;
  try {
    let userCart = await Cart.findOne({ userId });
    if (!userCart) {
      userCart = new Cart({
        userId,
        cartItems: [],
        totalPrice: 0,
      });
    }

    for (const cartItem of cartItems) {
      const { productId, quantity } = cartItem;

      const product = await Product.findById(productId);

      // If product doesn't exist or is inactive, return an error
      if (!product || !product.isActive) {
        return res
          .status(404)
          .json({ message: "Product not found or inactive" });
      }

      // Calculate
      let subtotal = product.price * quantity;
      let { cartItems } = userCart;
      const productName = product.productName;

      const productIndex = cartItems.findIndex(
        (item) => item.productId === productId
      );

      if (productIndex !== -1) {
        cartItems[productIndex].productName = productName;
        cartItems[productIndex].quantity += quantity;
        cartItems[productIndex].subtotal += subtotal;
      } else {
        cartItems.push({
          productId,
          productName,
          quantity,
          subtotal,
        });
      }
      userCart.totalPrice += subtotal;
    }
    await userCart.save();
    res
      .status(201)
      .json({ message: "Products added to cart successfully", cart: userCart });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// [GET USER CART]
module.exports.getUserCart = (req, res) => {
  try {
    return Cart.find({ userId : req.user.id })
      .then((userCart) => {
        if (userCart.length > 0) {
          return res.status(200).send({ userCart });
        } else {
          return res.status(404).send({
            message: "The user's cart does not exists at the moment.",
          });
        }
      })
      .catch((err) => {
        console.error("Error in finding  the cart", err);

        return res
          .status(500)
          .send({ error: "Error finding the cart of the user " });
      });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// [UPDATE ITEM QUANTITY]
module.exports.updateCartItemQuantity = async (req, res) => {
  const userId = req.user.id;
  const updatedCartItems = req.body;

  try {
    let userCart = await Cart.findOne({ userId });

    if (!userCart) {
      return res.status(404).json({ message: "User's cart not found" });
    }

    for (const updatedCartItem of updatedCartItems) {
      const { productId, quantity } = updatedCartItem;

      const product = await Product.findById(productId);

      if (!product || !product.isActive) {
        return res.status(404).json({ message: `Product with ID ${productId} not found or inactive` });
      }

      const newSubtotal = product.price * quantity;

      const productIndex = userCart.cartItems.findIndex(
        (item) => item.productId === productId
      );

      if (productIndex === -1) {
        return res.status(404).json({ message: `Product with ID ${productId} not found in the cart` });
      }

      userCart.cartItems[productIndex].quantity = quantity;
      userCart.cartItems[productIndex].subtotal = newSubtotal;
    }

    userCart.totalPrice = userCart.cartItems.reduce((total, item) => total + item.subtotal, 0);

    await userCart.save();

    res.status(200).json({ message: "Cart item quantities updated successfully", cart: userCart });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// [REMOVE ITEM FROM CART]
module.exports.removeFromCart = async (req, res) => {
  const { userId } = req.body;
  const { productId } = req.params;
  try {
    let cart = await Cart.findOne({ userId });
    cart.cartItems = cart.cartItems.filter(
      (item) => item.productId !== productId
    );
    cart.totalPrice = cart.cartItems.reduce(
      (total, item) => total + item.subtotal,
      0
    );
    await cart.save();
    res.status(200).json(cart);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// [CLEAR CART]
module.exports.clearCart = async (req, res) => {
  const { userId } = req.body;
  try {
    let cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({ error: "Cart not found" });
    }
    cart.cartItems = []; // Emptying the cart items array
    cart.totalPrice = 0; // Resetting the total price
    await cart.save();
    res.status(200).json(cart);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};