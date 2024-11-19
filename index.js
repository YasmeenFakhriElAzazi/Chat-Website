require('dotenv').config()
const express = require('express')
const mongoose  = require('mongoose')
const cors  = require('cors') ;

const auth  = require('./routes/auth')
const userRoute = require('./routes/userRouter');
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

app.get('/', (req, res) => {
    res.send('Hello, Vercel!');
  });

app.all('*', (req, res, next) => {
    return res.status(404).json({ status: httpStatusText.ERROR, message: 'this resource is not available' })
}) 

app.listen(port, () => {
    console.log(`listening on http://localhost:${port}`);

})

