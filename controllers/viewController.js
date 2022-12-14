const { catchAsync } = require('../utils');
const { Subject, Course, Token } = require('../models');
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');

// const ip = fs.readFileSync('/home/ec2-user/Cloud/ip.txt', { encoding: 'utf8', flag: 'r' });

exports.getLoginForm = (req, res) => {
   res.status(200).render('login', {
      title: 'Log into your account',
   });
};
exports.getLogout = catchAsync(async (req, res) => {
   try {
      await Token.findOneAndDelete({ user: req.user.userId });
      res.cookie('accessToken', 'logout', {
         httpOnly: true,
         expires: new Date(Date.now()),
      });
      res.cookie('refreshToken', 'logout', {
         httpOnly: true,
         expires: new Date(Date.now()),
      });
      res.redirect(`/login`);
   } catch (err) {
      console.log(err.message);
      res.redirect(`/login`);
   }
});
exports.getListCourse = catchAsync(async (req, res) => {
   let courses = await Course.aggregate([
      {
         $match: { status: 'enrolling', subject: mongoose.Types.ObjectId(req.params.id) },
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
         $addFields: {
            isExist: {
               $in: [mongoose.Types.ObjectId(req.user._id), '$students.student'],
            },
         },
      },
      {
         $addFields: { teachername: { $arrayElemAt: ['$teacher.name', 0] } },
      },
      {
         $addFields: { subject_id: { $arrayElemAt: ['$subject.subject_id', 0] } },
      },
      {
         $addFields: { stc: { $arrayElemAt: ['$subject.numberOfCredits', 0] } },
      },
      {
         $addFields: { subjectname: { $arrayElemAt: ['$subject.name', 0] } },
      },
      {
         $addFields: { type: { $arrayElemAt: ['$subject.type', 0] } },
      },
      {
         $project: {
            max: 1,
            dateStart: 1,
            dateEnd: 1,
            type: 1,
            subjectname: 1,
            teachername: 1,
            subject_id: 1,
            stc: 1,
            classname: 1,
            students: 1,
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
   res.status(200).render('swapclass', {
      title: 'Log into your account',
      courses,
   });
});
exports.getHomePage = catchAsync(async (req, res) => {
   try {
      const subjects = await Subject.find();
      res.status(200).render('homepage', {
         user: req.user,
         subjects,
      });
   } catch (err) {
      res.status(200).render('homepage', {
         user: req.user,
         subjects: [],
      });
   }
});
exports.getSearchCourse = catchAsync(async (req, res) => {
   console.log(req.user);
   try {
      res.status(200).render('tracuu', {
         user: req.user,
      });
   } catch (err) {
      res.status(200).render('tracuu', {
         user: req.user,
      });
   }
});
exports.deleteCourse = catchAsync(async (req, res) => {
   console.log(req.query);
});
exports.getRegister = catchAsync(async (req, res) => {
   try {
      if (!req.user) {
         res.redirect(`/login`);
         return;
      }
      const idClass = JSON.parse(JSON.stringify(req.user));
      const data = await Course.aggregate([
         {
            $match: {
               status: 'enrolling',
               class: mongoose.Types.ObjectId(idClass.class),
               dateEndEnroll: { $gte: new Date(new Date(Date.now()).toISOString()) },
            },
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
            $addFields: { name: { $arrayElemAt: ['$subject.name', 0] } },
         },
         {
            $addFields: { type: { $arrayElemAt: ['$subject.type', 0] } },
         },
         {
            $addFields: { numberOfCredits: { $arrayElemAt: ['$subject.numberOfCredits', 0] } },
         },
         {
            $addFields: { subject_id: { $arrayElemAt: ['$subject.subject_id', 0] } },
         },
         {
            $addFields: { id: { $arrayElemAt: ['$subject._id', 0] } },
         },
         {
            $project: {
               subject_id: 1,
               id: 1,
               type: 1,
               numberOfCredits: 1,
               name: 1,
            },
         },
      ]).exec();
      const courseOpen = data.filter((value, index) => {
         const _value = JSON.stringify(value.subject_id);
         return (
            index ===
            data.findIndex((obj) => {
               return JSON.stringify(obj.subject_id) === _value;
            })
         );
      });

      const courses = await Course.aggregate([
         {
            $match: { status: 'enrolling', 'students.student': mongoose.Types.ObjectId(req.user._id) },
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
            $addFields: { teachername: { $arrayElemAt: ['$teacher.name', 0] } },
         },
         {
            $addFields: { classname: { $arrayElemAt: ['$class.name', 0] } },
         },
         {
            $addFields: { subject_code: { $arrayElemAt: ['$subject._id', 0] } },
         },
         {
            $addFields: { subject_id: { $arrayElemAt: ['$subject.subject_id', 0] } },
         },
         {
            $addFields: { stc: { $arrayElemAt: ['$subject.numberOfCredits', 0] } },
         },
         {
            $addFields: { subjectname: { $arrayElemAt: ['$subject.name', 0] } },
         },
         {
            $addFields: { type: { $arrayElemAt: ['$subject.type', 0] } },
         },
         { $match: req.query },
         {
            $project: {
               max: 1,
               dateStart: 1,
               dateEnd: 1,
               type: 1,
               subjectname: 1,
               teachername: 1,
               subject_id: 1,
               stc: 1,
               classname: 1,
               subject_code: 1,
            },
         },

         { $limit: 100 },
      ]).exec();

      const STT = courses
         .map((a) => a.stc)
         .reduce((a, b) => {
            return a + b;
         }, 0);
      const user = req.user._doc;

      console.log(data);

      res.status(200).render('mainpage', {
         user,
         STT,
         courses,
         courseOpen,
      });
   } catch (err) {
      console.log(err.message);
      res.redirect(`/login`);
   }
});
