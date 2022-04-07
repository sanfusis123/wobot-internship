const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
require('dotenv').config();
const app = express();

const userRoute = require('./routes/user');
const productRoute = require('./routes/product');

mongoose.connect(process.env.DATABASE).then(()=>{
                                              console.log('Databse is connected');
                                               })



app.use(express.json());
app.use(morgan('dev'));

// user route
app.use('/user',userRoute)
//product route
app.use('/product',productRoute);




app.listen(process.env.PORT,()=>{
    console.log(`app is running on port : ${process.env.PORT}`);
})












