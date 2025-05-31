import { Box } from "@chakra-ui/react";
import React, { useRef, useEffect } from "react";
import { useAuthState } from "../../../../context/AuthProvider";
import "./Messages.css";

const Messages = () => {
  const { user, messages } = useAuthState();
  const boxRef = useRef();

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
      {messages.length > 0 &&
        messages.map((message, ind) => {
          const isUser = message?.sender?._id === user?._id;

          return (
            <div
              key={message?._id}
              className={`message message-box ${
                isUser ? "user-message user-message-box" : "other-user-message"
              }`}
              style={{
                marginTop:
                  ind === 0 ||
                  messages[ind - 1]?.sender?._id !== message.sender?._id
                    ? "12px"
                    : "3px",
              }}
            >
              {/* Display text content */}
              {message?.content && <p>{message.content}</p>}

              {/* Display PDF link if fileUrl exists */}
              {message?.fileUrl && (
                <a
                  href={message.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: "inline-block",
                    marginTop: "5px",
                    padding: "6px 12px",
                    backgroundColor: "#f5f5f5",
                    borderRadius: "6px",
                    color: "#1a73e8",
                    textDecoration: "none",
                    fontWeight: 500,
                    fontSize: "14px",
                  }}
                >
                  📄 View PDF
                </a>
              )}
            </div>
          );
        })}
    </Box>
  );
};

export default Messages;
