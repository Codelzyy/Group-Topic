const factory = require('./handlerFactory');
const { Course, User } = require('./../models');

const { catchAsync, AppError } = require('../utils');
const { default: mongoose } = require('mongoose');
exports.createCourse = catchAsync(async (req, res, next) => {
   const teacher = await User.findById(req.body.teacher);
   if (teacher?.role !== 'teacher') {
      return next(new AppError('Teacher not found', '404'));
   }

   const doc = await Course.create(req.body);

   res.status(201).json({
      status: 'success',
      data: {
         data: doc,
      },
   });
});
exports.getCourse = factory.getOne(Course);
//exports.getAllCourses = factory.getAll(Course);
exports.updateCourse = factory.updateOne(Course);
exports.deleteCourse = factory.deleteOne(Course);

exports.getAllCourses = catchAsync(async (req, res, next) => {
   let courses = await Course.aggregate([
      {
         $match: { status: 'enrolling' },
      },
      {
         $lookup: {
            from: 'subjects',
            localField: 'subject',
            foreignField: '_id',
            as: 'subject',
         },
      },
      {
         $lookup: {
            from: 'users',
            localField: 'teacher',
            foreignField: '_id',
            as: 'teacher',
         },
      },
      {
         $lookup: {
            from: 'classes',
            localField: 'class',
            foreignField: '_id',
            as: 'class',
         },
      },
      {
         $addFields: { teachername: { $first: '$teacher.name' } },
      },
      {
         $addFields: { classname: { $first: '$class.name' } },
      },
      {
         $addFields: { subject_id: { $first: '$subject.subject_id' } },
      },
      {
         $addFields: { stc: { $first: '$subject.numberOfCredits' } },
      },
      {
         $addFields: { subjectname: { $first: '$subject.name' } },
      },
      {
         $addFields: { type: { $first: '$subject.type' } },
      },
      {
         $addFields: {
            isExist: {
               $in: [mongoose.Types.ObjectId(req.user?._id), '$students.student'],
            },
         },
      },
      { $match: req.query },
      {
         $project: {
            _id: 1,
            max: 1,
            dateStart: 1,
            dateEnd: 1,
            type: 1,
            subjectname: 1,
            teachername: 1,
            subject_id: 1,
            stc: 1,
            students: 1,
            classname: 1,
            isExist: 1,
         },
      },
      { $limit: 100 },
   ]).exec();
   courses = courses.map((x) => {
      x.total = x.students.length;
      delete x.students;
      return x;
   });
   return res.status(200).json({
      status: 'success',
      length: courses.length,
      data: {
         data: courses,
      },
   });
});

exports.DeleteEnrollCourse = catchAsync(async (req, res, next) => {
   return res.status(200).json({
      length: result.length,
      data: result,
   });
});

exports.EnrollCourse = catchAsync(async (req, res, next) => {
   const { id } = req.params;
   const studentId = req.user?._id.toString() || req.body.studentId;
   // Course
   const course = await Course.findById(id);
   const student = await User.findById(studentId);
   if (!course) {
      return next(new AppError('Course not found', '404'));
   }
   if (!student) {
      return next(new AppError('Student not found', '404'));
   }
   if (course.students.length + 1 > course.max) {
      return next(new AppError('Max registers', '401'));
   }

   // delete student in course same subject
   await Course.findOneAndUpdate(
      {
         subject: course.subject,
         status: 'enrolling',
         _id: { $ne: mongoose.Types.ObjectId(id) },
         'students.student': mongoose.Types.ObjectId(studentId),
      },
      // $pull: { students: { $eq: mongoose.Types.ObjectId
      { $pull: { students: { student: mongoose.Types.ObjectId(studentId) } } }
   );

   await User.findOneAndUpdate(
      {
         _id: { $ne: mongoose.Types.ObjectId(studentId) },
      },
      { $push: { course: mongoose.Types.ObjectId(id) } },
      { new: true, upsert: true }
   );
   console.log(studentId);

   const result = await Course.findOneAndUpdate(
      {
         _id: mongoose.Types.ObjectId(id),
         'students.student': { $ne: mongoose.Types.ObjectId(studentId) },
      },
      { $push: { students: { student: studentId } } },
      { new: true, upsert: true }
   );

   return res.status(200).json({
      status: 'success',
      result,
   });
});

exports.DeleteEnrollCourse = catchAsync(async (req, res, next) => {
   const { id } = req.params;

   const studentId = req.user._id;
   // const { studentId } = req.body;
   // Course
   const course = await Course.findById(id);
   const student = await User.findById(studentId);

   if (!course) {
      return next(new AppError('Course not found', '404'));
   }

   if (!student) {
      return next(new AppError('Student not found', '404'));
   }

   await Course.findOneAndUpdate(
      {
         _id: mongoose.Types.ObjectId(id),
      },
      { $pull: { students: { student: mongoose.Types.ObjectId(studentId) } } }
   );

   return res.status(200).json({
      msg: 'Delete successfully',
   });
});

exports.MyCourse = catchAsync(async (req, res, next) => {
   // tam thoi test khong co authenticate
   const { studentId } = req.body;
   // Course
   const student = await User.findById(studentId);

   if (!student) {
      return next(new AppError('Student not found', '404'));
   }
   const result = await Course.find({
      $and: [
         { 'students.student': mongoose.Types.ObjectId(studentId) },
         { $or: [{ status: 'enrolling' }, { status: 'active' }] },
      ],
   });

   return res.status(200).json({
      length: result.length,
      data: result,
   });
});

exports.UpdateScore = catchAsync(async (req, res, next) => {
   const { students } = req.body;
   const session = await mongoose.startSession();
   session.startTransaction();
   let flag = true;
   students.forEach(async function (student) {
      if (student.score < 0 || student.score > 10) {
         flag = false;
      }
      await Course.findByIdAndUpdate(
         {
            _id: mongoose.Types.ObjectId(req.params.id),
            students: { $elemMatch: { $eq: mongoose.Types.ObjectId(student.id) } },
         },
         {
            $set: {
               'students.0.score': student.score,
            },
         }
      );
   });
   if (!flag) {
      await session.abortTransaction();
      session.endSession();
      return next(new AppError('Score not valid', 400));
   }
   await session.commitTransaction();
   session.endSession();
   return res.status(200).json({
      msg: 'Successfully updated score',
   });
});
