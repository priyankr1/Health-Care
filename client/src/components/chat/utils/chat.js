export const createChats=(chats,user)=>{
const updatedArr=chats.map((chat)=>{
const otherUser=chat.users[0]._id===user._id?chat.users[1]:chat.users[0];
return {
    name:otherUser.name,
    email:otherUser.email,
    _id:chat._id,
    image:otherUser.image,
    userId:otherUser._id
};

});
console.log(updatedArr);
return updatedArr;
}