import React from 'react';
import { useAuthState } from '../../../../context/AuthProvider';
import { Avatar, Box } from '@chakra-ui/react';

const ChatHead = () => {
    const {chat,setChat}=useAuthState();
    const handleChat=()=>{
        setChat(null);
    }
   return (
      <Box
        height={"10vh"}
        background={ "#f0f2f5"}
        display={"flex"}
        justifyContent={"space-between"}
        alignItems={"center"}
        padding={"10px 25px 10px 15px"}
        width={"100%"}
        cursor={"pointer"}
        position={"absolute"}
        top={0}
        zIndex={10}
      >
        <Box
          display={"flex"}
          justifyContent={"start"}
          alignItems={"center"}
          gap={"13px"}
          cursor={"pointer"}
        >
          {/* <IoMdArrowRoundBack
            size={"25px"}
            className="backBtn"
            onClick={handleBackClick}
          /> */}
  
          <Avatar
            size={"sm"}
            src={chat?.image}
          />
          
          <div
            className="textBox"
          >
            <p
              style={{
                fontSize: "16px",
                fontWeight: 400,
                padding: 0,
                margin: 0,
                letterSpacing: "1px",
                color:"black"
              }}
            >
              {chat?.name}
            </p>
           
          </div>
        </Box>
      </Box>
    );
}

export default ChatHead
