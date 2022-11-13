const { catchAsync } = require('../utils');
const { Subject, Course, Token } = require('../models');
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');

const ip = fs.readFileSync('/home/ec2-user/Cloud/ip.txt', { encoding: 'utf8', flag: 'r' });
console.log(ip);

exports.getLoginForm = (req, res) => {
   res.status(200).render('login', {
      title: 'Log into your account',
      ip,
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
         $addFields: { teachername: { $first: '$teacher.name' } },
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
      ip,
   });
});
exports.getHomePage = catchAsync(async (req, res) => {
   try {
      const subjects = await Subject.find();
      res.status(200).render('homepage', {
         user: req.user,
         subjects,
         ip,
      });
   } catch (err) {
      res.status(200).render('homepage', {
         user: req.user,
         ip,
         subjects: [],
      });
   }
});
exports.getSearchCourse = catchAsync(async (req, res) => {
   console.log(req.user);
   try {
      res.status(200).render('tracuu', {
         ip,
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
      const data = await Course.aggregate([
         {
            $match: {
               status: 'enrolling',
               class: mongoose.Types.ObjectId(req.user.class),
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
            $addFields: { name: { $first: '$subject.name' } },
         },
         {
            $addFields: { type: { $first: '$subject.type' } },
         },
         {
            $addFields: { numberOfCredits: { $first: '$subject.numberOfCredits' } },
         },
         {
            $addFields: { subject_id: { $first: '$subject.subject_id' } },
         },
         {
            $addFields: { id: { $first: '$subject._id' } },
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
            $addFields: { teachername: { $first: '$teacher.name' } },
         },
         {
            $addFields: { classname: { $first: '$class.name' } },
         },
         {
            $addFields: { subject_code: { $first: '$subject._id' } },
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
      res.status(200).render('mainpage', {
         user,
         ip,
         STT,
         courses,
         courseOpen,
         ip,
      });
   } catch (err) {
      console.log(err.message);
      res.redirect(`/login`);
   }
});
