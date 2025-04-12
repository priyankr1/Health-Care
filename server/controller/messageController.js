const Message = require("../model/messageModel");

exports.doMessage = async (req, res) => {
  try {
    const { chat, content } = req.body;
    const userId = req.user._id;
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
    let message = await Message.create({ sender: userId, chat, content });
    console.log(message);
    message = await Message.findById(message._id).populate("sender");

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
  const allMessages = await Message.find({ chat }).populate("sender");
  res.status(200).json({
    success: true,
    message: "Messages fetched",
    allMessages,
  });
};
