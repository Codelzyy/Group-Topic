const mongoose = require('mongoose');

const ClassSchema = new mongoose.Schema({
   name: {
      type: String,
      required: [true, 'Please provide name'],
      minlength: 5,
   },
   student: [
      {
         type: mongoose.Schema.ObjectId,
         ref: 'User',
      },
   ],
   dateStart: Date,
});

module.exports = mongoose.model('Class', ClassSchema);
