const mongoose = require('mongoose');
const CourseSchema = new mongoose.Schema({
   dateStart: Date,
   dateEnd: Date,
   dateStartEnroll: Date,
   dateEndEnroll: Date,
   codeCourse: {
      type: String,
      required: true,
   },
   teacher: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'Course must required teacher!'],
   },
   subject: {
      type: mongoose.Schema.ObjectId,
      ref: 'Subject',
      required: [true, 'Course must required subject!'],
   },
   class: {
      type: mongoose.Schema.ObjectId,
      ref: 'Class',
      required: [true, 'Course must required class!'],
   },
   max: {
      type: Number,
      required: [true, 'Please provide maximum'],
      default: 100,
   },
   min: {
      type: Number,
      required: [true, 'Please provide maximum'],
      min: 20,
   },
   students: [
      {
         student: {
            type: mongoose.Schema.ObjectId,
            ref: 'User',
            uniqueItems: true,
         },
         score: { type: Number, default: 0 },
         _id: false,
         // unique: true,
      },
   ],
   time: String,
   status: {
      type: String,
      enum: ['inactive', 'enrolling', 'active', 'canceled', 'completed'],
   },
});

CourseSchema.pre(/^find/, function (next) {
   this.populate('subject teacher');

   // .select(
   //    '_id dateStart dateEnd teacher.name subject max min -class -students -status'
   // );
   next();
});
module.exports = mongoose.model('Course', CourseSchema);
