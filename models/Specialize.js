const mongoose = require('mongoose');

const SpecializeSchema = new mongoose.Schema({
   name: {
      type: String,
      required: [true, 'Please provide name'],
      minlength: 5,
   },
});
module.exports = mongoose.model('Specialize', SpecializeSchema);
