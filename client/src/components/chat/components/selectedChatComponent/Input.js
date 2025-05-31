import { Flex, useToast, Textarea } from "@chakra-ui/react";
import React, { useRef, useState } from "react";
import { useAuthState } from "../../../../context/AuthProvider";
import { IoIosAdd } from "react-icons/io";
import { IoSendSharp } from "react-icons/io5";
import axios from "axios";
import "./Messages.css";

const Input = () => {
  const { chat, setMessages, user } = useAuthState();
  const [message, setMessage] = useState("");
  const [fileForServer, setFileForServer] = useState(null);
  const inputRef = useRef(null);
  const toast = useToast();

  const handleMessageChange = (e) => setMessage(e.target.value);

  const handleFileSelect = () => {
    if (inputRef.current) inputRef.current.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type === "application/pdf") {
      setFileForServer(file);
      toast({
        title: `${file.name} selected.`,
        status: "info",
        position: "top",
        isClosable: true,
      });
    } else {
      toast({
        title: "Please select a PDF file",
        status: "warning",
        position: "top",
        isClosable: true,
      });
    }
  };

  const sendMessage = async () => {
    try {
      const formData = new FormData();
      formData.append("chat", chat._id);
      formData.append("content", message || "");
      if (fileForServer) {
        formData.append("file", fileForServer);
      }

      const { data } = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/v1/message/do-message-with-file`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${user?.jwt}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (data.success) {
        setMessages((prevMessages) => [...prevMessages, data.newMessage]);
        setMessage("");
        setFileForServer(null);
      }
    } catch (err) {
      toast({
        title: err?.response?.data?.message || "Error sending message",
        status: "error",
        position: "top",
        isClosable: true,
      });
    }
  };

  return (
    <Flex
      minHeight={"8vh"}
      maxHeight={"24vh"}
      background={"#f0f2f5"}
      position={"absolute"}
      width={"100%"}
      justifyContent={"center"}
      alignItems={"center"}
      gap={3}
      paddingRight={{ base: "20px", md: 0 }}
      bottom={0}
    >
      <div onClick={handleFileSelect}>
        <IoIosAdd size={"30px"} cursor={"pointer"} color={"#3b4a54"} />
        <input
          type="file"
          accept="application/pdf"
          ref={inputRef}
          style={{ display: "none" }}
          onChange={handleFileChange}
        />
      </div>

      <Textarea
        value={message}
        onChange={handleMessageChange}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            sendMessage();
          }
        }}
        placeholder={fileForServer ? fileForServer?.name : "Type a message"}
        disabled={fileForServer}
        _placeholder={{ color: fileForServer ? "black" : "gray" }}
        width="87%"
        padding="5px 10px"
        borderRadius="10px"
        backgroundColor="#ffffff"
        maxHeight="20vh"
        minHeight="2.4vh"
        overflowY="auto"
        resize="none"
      />

      <IoSendSharp
        size={"25px"}
        cursor={"pointer"}
        color={"#3b4a54"}
        onClick={sendMessage}
      />
    </Flex>
  );
};

export default Input;
