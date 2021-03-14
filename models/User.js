const mongoose = require('mongoose');
const Schema = mongoose.Schema;
mongoose.Promise = global.Promise;
const md5 = require('md5');
const validator = require('validator');
const mongodbErrorHandler = require('mongoose-mongodb-errors');
const passportLocalMongoose = require('passport-local-mongoose');

const userSchema = new Schema({
  email: {
    type: String,
    unique: true,
    lowercase: true,
    trim: true,
    validate: [validator.isEmail, 'Неправильный email'],
    required: 'Введите email'
  },
  name: {
    type: String,
    required: 'Введите имя',
    trim: true
  },
  phone: String
});

userSchema.virtual('tasks', {
  ref: 'Task', // what model to link?
  localField: '_id', // which field on the store?
  foreignField: 'user' // which field on the review?
});

userSchema.plugin(passportLocalMongoose, {usernameField: 'email'});
userSchema.plugin(mongodbErrorHandler);

module.exports = mongoose.model('User', userSchema);