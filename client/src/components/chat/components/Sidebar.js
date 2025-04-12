import React from "react";
import { Box } from "@chakra-ui/react";
import ChatCard from "./ChatCard";
import Input from "./selectedChatComponent/Input";

const Sidebar = ({ chats }) => {
  return (
    <Box
      height={"90%"}
      width={"35%"}
      overflow={"auto"}
      bg={"blue"}
      minH={"85vh"}
      maxH={"85vh"}
      display={{ base: "none", lg: "flex" }}
      flexDir={"column"}
      gap="30px"
      padding={"20px 10px"}
    >
      {chats?.map((chat) => (
        <ChatCard chat={chat} />
      ))}
    </Box>
  );
};

export default Sidebar;
