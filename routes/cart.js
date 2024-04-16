const express = require("express");
const cartController = require("../controllers/cart");
const { verify } = require("../auth");
const router = express.Router();

router.get("/", verify, cartController.getUserCart);
router.post("/addToCart", verify, cartController.addToCartMultipleItems);
router.patch('/updateQuantity', verify, cartController.updateCartItemQuantity);
router.delete("/:productId/removeFromCart", verify, cartController.removeFromCart);
router.delete("/clearCart", verify, cartController.clearCart);

module.exports = router;