import { Flex ,useToast} from '@chakra-ui/react';
import React,{useState} from 'react'
import { useAuthState } from '../../../../context/AuthProvider';
import { IoIosAdd } from "react-icons/io";
import { IoSendSharp } from "react-icons/io5";

import axios from 'axios';
const Input = () => {
const {chat,setMessages,user}=useAuthState();
const [message,setMessage]=useState("");
const toast=useToast();
const handleMessageChange=(e)=>{
setMessage(e.target.value)
}
const sendMessage=async()=>{
try{
    console.log("kljwlkjr");

const {data}=await axios.post(`${process.env.REACT_APP_API_URL}/api/v1/message/do-message`,{
    content:message,
    sender:user._id,
    chat:chat._id
},{
    headers:{
        Authorization:`Bearer ${user?.jwt}`
    }
});
console.log(data);
if(data.success){
    console.log(data);
    setMessages((prevMessages)=>[...prevMessages,data.newMessage]);
    setMessage("");
}
}catch(err){
    toast({
title:err.response.message,
status:"error",
position:"top",
isClosable:true
    });
}
}
   return <Flex
       minHeight={"8vh"}
       maxHeight={"24vh"}
       background={ "#f0f2f5"}
       position={"absolute"}
       width={ "100%" }
       justifyContent={"center"}
       alignItems={"center"}
       gap={3}
       paddingRight={{ base: "20px", md: 0 }}
       bottom={0}
     >
       
           <IoIosAdd
             size={"30px"}
             cursor={"pointer"}
             color={"#3b4a54"}
           />
 
           <textarea
             style={{
               width: "87%",
               padding: "5px 10px",
               borderRadius: "10px",
               backgroundColor:  "#ffffff",
               maxHeight: "20vh",
               height: "5.4vh",
               overflowY: "auto",
               overflowX: "hidden", // Prevent horizontal scrolling
               resize: "none", // Prevent resizing if needed
             }}
             value={message}
             onChange={handleMessageChange}
             onKeyDown={(e) => {
               if (e.key === "Enter") {
                 e.preventDefault();
                 // Call a function or handle the event
                 sendMessage();
               }
             }}
             placeholder="Type a message"
             className="send-message-input"
           ></textarea>
 
           <IoSendSharp
             size={"25px"}
             cursor={"pointer"}
             color={ "#3b4a54"}
             onClick={sendMessage}
           />
         
       
     </Flex>
}

export default Input
