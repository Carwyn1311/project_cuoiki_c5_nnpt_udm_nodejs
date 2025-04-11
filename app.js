var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require('mongoose');
var { CreateErrorRes } = require('./utils/ResHandler');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var authRouter = require('./routes/auth');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/auth', authRouter);
app.use('/users', usersRouter);
app.use('/roles', require('./routes/roles'));
app.use('/provinces', require('./routes/provinces'));
app.use('/cities', require('./routes/cities'));
app.use('/destinations', require('./routes/destinations'));
app.use('/destination-images', require('./routes/destinationImages'));
app.use('/itineraries', require('./routes/itineraries'));
app.use('/activities', require('./routes/activities'));
app.use('/bookings', require('./routes/bookings'));
app.use('/payment-details', require('./routes/paymentdetails'));
app.use('/reviews', require('./routes/reviews'));
app.use('/upload', require('./routes/upload'));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Kết nối MongoDB
mongoose.connect('mongodb://localhost:27017/TourBookingDB')
.then(() => {
    console.log("Connected to MongoDB");
}).catch(err => {
    console.log("MongoDB connection error:", err);
});

// Catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// Error handler
app.use(function (err, req, res, next) {
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // Xử lý lỗi chung và trả về kết quả qua CreateErrorRes
    CreateErrorRes(res, err.status || 500, err);
});

module.exports = app;