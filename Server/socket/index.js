const express = require("express");
const {Server} = require("socket.io");
const http = require("http");

const getUserDetailsFromToken = require("../helper/getUserDetailsFromToken");
const UserModel = require("../models/userModel");
const { ConversationModel, MessageModel } = require("../models/conversationModel");
const getConversation = require("../helper/getConversation");

const app = express();

// Socket Connections
const server = http.createServer(app);
const io = new Server(server, {
    cors : {
        origin : process.env.FRONTEND_URL,
        credentials : true
    }
})


const onlineUser = new Set();

//io.on: Handles global events like new connections (socket represents the connected client.)
io.on("connection", async(socket)=>{
    // console.log("connected userId: ", socket.id);

    // extracts the token sent by the client as part of the connection request
    const token = socket.handshake.auth.token;
    // console.log("token:"+ token);

    // Current user details
    const user = await getUserDetailsFromToken(token);
    // console.log("user details from token : ", user);

    // create a room, enabling targeted communication
    socket.join(user?._id.toString());  
    onlineUser.add(user?._id.toString());
    // console.log("online users ", onlineUser);

    // broadcasts a message to all connected clients with the list of online users
    io.emit("onlineUser", Array.from(onlineUser));

    // user sending message to others
    socket.on("message-page", async(userId)=>{

        const userDetails = await UserModel.findById(userId).select("-password");

        const payload = {
            _id : userDetails._id,
            email : userDetails.email,
            name : userDetails.name,
            profile_pic:userDetails.profile_pic,
            online : onlineUser.has(userId)
        }
        socket.emit("message-user", payload);

        // get previous messages
        const getConversationMessage = await ConversationModel.findOne({
            "$or":[
                {sender:user?._id, receiver:userId},
                { sender:userId, receiver:user?._id}
            ]
        }).populate("messages").sort({updatedAt : -1}); 
        socket.emit("message", getConversationMessage?.messages || []);
    })

    // new message receive
    socket.on("new message", async(data)=>{
        
        // check previouly conversation is done or not, irrespective of their roles as sender or receiver
        let conversation = await ConversationModel.findOne({
            "$or":[
                {sender:data?.sender, receiver:data?.receiver},
                { sender:data?.receiver, receiver:data?.sender}
            ]
        })
        
        // if conversation is not available
        if(!conversation){
            const createConversation = await ConversationModel({
                sender : data?.sender,
                receiver: data?.receiver
            })
            conversation = await createConversation.save();
        }

        // created message
        const message = new MessageModel({
            text : data?.text,
            imageUrl : data?.imageUrl,
            videoUrl : data?.videoUrl,
            msgByUserId : data?.msgByUserId
        })
        const saveMessage = await message.save();

        // message id insertion inside conversation
        const updateConversation = await ConversationModel.updateOne({_id:conversation?._id},{
            "$push" : {messages : saveMessage?._id}
        })

        const getConversationMessage = await ConversationModel.findOne({
            "$or":[
                {sender:data?.sender, receiver:data?.receiver},
                { sender:data?.receiver, receiver:data?.sender}
            ]
        }).populate("messages").sort({updatedAt : -1});

        // console.log("new message :" , data);
        // console.log("conversation details : " , getConversation);

        io.to(data?.sender).emit("message", getConversationMessage?.messages || []);
        io.to(data?.receiver).emit("message", getConversationMessage?.messages || []);
        
        
        // send sidebar conversation to be visible immediately on sending
        const conversationSender = await getConversation(data?.sender);
        const conversationReceiver = await getConversation(data?.receiver);
        io.to(data?.sender).emit("conversation",conversationSender);
        io.to(data?.receiver).emit("conversation",conversationReceiver);
    
    })



    
    // sidebar connectivity
    socket.on("sidebar", async(currentUserId)=>{
        
        const conversation = await getConversation(currentUserId);
        socket.emit("conversation", conversation);
        
    })


    // sidebar seen message
    socket.on("seen", async(msgByUserId)=>{
        let conversation = await ConversationModel.findOne({
            "$or":[
                {sender:user._id, receiver:msgByUserId},
                {sender:msgByUserId, receiver:user?._id}
            ]
        })
        const conversationMessageId = conversation?.messages || [];
        // console.log("converation msg id : " , conversationMessageId);

        const updateMessage = await MessageModel.updateMany(
            {_id : {"$in" : conversationMessageId}, msgByUserId : msgByUserId}, // messageByUserId : msgByUserId
            {"$set" : {seen : true}}
        )
        // console.log("updated messages : ", updateMessage);

        // send sidebar conversation 
        const conversationSender = await getConversation(user._id.toString());
        const conversationReceiver = await getConversation(msgByUserId);
        io.to(user._id.toString()).emit("conversation",conversationSender);
        io.to(msgByUserId).emit("conversation",conversationReceiver);


    })

    
    // disconnect
    socket.on("disconnect", ()=>{
        onlineUser.delete(user?._id.toString());
        console.log("disconnect user ", socket.id);
    })

})


module.exports = {
    app,
    server
}




