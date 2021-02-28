const mongoose = require('mongoose');
const Contract = mongoose.model('Contract');
const Building = mongoose.model('Building');
const Tenant = mongoose.model('Tenant');
const Inspection = mongoose.model('Inspection');
const multer = require('multer');
const jimp = require('jimp');
const uuid = require('uuid');
const fs = require('fs');
const { promisify } = require('util');

const unlinkAsync = promisify(fs.unlink);

exports.getInspections = async (req, res) => {
  res.render('inspections');
}

const multerOptions = {
  storage: multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './public/uploads');
    },
    filename: function (req, file, cb) {
      let fileName = `${uuid.v4()}.${file.mimetype.split('/')[1]}`;
      
      cb(null, fileName);
    }
  })
}

exports.getInspections = async (req, res) => {
  const inspections = await Inspection.find();
  res.render('inspections', { mainTitle: 'Осмотры', inspections });
}

exports.uploadGallery = multer(multerOptions).array('gallery');
exports.uploadFiles = multer(multerOptions).single('mainfile');

exports.addInspection = async (req, res) => {
  const contract = await Contract.findOne({ _id: req.params.id });
  res.render('addInspection', { mainTitle: 'Осмотры', title: 'Добавить осмотр', contract});
}

exports.createInspection = async (req, res) => {
  //req.body.gallery = [];
  //req.files.forEach(file => req.body.gallery.push(file.filename));
  req.body.mainfile = {};
  req.body.mainfile.path = req.file.filename;
  req.body.mainfile.name = req.file.originalname;
  const inspection = await (new Inspection(req.body).save());
  req.flash('success', `Осмотр добавлен`);
  res.redirect(`/inspections`);
}


exports.getInspectionBySlug = async (req, res, next) => {
  const inspection = await Inspection.findOne({ slug: req.params.slug });

  if(!inspection) return next();


  res.render('inspection', {inspection, mainTitle: inspection.name, buttonTitle: 'Осмотр' });
}

exports.deleteInspection = async (req, res) => {
  const inspection = await Inspection.findOne({_id: req.params.id});
  await Inspection.deleteOne({ _id: req.params.id });
  if(inspection.gallery) {
    await inspection.gallery.forEach(item => unlinkAsync('./public/uploads/' + item));
  }
  await unlinkAsync('./public/uploads/' + inspection.mainfile.path);
  req.flash('success', `осмотр удален.`);
  res.redirect(`/inspections/`);
}

exports.editInspection = async (req, res) => {
  const inspection = await Inspection.findOne({ _id: req.params.id });
  res.render('editInspection', { mainTitle: inspection.name, buttonTitle: 'Осмотр', title: 'Редактировать', inspection});
}

exports.updateInspection = async (req, res) => {
  const inspection = await Inspection.findOneAndUpdate({ _id: req.params.id }, { $push: { gallery: { $each: req.files.map(file => file.filename) } } }, {
    new: true,
    runValidators: true
  }).exec();
  req.flash('success', `Осмотр отредактирован.`);
  res.redirect(`/inspections/${inspection._id}/edit`);
}

exports.getInspectionBySlug = async (req, res, next) => {
  const inspection = await Inspection.findOne({ slug: req.params.slug });

  if(!inspection) return next();


  res.render('inspection', {inspection, mainTitle: inspection.name, buttonTitle: 'Осмотр' });
}