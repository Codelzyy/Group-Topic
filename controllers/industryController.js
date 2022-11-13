const factory = require('./handlerFactory');
const { Industry } = require('./../models');

exports.createIndustry = factory.createOne(Industry);
exports.getIndustry = factory.getOne(Industry);
exports.getAllIndustries = factory.getAll(Industry);
exports.updateIndustry = factory.updateOne(Industry);
exports.deleteIndustry = factory.deleteOne(Industry);
