const express = require("express");
const userController = require("../controllers/user");
const { verify, verifyAdmin } = require("../auth");
const router = express.Router();

router.post("/register", userController.registerUser);
router.post("/login", userController.loginUser);
router.get("/details", verify, userController.getProfile);
router.put("/:userId/set-as-admin", verify, verifyAdmin, userController.updateAsAdmin);
router.put("/update-password", verify, userController.resetPassword); 


module.exports = router;