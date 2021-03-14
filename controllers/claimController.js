const mongoose = require('mongoose');
const Contract = mongoose.model('Contract');
const Building = mongoose.model('Building');
const Tenant = mongoose.model('Tenant');
const Claim = mongoose.model('Claim');
const multer = require('multer');
const jimp = require('jimp');
const uuid = require('uuid');

exports.getClaims = async (req, res) => {
  const claims = await Claim.find();
  res.render('claims', { mainTitle: 'Иски', claims });
}

exports.addClaim = async (req, res) => {
  const contract = await Contract.findOne({ _id: req.params.id });
  res.render('addClaim', { mainTitle: 'Иски', title: 'Добавить иск', contract});
}

exports.createClaim = async (req, res) => {
  const claim = await (new Claim(req.body).save());
  req.flash('success', `Иск добавлен`);
  res.redirect(`/claims`);
}


exports.getClaimBySlug = async (req, res, next) => {
  const claim = await Claim.findOne({ slug: req.params.slug });

  if(!claim) return next();


  res.render('claim', {claim, mainTitle: claim.name, buttonTitle: 'Иск' });
}

exports.deleteClaim = async (req, res) => {
  const claim = await Claim.findOne({_id: req.params.id});
  await Claim.deleteOne({ _id: req.params.id });

  req.flash('success', `Иск удален.`);
  res.redirect(`/claims/`);
}

exports.editClaim = async (req, res) => {
  const claim = await Claim.findOne({ _id: req.params.id });
  res.render('editClaim', { mainTitle: claim.name, buttonTitle: 'Иск', title: 'Редактировать', claim});
}

exports.updateClaim = async (req, res) => {
  const claim = await Claim.findOneAndUpdate({ _id: req.params.id }, req.body, {
    new: true,
    runValidators: true
  }).exec();
  req.flash('success', `Иск отредактирован.`);
  res.redirect(`/claims/${claim._id}/edit`);
}
