import { Box } from "@chakra-ui/react";
import React, { useRef,useEffect } from "react";
import { useAuthState } from "../../../../context/AuthProvider";
import "./Messages.css"

const Messages = () => {
    
  const { user,messages } = useAuthState();
  const boxRef = useRef();
  console.log(messages);
   useEffect(() => {
      if (boxRef.current) {
        boxRef.current.scrollTop = boxRef.current.scrollHeight;
      }
    }, [messages]);
  return (
    <Box
      height={"70vh"}
      ref={boxRef}
      w={"100%"}
      overflowY={"auto"}
      marginTop={"10vh"}
      padding={"2vh 8%"}
      pb={"30px"}
      display={"flex"}
      flexDirection={"column"}
      background={"#e7dcd4"}
    >
      {messages.length>0 &&
        messages?.map((message, ind) => {
          return (
            <div
              className={`message message-box ${
                message?.sender?._id === user?._id
                  ? "user-message user-message-box"
                  : "other-user-message"
              }`}
              key={message?._id}
              style={{
                marginTop: !(
                  ind === 0 ||
                  messages[ind - 1]?.sender?._id !== message.sender?._id
                )
                  ? "3px"
                  : "12px",
              }}
            >
              <p>{message?.content} </p>
            </div>
          );
        })}
    </Box>
  );
};

export default Messages;
