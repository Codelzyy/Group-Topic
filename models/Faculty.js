const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const FacultySchema = new mongoose.Schema({
   name: {
      type: String,
      required: [true, 'Please provide name'],
      minlength: 5,
   },
   Head_of_faculty: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'Faculty header must required!'],
   },
});

module.exports = mongoose.model('Faculty', FacultySchema);
