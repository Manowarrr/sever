const mongoose = require('mongoose');
const Contract = mongoose.model('Contract');
const Building = mongoose.model('Building');
const Tenant = mongoose.model('Tenant');
const Inspection = mongoose.model('Inpection');
const multer = require('multer');
const jimp = require('jimp');
const uuid = require('uuid');

exports.getInspections = async (req, res) => {
  //const tenants = await Tenant.find();
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
exports.uploadFiles = multer(multerOptions).single('files');

exports.addInspection = async (req, res) => {
  const contract = await Contract.findOne({ _id: req.params.id });
  res.render('addInspection', { mainTitle: 'Осмотры', title: 'Добавить осмотр', contract});
}

exports.createInspection = async (req, res) => {
  req.body.gallery = [];
  req.files.forEach(file => req.body.gallery.push(file.filename));
  const inspection = await (new Inspection(req.body).save());
  req.flash('success', `Осмотр добавлен`);
  res.redirect(`/inspections`);
}