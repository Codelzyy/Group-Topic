const factory = require('./handlerFactory');
const { Class, User } = require('./../models');
const { catchAsync, AppError } = require('../utils');
const mongoose = require('mongoose');

exports.createClass = factory.createOne(Class);
exports.getClass = factory.getOne(Class);
exports.getAllClasses = factory.getAll(Class);
exports.updateClass = factory.updateOne(Class);
exports.deleteClass = factory.deleteOne(Class);

exports.AddStudent = catchAsync(async (req, res, next) => {
   const { id } = req.params;
   const { studentId } = req.body;
   const checkExist = await Class.find({
      student: { $elemMatch: { $eq: mongoose.Types.ObjectId(studentId) } },
   });
   const student = await User.findById(studentId);
   //await Promise.all([student, checkExist]);
   if (!student) {
      return next(new AppError('Not found Student', 404));
   }
   if (checkExist.length) {
      return next(new AppError('Student exist in class', 401));
   }
   const result = await Class.findByIdAndUpdate(
      id,
      { $push: { student: studentId } },
      { new: true, upsert: true }
   );
   return res.status(200).json(result);
});
