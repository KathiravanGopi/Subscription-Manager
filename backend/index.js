var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const mongoose = require('mongoose');
var indexRouter = require('./routes/index');
// var usersRouter = require('./routes/users');
var authRouter = require('./routes/auth');
var subsRouter = require('./routes/subscriptions');
// var categoriesRouter = require('./routes/categories');
const cors = require('cors');
require('dotenv').config();

var app = express();

app.use(logger('dev'));
app.use(cors({
  origin: ['https://subscription-manager-frontend.onrender.com',], // Frontend URL
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());

mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/subscription_management', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('Connected to MongoDB');
}).catch((err) => {
  console.error('Failed to connect to MongoDB', err);
});

app.use('/', indexRouter);
// app.use('/users', usersRouter);
app.use('/auth', authRouter);
app.use('/subscriptions', subsRouter);
// app.use('/categories', categoriesRouter);


const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});


module.exports = app;
