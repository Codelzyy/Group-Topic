const mongoose = require('mongoose');

const SubjectSchema = new mongoose.Schema({
   subject_id: {
      type: String,
      required: [true, 'Please provide name'],
      minlength: 5,
   },
   name: {
      type: String,
      required: [true, 'Please provide name'],
      minlength: 5,
   },
   required: {
      type: mongoose.Schema.ObjectId,
      ref: 'Specialize',
      required: [true, 'Please provide specialize'],
   },
   numberOfCredits: {
      type: Number,
      required: [true, 'Please provide number of credits'],
   },
   type: {
      type: String,
      enum: ['outline', 'specialized', 'elective', 'physical'],
   },
});
SubjectSchema.pre(/^find/, function (next) {
   this.populate({
      path: 'required',
      select: '_id name',
   });
   next();
});
module.exports = mongoose.model('Subject', SubjectSchema);
