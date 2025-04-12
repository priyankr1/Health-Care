const Chat = require("../model/chatModel");
const Message = require("../model/messageModel");

exports.createChat = async (req, res) => {
  try {
    console.log("working");
    const userId = req.user._id;
    if (!userId) {
      res.status(401).json({
        success: false,
        message: "You are not authorized",
      });
      return;
    }
    const { selectedUser } = req.body;
    if (!selectedUser) {
      return res.status(400).json({
        success: false,
        message: "Select a user",
      });
    }
    let chat = await Chat.findOne({
      users: { $all: [userId, selectedUser] },
    }).populate({
      path: "users",
      select: "name image email",
    });
    console.log(chat);
    if (chat) {
      return res.status(200).json({
        success: true,
        message: "Chat is already created",
        chat,
      });
    }
    chat = await Chat.create({ users: [userId, selectedUser] });
    res.status(200).json({
      success: true,
      message: "Chat created",
      chat,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Problem in creating chat",
    });
  }
};

exports.getAllChats = async (req, res) => {
  const userId = req.user._id;
  console.log(userId);
  if (!userId) {
    return res.status(401).json({
      success: false,
      message: "You are not authorized",
    });
  }
  const allChats = await Chat.find({ users: { $in: [userId] } }).populate(
    "users"
  );
  res.status(200).json({
    success: true,
    message: "Chats fetched successfully",
    chats: allChats,
  });
};
