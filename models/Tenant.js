const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const slug = require('slugs');
const { transliterate } = require('../helpers');

const tenantSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: 'Введите имя'
  },
  slug: String,
  address: {
    type: String,
    required: 'Введите адрес'
  },
  inn: Number,
  phone: Number,
  email: String,
  account: Number,
  person: [
    {
      name: String,
      position: String
    }
  ]
});

// define our indexes
tenantSchema.index({
  name: 'text'
});

tenantSchema.pre('save', async function(next) {
  if (!this.isModified('name')) {
    next(); // skip it
    return; // stop this function from running
  }
  this.slug = slug(transliterate(this.name));

  const slugRegEx = new RegExp(`^(${this.slug})((-[0-9]*$)?)$`, 'i');
  const tenantsWithSlug = await this.constructor.find({ slug: slugRegEx });
  if (tenantsWithSlug.length) {
    this.slug = `${this.slug}-${tenantsWithSlug.length + 1}`;
  }

  next();
});

tenantSchema.virtual('contracts', {
  ref: 'Contract', // what model to link?
  localField: '_id', // which field on the store?
  foreignField: 'tenant' // which field on the review?
});

module.exports = mongoose.model('Tenant', tenantSchema);