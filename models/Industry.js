const mongoose = require('mongoose');

const IndustrySchema = new mongoose.Schema({
   name: {
      type: String,
      required: [true, 'Please provide name'],
      minlength: 5,
   },
   timeTable: [
      {
         course: {
            type: mongoose.Schema.ObjectId,
            ref: 'User',
         },
         semester: Number,
      },
   ],
});

module.exports = mongoose.model('Industry', IndustrySchema);
