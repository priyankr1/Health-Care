import React from "react";
import { Box } from "@chakra-ui/react";
import ChatCard from "./ChatCard";
import Input from "./selectedChatComponent/Input";
import { useAuthState } from "../../../context/AuthProvider";

const Sidebar = ({ chats }) => {
  const {visibale}=useAuthState()
  return (
    <Box
      height={"90%"}
      width={{base:"100%",lg:"35%"}}
      overflow={"auto"}
      bg={"linear-gradient(to right, #393f4d, #6b707a)"}
      minH={"85vh"}
      maxH={"85vh"}
      display={{ base: `${visibale?"flex":"none"}`, lg: "flex" }}
      flexDir={"column"}
      gap="30px"
      padding={"20px 10px"}
      sx={{
        "@media(max-width:500px)": {
          minHeight: "63vh",
          maxHeight: "63vh",
        },
      }}
    >
      {chats?.map((chat) => (
        <ChatCard chat={chat} />
      ))}
    </Box>
  );
};

export default Sidebar;
