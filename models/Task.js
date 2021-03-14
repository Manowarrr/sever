const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const slug = require('slugs');
const { transliterate } = require('../helpers');

const taskSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: 'Please enter a claim name!'
  },
  slug: String,
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: 'You must supply a contract!'
  }
});

// define our indexes
taskSchema.index({
  name: 'text'
});

taskSchema.pre('save', async function(next) {
  if (!this.isModified('name')) {
    next(); // skip it
    return; // stop this function from running
  }
  this.slug = slug(transliterate(this.name));

  const slugRegEx = new RegExp(`^(${this.slug})((-[0-9]*$)?)$`, 'i');
  const inspectionsWithSlug = await this.constructor.find({ slug: slugRegEx });
  if (inspectionsWithSlug.length) {
    this.slug = `${this.slug}-${inspectionsWithSlug.length + 1}`;
  }
  next();
});


module.exports = mongoose.model('Task', taskSchema);