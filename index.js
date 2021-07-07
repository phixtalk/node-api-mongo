const express = require('express');
const app = express();
require('dotenv').config();
const mongoose = require('mongoose');
//Import Routes
const authRoute = require('./routes/auth');
const postRoute = require('./routes/posts');

//Connect to DB
mongoose.connect(
    process.env.DB_CONNECT, 
    { useNewUrlParser: true, useUnifiedTopology: true },
    () => console.log('connected to db')
    );

//Middlewares
app.use(express.json());//now we can send post request from postman

//Route Middlewares
app.use('/api/user', authRoute);
app.use('/api/posts', postRoute);

app.listen(3000, () => console.log("Server Up and running"))
