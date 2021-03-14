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
exports.uploadDs = multer(multerOptions).single('ds');
exports.uploadActs = multer(multerOptions).single('acts');

exports.deleteContractFile = async (req, res) => {
  const contract = await Contract.findOneAndUpdate({ _id: req.params.id }, { $pull: { files: { path: req.params.path} } });
  await unlinkAsync('./public/uploads/' + req.params.path);
  req.flash('success', `Файл успешно удален`);
  res.redirect(`/contracts/${contract.slug}`);
}

exports.deleteContractDs = async (req, res) => {
  const contract = await Contract.findOneAndUpdate({ _id: req.params.id }, { $pull: { ds: { path: req.params.path} } });
  await unlinkAsync('./public/uploads/' + req.params.path);
  req.flash('success', `Файл успешно удален`);
  res.redirect(`/contracts/${contract.slug}`);
}

exports.deleteContractAct = async (req, res) => {
  const contract = await Contract.findOneAndUpdate({ _id: req.params.id }, { $pull: { acts: { path: req.params.path} } });
  await unlinkAsync('./public/uploads/' + req.params.path);
  req.flash('success', `Файл успешно удален`);
  res.redirect(`/contracts/${contract.slug}`);
}

exports.deleteContractClaim = async (req, res) => {
  const contract = await Contract.findOneAndUpdate({ _id: req.params.id }, { $pull: { claims: { path: req.params.path} } });
  await unlinkAsync('./public/uploads/' + req.params.path);
  req.flash('success', `Файл успешно удален`);
  res.redirect(`/contracts/${contract.slug}`);
}

exports.updateFiles = async (req, res) => {
  const contract = await Contract.findOneAndUpdate({ _id: req.params.id }, { $push: { files: { path: req.file.filename, name: req.file.originalname } } }, {
    new: true,
    runValidators: true
  }).exec();
  req.flash('success', `Файлы успешно добавлены`);
  res.redirect(`/contracts/${contract.slug}`);
}
exports.updateDs = async (req, res) => {
  const contract = await Contract.findOneAndUpdate({ _id: req.params.id }, { $push: { ds: { path: req.file.filename, name: req.file.originalname } } }, {
    new: true,
    runValidators: true
  }).exec();
  req.flash('success', `Файлы успешно добавлены`);
  res.redirect(`/contracts/${contract.slug}`);
}
exports.updateActs = async (req, res) => {
  const contract = await Contract.findOneAndUpdate({ _id: req.params.id }, { $push: { acts: { path: req.file.filename, name: req.file.originalname } } }, {
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
  req.body.debt = 0;
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
  const contract = await Contract.findOne({_id: req.params.id});
  const inspections = await Inspection.find({contract: req.params.id});

  await Contract.deleteOne({ _id: req.params.id });
  await contract.files.forEach(item => unlinkAsync('./public/uploads/' + item.path));
  await contract.claims.forEach(item => unlinkAsync('./public/uploads/' + item.path));
  await contract.ds.forEach(item => unlinkAsync('./public/uploads/' + item.path));
  await contract.acts.forEach(item => unlinkAsync('./public/uploads/' + item.path));

  if(inspections) {
    await Inspection.deleteMany({contract: req.params.id});
    for(let i = 0; i  < inspections.length; i++) {
      await unlinkAsync('./public/uploads/' + inspections[i].mainfile.path);
      if(inspections[i].gallery) {
        for(let  y = 0; y < inspections[i].gallery.length;  y++) {
          await unlinkAsync('./public/uploads/' + inspections[i].gallery[y])
        }
      }
    }
  }

  req.flash('success', `Договор удален.`);
  res.redirect(`/contracts/`);
}
exports.deleteBuilding = async (req, res) => {
  const building = await Building
    .findOne({_id: req.params.id})
    .populate({
      path: 'contracts',
      populate: { path: 'building' }       
    });

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

exports.getExpiredContracts = async (req, res) => {
  const contracts = await Contract.find(
    {finishDate: {
      $lte: Date.now()
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
  const contract = await Contract.findOne(
    { slug: req.params.slug}
    ) 
    .populate({
      path: 'inspections',
      populate: { path: 'contract' }       
    })
    .populate({
      path: 'cclaims',
      populate: { path: 'contract' }       
    });

  if(!contract) return next();

  contract.priceMonth = contract.space * contract.price;
  contract.priceYear = contract.priceMonth * 12;

  res.render('contract', {contract, mainTitle: contract.name });    
}