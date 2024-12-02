const {Server}  = require('socket.io') ;
const http = require('http') ;
const express = require('express') ;

const app = express() ;

const server  = http.createServer(app);
const io  = new Server(server ,{
    cors : {
        origin: '*',
        methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
        credentials: true
    }
})


const getReceiverSocketId = (receiverId) => {
    return userSocketMap[receiverId] ;
}


const userSocketMap = {}
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
     socket.on('message', (messageData) => {
        console.log('Message received:', messageData);
        
        socket.broadcast.emit('new_message', messageData);

       
    });

}) ;
module.exports = {app , io  , server  , getReceiverSocketId} ;