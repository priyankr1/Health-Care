const express = require("express");
const authController = require("../controller/authController");
const chatController=require("../controller/chatController");
const router = express.Router();
router.use(authController.isProtect);

router.route("/").post(chatController.createChat).get(chatController.getAllChats);


module.exports = router;
