const path = require('path');
const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const compression = require('compression');
const cors = require('cors');
const { globalErrorHandler } = require('./middlewares');
const { AppError } = require('./utils');
//const passport = require('passport');
// const session = require('express-session');
// const MongoStore = require('connect-mongo');
const mongoose = require('mongoose');

//Router
const {
   userRoutes,
   classRoutes,
   courseRoutes,
   facultyRoutes,
   industryRoutes,
   specializeRoutes,
   subjectRoutes,
   viewRoutes,
} = require('./routers');

// Start express app
const app = express();

const DB = String(process.env.DATABASE).replace('<PASSWORD>', process.env.DATABASE_PASSWORD);
mongoose.connect(DB, {}).then(() => console.log('DB connection successful!'));
app.enable('trust proxy');
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// Implement CORS
app.use(cors());
// Access-Control-Allow-Origin *

app.options('*', cors());
// app.options('/api/v1/tours/:id', cors());

// Serving static files
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser(process.env.cookieParser));

// Set security HTTP headers
// app.use(
//    helmet.contentSecurityPolicy({
//       directives: {
//          defaultSrc: ["'self'", 'data:', 'blob:'],

//          fontSrc: ["'self'", 'https:', 'data:'],

//          scriptSrc: ["'self'", 'unsafe-inline'],

//          scriptSrc: ["'self'", 'https://*.cloudflare.com'],

//          scriptSrcElem: ["'self'", 'https:', 'https://*.cloudflare.com'],

//          styleSrc: ["'self'", 'https:', 'unsafe-inline'],

//          connectSrc: ["'self'", 'data', 'https://*.cloudflare.com'],
//       },
//    })
// );
// app.use(
//    helmet({
//       crossOriginEmbedderPolicy: false,
//       crossOriginResourcePolicy: {
//          allowOrigins: ['*'],
//       },
//       contentSecurityPolicy: {
//          directives: {
//             defaultSrc: ['*'],
//             scriptSrc: ["* data: 'unsafe-eval' 'unsafe-inline' blob:"],
//          },
//       },
//    })
// );

// Development logging
if (process.env.NODE_ENV === 'development') {
   app.use(morgan('dev'));
}

// Limit requests from same API
const limiter = rateLimit({
   max: 100,
   windowMs: 60 * 60 * 1000,
   message: 'Too many requests from this IP, please try again in an hour!',
});

app.use('/api', limiter);
// Body parser, reading data from body into req.body
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Data sanitization against XSS
app.use(xss());

// Prevent parameter pollution
// app.use(
//   hpp({
//     whitelist: [
//       'duration',
//       'ratingsQuantity',
//       'ratingsAverage',
//       'maxGroupSize',
//       'difficulty',
//       'price'
//     ]
//   })
// );

app.use(compression());

// Test middleware
//  app.use((req, res, next) => {
//    req.requestTime = new Date().toISOString();
//    // console.log(req.cookies);
//    next();
// });

// 3) ROUTES

//app.use('/api/v1', authRoutes);
app.use('/', viewRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/classes', classRoutes);
app.use('/api/v1/courses', courseRoutes);
app.use('/api/v1/faculties', facultyRoutes);
app.use('/api/v1/industries', industryRoutes);
app.use('/api/v1/specializes', specializeRoutes);
app.use('/api/v1/subjects', subjectRoutes);

app.all('*', (req, res, next) => {
   next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});
app.all('*', function (req, res, next) {
   res.header('Access-Control-Allow-Origin', '*');
   res.header(
      'Access-Control-Allow-Headers',
      'Content-Type, Content-Length, Authorization, Accept, X-Requested-With , yourHeaderFeild'
   );
   res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');

   if (req.method == 'OPTIONS') {
      res.send(200);
   } else {
      next();
   }
});
app.use(globalErrorHandler);

module.exports = app;
