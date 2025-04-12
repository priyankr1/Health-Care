import React, { useEffect, useState } from "react";
import { Box, useToast } from "@chakra-ui/react";
import { useAuthState } from "../../context/AuthProvider";
import axios from "axios";
import Sidebar from "./components/Sidebar";
import { createChats } from "./utils/chat";
import SelectedChat from "./components/SelectedChat";
function ChatModal() {
  const { user } = useAuthState();
  const [chats,setChats]=useState([]);
  const toast = useToast();
  const fetchChats = async () => {
    if (!user) return;
    try {
        const { data } = await axios.get(
            `${process.env.REACT_APP_API_URL}/api/v1/chat`,
            {
              headers: {
                Authorization: `Bearer ${user?.jwt}`,  // ✅ Capital "A", "Bearer" not "BEARER"
              },
            }
          );
          
      if (data.success) {
        toast({
          title: data?.message,
          status: "success",
          isClosable: true,
          position: "top",
        });
        const chats=createChats(data.chats,user);
        console.log(chats);
        setChats(chats);
      }
    } catch (err) {
      toast({
        title: err?.response?.data?.message,
        status: "error",
        isClosable: true,
        position: "top",
      });
    }
  };
  useEffect(() => {
    fetchChats();
  }, [user]);
  return (
    <Box
      display={"flex"}
      alignItems={"start"}
      justifyContent={"start"}
      w={"clamp(320px,90%,1000px)"}
      minH={"85vh"}
      maxH={"85vh"}
      height={"auto"}
      overflowY={"hidden"}
      pb={"1vh"}
      bg={"white"}
      boxShadow={"1px 1px 10px 4px #686d77"}
      sx={{
        "@media(max-width:500px)": {
          minHeight: "63vh",
          maxHeight: "63vh",
        },
      }}
    >
        <Sidebar chats={chats}/>
        <SelectedChat/>
    </Box>
  );
}

export default ChatModal;
