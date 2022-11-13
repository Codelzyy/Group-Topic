// exports.googleSignup = async (req, res, next) => {};
// const { OAuth2Client } = require('google-auth-library');
const { decode } = require('jsonwebtoken');
const { catchAsync, AppError, isTokenValid } = require('../utils');
const { User } = require('../models');
// const client = new OAuth2Client(process.env.CLIENT);
// exports.googleLogin = (req, res) => {
//    const { tokenId } = req.body;
//    client.verifyIdToken(tokenId);
// };

// exports.restrictTo = (...roles) => {
//    return (req, res, next) => {
//       if (!roles.includes(req.user.role)) {
//          return next(new AppError('You do not have permission to perform this action', 403));
//       }
//       next();
//    };
// };

// const logout = async (req, res) => {
//    await Token.findOneAndDelete({ user: req.user.userId });

//    res.cookie('accessToken', 'logout', {
//       httpOnly: true,
//       expires: new Date(Date.now()),
//    });
//    res.cookie('refreshToken', 'logout', {
//       httpOnly: true,
//       expires: new Date(Date.now()),
//    });
//    res.status(200).json({ msg: 'user logged out!' });
// };
exports.protect = catchAsync(async (req, res, next) => {
   // 1) Getting token and check of it's there
   let token;
   if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
   } else if (req.signedCookies.accessToken) {
      token = req.signedCookies.accessToken;
   }
   if (!token) {
      return next(new AppError('You are not logged in! Please log in to get access.', 401));
   }
   // 2) Verification token
   const decoded = await isTokenValid(token, process.env.JWT_SECRET);

   // 3) Check if user still exists
   const currentUser = await User.findById(decoded.user.userId);
   if (!currentUser) {
      return next(new AppError('The user belonging to this token does no longer exist.', 401));
   }

   // GRANT ACCESS TO PROTECTED ROUTE
   req.user = currentUser;
   res.locals.user = currentUser;
   next();
});

exports.isLogged = catchAsync(async (req, res, next) => {
   // 1) Getting token and check of it's there
   let token;
   if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
   } else if (req.signedCookies.accessToken) {
      token = req.signedCookies.accessToken;
   }
   if (!token) {
      return next();
   }
   // 2) Verification token
   const decoded = await isTokenValid(token, process.env.JWT_SECRET);

   // 3) Check if user still exists
   const currentUser = await User.findById(decoded.user.userId);
   if (!currentUser) {
      return next();
   }

   // GRANT ACCESS TO PROTECTED ROUTE
   req.user = currentUser;
   res.locals.user = currentUser;
   next();
});
