import { Box } from "@chakra-ui/react";
import React, { useEffect } from "react";
import { useAuthState } from "../../../context/AuthProvider";
import ChatHead from "./selectedChatComponent/ChatHead";
import Input from "./selectedChatComponent/Input";
import Messages from "./selectedChatComponent/Messages";
import axios from "axios";
const SelectedChat = () => {
  const { chat, setMessages, messages, user ,visibale} = useAuthState();
  console.log(messages+"work");
  const fetchMessages = async () => {
    if (!chat) return;
    if (!user) return;
    try {
      const { data } = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/v1/message?chat=${chat?._id}`,
        {
          headers: {
            Authorization: `Bearer ${user?.jwt}`,
          },
        }
      );

      if (data.success) {
        setMessages(data.allMessages);
        console.log(messages);
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, [user, chat]);
  return (
    <Box
      width={{ base: "100%", lg: "65%" }}
      height={"100%"}
      minH={"85vh"}
      maxH={"85vh"}
      display={{ base: `${visibale?"none":"flex"}`, lg: "flex" }}
      position={"relative"}
      sx={{
        "@media(max-width:500px)": {
          minHeight: "63vh",
          maxHeight: "63vh",
        },
      }}
    >
      {chat ? (
        <>
          <ChatHead />
          <Messages />
          <Input />
        </>
      ) : (
        <h1 className="no-item-text">No chat selected</h1>
      )}
    </Box>
  );
};

export default SelectedChat;
