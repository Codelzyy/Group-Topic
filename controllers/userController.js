const factory = require('./handlerFactory');
const crypto = require('crypto');
const { User, Token } = require('../models');
const { catchAsync, AppError, createTokenUser, attachCookiesToResponse } = require('../utils');
exports.createUser = factory.createOne(User);
exports.getUser = factory.getOne(User);
exports.getAllUsers = factory.getAll(User);
exports.updateUser = factory.updateOne(User);
exports.deleteUser = factory.deleteOne(User);

exports.googleSignup = async (req, res, next) => {
   res.status(201).json(req.user.toAuthJSON());
   return next();
};

exports.fakeLogin = catchAsync(async (req, res, next) => {
   try {
      console.log(req.body.email);
      const user = (await User.find({ email: req.body.email }))[0];
      if (!user) {
         return next(new AppError('Not Found Email!', 404));
      }
      const tokenUser = createTokenUser(user);
      let refreshToken = '';
      const existingToken = await Token.findOne({ user: user._id });
      if (existingToken) {
         const { isValid } = existingToken;
         if (!isValid) {
            return next(AppError('Invalid Credentials', 400));
         }
         refreshToken = existingToken.refreshToken;
         attachCookiesToResponse({ res, user: tokenUser, refreshToken });
         res.status(200).json({ user });
         return;
      }
      refreshToken = crypto.randomBytes(40).toString('hex');
      const userAgent = req.headers['user-agent'];
      const ip = req.ip;
      const userToken = { refreshToken, ip, userAgent, user: user._id };
      await Token.create(userToken);
      attachCookiesToResponse({ res, user: tokenUser, refreshToken });
      res.status(200).json({ user });
   } catch (e) {
      console.log(e.message);
   }
});
