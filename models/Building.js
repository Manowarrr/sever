const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const slug = require('slugs');
const { transliterate } = require('../helpers');

const buildingSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: 'Please enter a store name!'
  },
  slug: String,
  description: {
    type: String,
    trim: true
  },
  district: String,
  purpose: String,
  place: Number,
  price: Number,
  floors: String,
  cadastr: String,
  uk: String,
  communal: String,
  mainphoto: String,
  gallery: [String],
  files: [
    {
      path: String,
      name: String
    }
  ],
  isSelled: {
    type: Boolean,
    default: false
  },
  location: {
    type: {
      type: String,
      default: 'Point'
    },
    coordinates: [{
      type: Number,
      required: 'Введите координаты'
    }],
    address: {
      type: String,
      required: 'Введите адрес'
    }
  }
});

// define our indexes
buildingSchema.index({
  name: 'text'
});

buildingSchema.pre('save', async function(next) {
  if (!this.isModified('name')) {
    next(); // skip it
    return; // stop this function from running
  }
  this.slug = slug(transliterate(this.name));

  const slugRegEx = new RegExp(`^(${this.slug})((-[0-9]*$)?)$`, 'i');
  const buildingsWithSlug = await this.constructor.find({ slug: slugRegEx });
  if (buildingsWithSlug.length) {
    this.slug = `${this.slug}-${buildingsWithSlug.length + 1}`;
  }

  next();
});

buildingSchema.statics.getDistrictList = function() {
  return this.aggregate([
    { $match: { isSelled: false } },
    { $group: { _id: '$district', count: { $sum: 1 } } }
  ]);
}

buildingSchema.statics.getContractDistrictList = function() {
  return this.aggregate([
    { $lookup: { from: 'contracts', localField: '_id', foreignField: 'building', as: 'contracts' }},
    { $unwind: '$contracts' },
    { $group: { _id: '$district', count: { $sum: 1 } } }
  ]);
}

buildingSchema.statics.getPlaceDistrict = function() {
  return this.aggregate([
    { $facet: 
      { 'totalSpace': [ { $group: { _id: '$district', totalSpace: { $sum: '$place' } } } ],
        'occupiedSpace': [ { $lookup: { from: 'contracts', localField: '_id', foreignField: 'building', as: 'contracts' } },
                           { $unwind: '$contracts' }, 
                           { $group: { _id: '$district', occupiedSpace: { $sum: '$contracts.space' } } } ] } }
    //{ $unwind: '$contracts' }
    //{ $group: { _id: '$district', totalSpace: { $sum: '$place' } } } 
  ]);
}

// find reviews where the stores _id property === reviews store property
buildingSchema.virtual('contracts', {
  ref: 'Contract', // what model to link?
  localField: '_id', // which field on the store?
  foreignField: 'building' // which field on the review?
});

module.exports = mongoose.model('Building', buildingSchema);