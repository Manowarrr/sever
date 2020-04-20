const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const slug = require('slugs');
const { transliterate } = require('../helpers');

const inspectionSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: 'Please enter a contract name!'
  },
  slug: String,
  date: Date,
  contract: {
    type: mongoose.Schema.ObjectId,
    ref: 'Contract',
    required: 'You must supply a contract!'
  },
  gallery: [String],
  files: 
    {
      path: String,
      name: String
    }
});

// define our indexes
inspectionSchema.index({
  name: 'text'
});

inspectionSchema.pre('save', async function(next) {
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

function autopopulate(next) {
  this.populate('contract');
  next();
}

inspectionSchema.pre('find', autopopulate);
inspectionSchema.pre('findOne', autopopulate);

module.exports = mongoose.model('Inpection', inspectionSchema);