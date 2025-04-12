const express = require("express");
const authController = require("../controller/authController");
const messageController=require("../controller/messageController");
const router = express.Router();

router.use(authController.isProtect);

router.post("/do-message",messageController.doMessage);

router.route("/").get(messageController.getAllMessage);


module.exports = router;
