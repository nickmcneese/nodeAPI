const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const productRoutes = require("./api/routes/products");
const orderRoutes = require('./api/routes/orders');

//setting up DB with mongoose
mongoose.connect('mongodb+srv://nmcneese:' + process.env.MONGO_ATLAS_PW + '@node-rest-testing.bfay2rk.mongodb.net/?retryWrites=true&w=majority')

//logger middleware
app.use(morgan('dev')); 

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

//allows for CORS control
app.use((res, req, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', '*');
    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
        return res.status(200).json({});
    }
    next();
});

//Routes which should handle requests
app.use('/products', productRoutes);
app.use('/orders', orderRoutes);

//error handling
app.use((req, res, next) => {
    const error = new Error("Not Found");
    error.status = 404;
    next(error);
});

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    });
});

module.exports = app;