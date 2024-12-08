const {Server}  = require('socket.io') ;
const http = require('http') ;
const express = require('express') ;
const mongoose = require('mongoose');
const Message = require('../models/messageModel');  
const Conversation = require('../models/conversationModel');  

const app = express() ;

const server  = http.createServer(app);
const io  = new Server(server ,{
    cors : {
        origin: '*',
        methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
        credentials: true
    }
})

const userSocketMap = {}

const getReceiverSocketId = (receiverId) => {
    return userSocketMap[receiverId] ;
}


io.on('connection' , (socket)=>{
    console.log('a user connected ' , socket.id);

    const userId  = socket.handshake.query.userId ;

    if(userId != "undefined") userSocketMap[userId] = socket.id ;

    io.emit("getOnlineUsers" , Object.keys(userSocketMap))
   
    //Handle disconnect 
    socket.on('disconnect' ,()=>{
        console.log('user disconnected ' , socket.id);
        delete userSocketMap[userId]
        io.emit("getOnlineUsers" , Object.keys(userSocketMap))

        
    })
  
    //Typing status events 
    socket.on('typing' ,()=>{
        socket.broadcast.emit('show_typing_status') ;

    })
    socket.on('stop_typing' ,()=>{
        socket.broadcast.emit('clear_typing_status') ;

    })
    
     // Handle message event
     socket.on('message', async (messageData) => {
        const {message , senderId , receiverId} = messageData ;
        try {
            if (!message || !senderId || !receiverId) {
                throw new Error('Message, senderId, or receiverId is missing');
            }
            const newMessage = new Message({
                senderId,
                receiverId,
                message
              });
            await newMessage.save();
            let conversation = await Conversation.findOne({
                participants: { $all: [senderId, receiverId] }
            });
            if (!conversation) {
                conversation = new Conversation({
                  participants: [senderId, receiverId]
                });
                await conversation.save();
            }
            conversation.messages.push(newMessage._id);
            await conversation.save();
            const receiverSocketId = getReceiverSocketId(receiverId);
            if (receiverSocketId) {
                io.to(receiverSocketId).emit('new_message', messageData);
            }
            socket.broadcast.emit('new_message', messageData);


        } catch (error) {
            console.error("Error processing message:", error);
        }
        console.log('Message received:', messageData);
        

       
    });

}) ;
module.exports = {app , io  , server  , getReceiverSocketId} ;