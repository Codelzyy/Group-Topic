const factory = require('./handlerFactory');
const Faculty = require('./../models/Faculty');

exports.createFaculty = factory.createOne(Faculty);
exports.getFaculty = factory.getOne(Faculty);
exports.getAllFaculties = factory.getAll(Faculty);
exports.updateFaculty = factory.updateOne(Faculty);
exports.deleteFaculty = factory.deleteOne(Faculty);
