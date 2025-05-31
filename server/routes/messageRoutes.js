const express = require("express");
const authController = require("../controller/authController");
const messageController = require("../controller/messageController");
const { upload2, uploadPdfToFirebase } = require("../middlewares/file");
const router = express.Router();

router.use(authController.isProtect);

router.post("/do-message-with-file", upload2.single("file"), uploadPdfToFirebase, messageController.doMessageWithFile);
router.route("/").get(messageController.getAllMessage);


module.exports = router;
