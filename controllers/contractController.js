const mongoose = require('mongoose');
const Contract = mongoose.model('Contract');
const Building = mongoose.model('Building');
const Tenant = mongoose.model('Tenant');
const multer = require('multer');
const jimp = require('jimp');
const uuid = require('uuid');

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

exports.uploadFiles = multer(multerOptions).single('files');
exports.uploadClaims = multer(multerOptions).single('claims');

exports.updateFiles = async (req, res) => {
  const contract = await Contract.findOneAndUpdate({ _id: req.params.id }, { $push: { files: { path: req.file.filename, name: req.file.originalname } } }, {
    new: true,
    runValidators: true
  }).exec();
  req.flash('success', `Файлы успешно добавлены`);
  res.redirect(`/contracts/${contract.slug}`);
}

exports.updateClaims = async (req, res) => {
  const contract = await Contract.findOneAndUpdate({ _id: req.params.id }, { $push: { claims: { path: req.file.filename, name: req.file.originalname } } }, {
    new: true,
    runValidators: true
  }).exec();
  req.flash('success', `Файлы успешно добавлены`);
  res.redirect(`/contracts/${contract.slug}`);
}

exports.addContract = async (req, res) => {
  const tenantsSearch = Tenant.find();
  const buildingSearch = Building.findOne({ _id: req.params.id });
  const [tenants, building] = await Promise.all([tenantsSearch, buildingSearch]);
  res.render('addContract', { mainTitle: 'Объекты', title: 'Добавить договор', tenants, building});
}

exports.createContract = async (req, res) => {
  const contract = await (new Contract(req.body).save())
  req.flash('success', `договор добавлен.`);
  res.redirect(`/buildings/${req.body.buildingSlug}`);
}

exports.chartContractDistricts = async (req, res) => {
  const result = await Building.getContractDistrictList();
  res.json(result);
}

exports.placeDistricts = async (req, res) => {
  const result = await Building.getPlaceDistrict();
  res.json(result);
}

exports.getContracts = async (req, res) => {
  const contracts = await Contract.find();
  res.render('contracts', { mainTitle: 'Договоры', contracts });
}

exports.deleteContract = async (req, res) => {
  await Contract.deleteOne({ _id: req.params.id });
  req.flash('success', `Договор удален.`);
  res.redirect(`/contracts/`);
}

exports.getContractsByDate = async (req, res) => {
  const contracts = await Contract.find(
    {startDate: {
      $gte: req.body.startDate,
      $lte: req.body.finishDate
  } }
  );
  res.render('contracts', { mainTitle: 'Договоры', contracts });
}

exports.editContract = async (req, res) => {
  const contractSearch = Contract.findOne({ _id: req.params.id });
  const tenantsSearch = Tenant.find();
  const [tenants, contract] = await Promise.all([tenantsSearch, contractSearch]);
  res.render('editContract', { mainTitle: contract.name, title: 'Редактировать', contract, tenants});
}

exports.updateContract = async (req, res) => {
  const contract = await Contract.findOneAndUpdate({ _id: req.params.id }, req.body, {
    new: true,
    runValidators: true
  }).exec();
  req.flash('success', `Договор отредактирован.`);
  res.redirect(`/contracts/${contract._id}/edit`);
}

exports.getContractBySlug = async (req, res, next) => {
  const contract = await Contract.findOne({ slug: req.params.slug}); 
  if(!contract) return next();

  contract.priceMonth = contract.space * contract.price;
  contract.priceYear = contract.priceMonth * 12;
  contract.ndsMonth = contract.priceMonth/120 * 20;
  contract.ndsYear = contract.priceYear/120 * 20;

  res.render('contract', {contract, mainTitle: contract.name });    
}