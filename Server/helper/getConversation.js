const { ConversationModel } = require("../models/conversationModel");
// details for sidebar conversation
const getConversation = async(currentUserId)=>{
    if(currentUserId){
        console.log("current user id :" , currentUserId);
        const currentUserConversation = await ConversationModel.find({
            "$or" : [
                {sender : currentUserId},
                {receiver : currentUserId}
            ]
        }).sort({updatedAt : -1}).populate("messages").populate("sender").populate("receiver")    // -1 ensures the most recent data comes first
        // console.log("current user all conversations with other users : ", currentUserConversation);
        
        const conversation = currentUserConversation.map((conv)=>{
            const countUnseenMsg = conv.messages.reduce((prev, curr)=>{
                const msgByUserId = curr?.msgByUserId?.toString(); 
                // console.log("msg user id ", msgByUserId);
                if(msgByUserId !== currentUserId){
                    // prev + (curr.seen ? 0 : 1)
                    return prev + (curr.seen ? 0 : 1)
                }
                else{
                    return prev;
                }
            }, 0);
            return{
                _id : conv?._id,
                sender : conv?.sender,
                receiver : conv?.receiver,
                unseenMsg : countUnseenMsg,
                lastMsg : conv?.messages[conv?.messages?.length - 1]
            }
        })

        // socket.emit("conversation", conversation); 
        return conversation;
    }
    else{
        return [];
    }
}

module.exports = getConversation;


