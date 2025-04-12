import { Box, Flex, Image, Text } from "@chakra-ui/react";
import { useAuthState } from "../../../context/AuthProvider";

const ChatCard = ({chat}) => {
    const {setChat,setVisibale}=useAuthState();
  const {email,name,image,_id}=chat;
  return (
    <Box
      p={4}
      borderRadius="2xl"
      boxShadow="md"
      bg="white"
      _hover={{ boxShadow: "lg", cursor: "pointer", bg: "gray.50" }}
      transition="0.2s"
      width="100%"
     maxH={"80px"}
     onClick={()=>{setVisibale(false);setChat(chat)} }
    >
      <Flex align="center" gap={4}>
        <Image
          src={image}
          alt={name}
          boxSize="50px"
          borderRadius="full"
          objectFit="cover"
        />
        <Box>
          <Text fontWeight="bold" fontSize="lg">
            {name}
          </Text>
          <Text fontSize="sm" color="gray.600">
            {email}
          </Text>
        </Box>
      </Flex>
    </Box>
  );
};

export default ChatCard;
