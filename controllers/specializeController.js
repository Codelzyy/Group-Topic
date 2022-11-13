const factory = require('./handlerFactory');
const Specialize = require('./../models/Specialize');

exports.createSpecialize = factory.createOne(Specialize);
exports.getSpecialize = factory.getOne(Specialize);
exports.getAllSpecializes = factory.getAll(Specialize);
exports.updateSpecialize = factory.updateOne(Specialize);
exports.deleteSpecialize = factory.deleteOne(Specialize);
