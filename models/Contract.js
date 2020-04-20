const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const slug = require('slugs');
const { transliterate } = require('../helpers');

const contractSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: 'Please enter a contract name!'
  },
  slug: String,
  startDate: Date,
  finishDate: Date,
  space: Number,
  price: Number,
  roomNumber: String,
  building: {
    type: mongoose.Schema.ObjectId,
    ref: 'Building',
    required: 'You must supply a building!'
  },
  tenant: {
    type: mongoose.Schema.ObjectId,
    ref: 'Tenant',
    required: 'You must supply a tenant!'
  },
  files: [
    {
      path: String,
      name: String
    }
  ],
  claims: [
    {
      path: String,
      name: String
    }
  ]
});

// define our indexes
contractSchema.index({
  name: 'text'
});

contractSchema.pre('save', async function(next) {
  if (!this.isModified('name')) {
    next(); // skip it
    return; // stop this function from running
  }
  this.slug = slug(transliterate(this.name));

  const slugRegEx = new RegExp(`^(${this.slug})((-[0-9]*$)?)$`, 'i');
  const contractsWithSlug = await this.constructor.find({ slug: slugRegEx });
  if (contractsWithSlug.length) {
    this.slug = `${this.slug}-${contractsWithSlug.length + 1}`;
  }

  next();
});

function autopopulate(next) {
  this.populate('tenant');
  this.populate('building');
  next();
}

contractSchema.pre('find', autopopulate);
contractSchema.pre('findOne', autopopulate);

contractSchema.virtual('inspections', {
  ref: 'Inspection', // what model to link?
  localField: '_id', // which field on the store?
  foreignField: 'contract' // which field on the review?
});

module.exports = mongoose.model('Contract', contractSchema);