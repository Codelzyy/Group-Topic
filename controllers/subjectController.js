const factory = require('./handlerFactory');
const Subject = require('./../models/Subject');

exports.createSubject = factory.createOne(Subject);
exports.getSubject = factory.getOne(Subject);
exports.getAllSubjects = factory.getAll(Subject);
exports.updateSubject = factory.updateOne(Subject);
exports.deleteSubject = factory.deleteOne(Subject);
