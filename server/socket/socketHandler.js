const { Server } = require("socket.io");
const User = require("../model/userModel");
const mongoose = require("mongoose");

const users = new Map();

const socketHandler = (io) => {
  io.on("connection", (socket) => {
    console.log(`🟢 User connected: ${socket.id}`);

    socket.on("setup", (userData) => {
      socket.join(userData._id);
      users.set(userData._id, socket.id);

      io.emit("update_users", Array.from(users.keys()));
      socket.emit("connected");
    });

    socket.on("join_chat", (chatId) => {
      socket.join(chatId);
      console.log(`User joined chat: ${chatId}`);
    });

    socket.on("send_message", (data) => {
      const { chat, sender } = data;

      if (!chat.users || !Array.isArray(chat.users)) {
        return console.error("chat.users is not defined or not an array");
      }

      chat.users.forEach((userId) => {
        if (userId !== sender._id) {
          const receiverSocketId = users.get(userId);
          if (receiverSocketId) {
            io.to(receiverSocketId).emit("message_received", data);
          }
        }
      });
    });

    socket.on("message_deleted", ({ chat, message }) => {
      const sender = message.sender;

      chat.users?.forEach((user) => {
        if (user?._id !== sender?._id) {
          const receiverSocketId = users.get(user?._id);
          if (receiverSocketId) {
            console.log("emited");
            io.to(receiverSocketId).emit("message_deleted", message);
          }
        }
      });
    });

    socket.on("new_chat", (chat) => {
      const sender = chat.topMessage?.sender;

      if (!chat.users || !Array.isArray(chat.users)) {
        return console.error("chat.users is not defined or not an array");
      }

      chat.users?.forEach((user) => {
        if (user._id.toString() !== sender?._id) {
          const receiverSocketId = users.get(user._id.toString());
          if (receiverSocketId) {
            io.to(receiverSocketId).emit("new_chat", chat);
          }
        }
      });
    });

    socket.on("typing", (room) => {
      if (room?._id) {
        socket.to(room._id).emit("typing", room);
      }
    });

    socket.on("stop_typing", (room) => {
      if (room?._id) {
        socket.to(room._id).emit("stop_typing", room);
      }
    });

    socket.on("disconnect", async () => {
      let userId;
      for (const [key, value] of users) {
        if (value === socket.id) {
          userId = key;
          break;
        }
      }

      if (userId) {
        users.delete(userId);
        io.emit("update_users", Array.from(users.keys()));
        io.emit("user_status_changed", { userId, lastSeen: new Date() });

        try {
          await User.findByIdAndUpdate(
            new mongoose.Types.ObjectId(userId),
            { lastSeen: { time: new Date() } },
            { new: true }
          );
        } catch (error) {
          console.error("Error updating lastSeen:", error);
        }
      }

      console.log(`🔴 User disconnected: ${socket.id}`);
    });
  });
};

module.exports = socketHandler;
