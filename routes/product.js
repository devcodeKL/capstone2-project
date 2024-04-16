const express = require("express");
const productController = require("../controllers/product");
const { verify, verifyAdmin } = require("../auth"); 
const router = express.Router();

router.post("/", verify, verifyAdmin, productController.createProduct);
router.get("/all", productController.getAllProduct);
router.get("/active", productController.getAllActive);
router.get("/:productId", productController.getProduct);
router.post("/searchByName", productController.searchProductsByName);
router.post("/searchByPrice", productController.searchProductsByPriceRange);
router.patch("/:productId", verify, verifyAdmin, productController.updateProductInfo);
router.patch("/activate/:productId", verify, verifyAdmin, productController.activateProduct);
router.patch("/archive/:productId", verify, verifyAdmin, productController.archiveProduct)

module.exports = router;