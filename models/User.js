const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const UserSchema = new mongoose.Schema({
   name: {
      type: String,
      required: [true, 'Please provide name'],
      minlength: 2,
   },
   code: { type: String, required: [true, 'Please provide code'] },
   googleId: {
      type: String,
      required: true,
   },
   email: {
      type: String,
      unique: true,
      required: [true, 'Please provide email'],
      validate: [validator.isEmail, 'Please provide valid email'],
   },
   role: {
      type: String,
      enum: ['admin', 'teacher', 'student'],
      default: 'student',
   },
   dateJoin: { type: Date, default: Date.now },
   verificationToken: String,
   faculty: {
      type: mongoose.Schema.ObjectId,
      ref: 'Faculty',
   },
   industry: {
      type: mongoose.Schema.ObjectId,
      ref: 'Industry',
   },
   specialize: [
      {
         type: mongoose.Schema.ObjectId,
         ref: 'Specialize',
      },
   ],

   active: {
      type: Boolean,
      default: true,
   },
});

// UserSchema.pre(/^find/, function (next) {
//    // this points to the current query

//    this.find({ active: { $ne: false } });
//    next();
// });
UserSchema.methods = {
   createToken() {
      return jwt.sign(
         {
            _id: this._id,
         },
         process.env.JWT_SECRET
      );
   },
   toAuthJSON() {
      return {
         _id: this.id,
         username: this.username,
         token: this.createToken(),
      };
   },
};
const User = mongoose.model('User', UserSchema);

module.exports = User;
