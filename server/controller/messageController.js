const Message = require("../model/messageModel");
const CryptoJS =require("crypto-js");
exports.doMessage = async (req, res) => {
  try {
    const { chat, content } = req.body;
    const userId = req.user._id;
    const encriptContent= CryptoJS.AES.encrypt(content, process.env.CRYPTO_SECRET_KEY).toString();
    console.log(encriptContent)
    if (!userId) {
      res.status(401).json({
        success: false,
        message: "You are not authorized",
      });
      return;
    }
    if (!chat) {
      res.status(200).json({
        success: false,
        message: "Select a chat",
      });
      return;
    }
    let message = await Message.create({ sender: userId, chat, content:encriptContent });
    message = await Message.findById(message._id).populate("sender");
    const bytes = CryptoJS.AES.decrypt(message.content, process.env.CRYPTO_SECRET_KEY);
    const decryptedContent = bytes.toString(CryptoJS.enc.Utf8);
    message.content = decryptedContent;
    res.status(200).json({
      success: true,
      message: "Message sended",
      newMessage: message,
    });
  } catch (err) {}
};

exports.getAllMessage = async (req, res) => {
  const user = req.user;
  if (!user) {
    res.status(401).json({
      success: false,
      message: "You are not authorized",
    });
    return;
  }
  const { chat } = req.query;
  if (!chat) {
    res.status(400).json({
      success: false,
      message: "Select a chat",
    });
    return;
  }
  let allMessages = await Message.find({ chat }).populate("sender");
  allMessages = allMessages.map((msg) => {
    const bytes = CryptoJS.AES.decrypt(msg.content, process.env.CRYPTO_SECRET_KEY);
    const decryptedContent = bytes.toString(CryptoJS.enc.Utf8);
  
    return {
      ...msg._doc, 
      content: decryptedContent,
    };
  });
  console.log(allMessages)
  res.status(200).json({
    success: true,
    message: "Messages fetched",
    allMessages,
  });
};
