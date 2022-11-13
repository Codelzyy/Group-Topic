const { createJWT, isTokenValid, attachCookiesToResponse } = require('./jwt');
const createTokenUser = require('./createTokenUser');
const checkPermissions = require('./checkPermissions');
const sendVerificationEmail = require('./sendVerificationEmail');
const sendResetPasswordEmail = require('./sendResetPasswordEmail');
const createHash = require('./createHash');
const APIReturn = require('./APIReturn');
const AppError = require('./appError');
const catchAsync = require('./catchAsync');
const SendEmail = require('./sendEmail');
const APIFeatures = require('./apiFeatures');
module.exports = {
   createJWT,
   isTokenValid,
   attachCookiesToResponse,
   createTokenUser,
   checkPermissions,
   sendVerificationEmail,
   sendResetPasswordEmail,
   createHash,
   APIReturn,
   APIFeatures,
   AppError,
   catchAsync,
   SendEmail,
};
