const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const { Subject } = require('../models');

dotenv.config({ path: './config.env' });

const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD);
mongoose.connect(DB).then(() => console.log('DB connection successful!'));

// READ JSON FILE
const subjects = JSON.parse(fs.readFileSync(`${__dirname}/subjects.json`, 'utf-8'));
subjects.forEach((subject) => (subject.required = '63387abfb39a3e79b88d04d4'));
// IMPORT DATA INTO DB
const importData = async () => {
   try {
      await Promise.all([Subject.create(subjects)]);
      console.log('Data successfully loaded!');
   } catch (err) {
      console.log(err);
   }
   process.exit();
};

// DELETE ALL DATA FROM DB
const deleteData = async () => {
   try {
      // await Tour.deleteMany();
      // await User.deleteMany();
      // await Review.deleteMany();
      console.log('Data successfully deleted!');
   } catch (err) {
      console.log(err);
   }
   process.exit();
};

if (process.argv[2] === '--import') {
   importData();
} else if (process.argv[2] === '--delete') {
   deleteData();
}
