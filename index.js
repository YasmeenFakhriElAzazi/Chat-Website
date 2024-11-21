require('dotenv').config()
const express = require('express')
const mongoose  = require('mongoose')
const cors  = require('cors') ;

const auth  = require('./routes/auth')
const userRoute = require('./routes/userRouter');
const messageRoute = require('./routes/messageRouter');
const httpStatusText = require("./utils/httpStatusText");

const app = express() ;

const port  = process.env.PORT || 3000;

const url = process.env.MONGO_URL ;

mongoose.connect(url).then(() => {
    console.log('mongodb server started');

})
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    credentials: true
}))
app.use(express.json());

app.use('/api/auth', auth);
app.use('/api/users', userRoute);
app.use('/api/messages', messageRoute);

app.get('/', (req, res) => {
    res.send('Hello, Vercel!');
  });

app.all('*', (req, res, next) => {
    return res.status(404).json({ status: httpStatusText.ERROR, message: 'this resource is not available' })
}) 

app.listen(port, () => {
    console.log(`listening on http://localhost:${port}`);

})







// require('dotenv').config();
// const express = require('express');
// const mongoose = require('mongoose');
// const cors = require('cors');
// const http = require('http'); // Required to create server for socket.io
// const { Server } = require('socket.io'); // Socket.io server

// const auth = require('./routes/auth');
// const userRoute = require('./routes/userRouter');
// const httpStatusText = require("./utils/httpStatusText");

// const app = express();
// const server = http.createServer(app); // Create an HTTP server
// const io = new Server(server, {
//     cors: {
//         origin: '*', // Allow any origin
//         methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
//     }
// });

// const port = process.env.PORT || 3000;
// const url = process.env.MONGO_URL;

// // Connect to MongoDB
// mongoose.connect(url).then(() => {
//     console.log('MongoDB server started');
// });

// // Middleware
// app.use(cors({
//     origin: '*',
//     methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
//     credentials: true
// }));
// app.use(express.json());

// app.use('/api/auth', auth);
// app.use('/api/users', userRoute);
// app.use('/api/messages', messageRoute);

// // Basic Route
// app.get('/', (req, res) => {
//     res.send('Hello, Vercel with Socket.io!');
// });

// // Catch-All Route
// app.all('*', (req, res) => {
//     return res.status(404).json({
//         status: httpStatusText.ERROR,
//         message: 'This resource is not available'
//     });
// });

// // WebSocket logic
// io.on('connection', (socket) => {
//     console.log('A user connected:', socket.id);

//     // Listening for custom events
//     socket.on('message', (data) => {
//         console.log('Message received:', data);
//         // Broadcast the message to all connected clients
//         socket.broadcast.emit('message', data);
//     });

//     // Disconnection event
//     socket.on('disconnect', () => {
//         console.log('A user disconnected:', socket.id);
//     });
// });

// // Start the server
// server.listen(port, () => {
//     console.log(`Server listening on http://localhost:${port}`);
// });
