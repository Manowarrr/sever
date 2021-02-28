const mongoose = require('mongoose');
const Building = mongoose.model('Building');
const Tenant = mongoose.model('Tenant');
const Contract = mongoose.model('Contract');
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

exports.deleteBuildingFile = async (req, res) => {
  const building = await Building.findOneAndUpdate({ _id: req.params.id }, { $pull: { files: { path: req.params.path} } });
  await unlinkAsync('./public/uploads/' + req.params.path);
  req.flash('success', `Файл успешно удален`);
  res.redirect(`/buildings/${building.slug}`);
}

exports.addBuilding = (req, res) => {
  res.render('editBuilding', { mainTitle: 'Объекты', title: 'Добавить объект'});
}

exports.uploadMainPhoto = multer(multerOptions).single('mainphoto');
exports.uploadGallery = multer(multerOptions).array('gallery');
exports.uploadFiles = multer(multerOptions).single('files');

exports.createBuilding = async (req, res) => {
  req.body.mainphoto = req.file.filename;
  const building = await (new Building(req.body).save());
  req.flash('success', `Объект по адресу: "${building.name}" добавлен.`);
  res.redirect(`/buildings/${building.slug}`);
}

// Удалить
exports.getBuildings = async (req, res) => {
  const buildings = await Building.find();
  res.render('map', { mainTitle: 'Карта', buildings });
}
exports.generate = async (req, res) => {
  res.render('test');
}

exports.getBuildingsJson = async (req, res) => {
  const buildings = await Building.find();
  res.json(buildings);
}

exports.deleteBuilding = async (req, res) => {
  const building = await Building
    .findOne({_id: req.params.id})
    .populate({
      path: 'contracts',
      populate: { path: 'building' }       
    });
  if(Object.keys(building.contracts).length === 0) {
    await Building.deleteOne({ _id: req.params.id });
    await building.gallery.forEach(item => unlinkAsync('./public/uploads/' + item));
    await building.files.forEach(item => unlinkAsync('./public/uploads/' + item.path));
    req.flash('success', `Объект удален.`);
    res.redirect(`/buildings/`);
  } else {
    req.flash('error', `У объекта есть договоры.`);
    res.redirect(`/buildings/`);
  }
}

exports.editBuilding = async (req, res) => {
  const building = await Building.findOne({ _id: req.params.id });
  res.render('editBuilding', { mainTitle: building.name, buttonTitle: 'Объект', title: 'Редактировать', building});
}

exports.updateBuilding = async (req, res) => {
  req.body.location.type = 'Point';
  req.body.isSelled = req.body.isSelled ? true : false;
  if(req.file) req.body.mainphoto = req.file.filename;
  const building = await Building.findOneAndUpdate({ _id: req.params.id }, req.body, {
    new: true,
    runValidators: true
  }).exec();
  req.flash('success', `Объект по адресу: "${building.name}" отредактирован.`);
  res.redirect(`/buildings/${building._id}/edit`);
}

exports.updateGallery = async (req, res) => {
  const building = await Building.findOneAndUpdate({ _id: req.params.id }, { $push: { gallery: { $each: req.files.map(file => file.filename) } } }, {
    new: true,
    runValidators: true
  }).exec();
  req.flash('success', `Фотографии успешно добавлены`);
  res.redirect(`/buildings/${building.slug}`);
}

exports.updateFiles = async (req, res) => {
  const building = await Building.findOneAndUpdate({ _id: req.params.id }, { $push: { files: { path: req.file.filename, name: req.file.originalname } } }, {
    new: true,
    runValidators: true
  }).exec();
  req.flash('success', `Файлы успешно добавлены`);
  res.redirect(`/buildings/${building.slug}`);
}

exports.getBuildingBySlug = async (req, res, next) => {
  const building = await Building
    .findOne(
      { slug: req.params.slug }
    )
    .populate({
      path: 'contracts',
      populate: { path: 'building' }       
    });

  building.contractNumber = building.contracts.length;
  building.tenantNumber = building.contracts.length;
  building.freeSpace = building.contracts ? 
                       building.contracts.reduce((sum, current) => sum - current.space, building.place) : 0;
  building.occupiedSpace = building.place - building.freeSpace;
  building.occupiedPercent = building.occupiedSpace/building.place * 100;

  if(!building) return next();


  res.render('building', {building, mainTitle: building.name, buttonTitle: 'объект' });
}

// search
exports.search = async (req, res) => {
  const buildingSearch = Building.find({
    $text: {
      $search: req.query.q
    }
  });
  const tenantSearch = Tenant.find({
    $text: {
      $search: req.query.q
    }
  });
  const contractSearch = Contract.find({
    $text: {
      $search: req.query.q
    }
  });
  const [buildings, tenants, contracts] = await Promise.all([buildingSearch, tenantSearch, contractSearch]);
  buildings.forEach(building => tenants.push(building));
  contracts.forEach(contract => tenants.push(contract));
  res.json(tenants);
}

// charts
exports.showCharts = (req, res) => {
    res.render('stats', { mainTitle: 'Статистика' });
}

exports.chartDistricts = async (req, res) => {
    const result = await Building.getDistrictList();
    res.json(result);
}

exports.getBuildingsByDistrict = async (req, res) => {
  let district = req.params.district;
  let districtQuery;
  let isSelled = false;
  if(district == 'Все' || !district) {
    districtQuery = { $exists: true };
    district = 'Все';
  } else if(district ==  'Проданные') {
    districtQuery = { $exists: true };
    isSelled = true;
  } else {
    districtQuery = district;
  }

  const districtPromise = Building.getDistrictList();
  const buildingsPromise = Building.find(
      { district: districtQuery, isSelled: isSelled }
    )
    .populate({
      path: 'contracts',
      populate: { path: 'building' }       
    });
  const selledBuildingsPromise = Building.find({ isSelled: true });
  const [districts, buildings, selledBuildings] = await Promise.all([districtPromise, buildingsPromise, selledBuildingsPromise]);
  districts.push({ _id: 'Все', count: districts.reduce((sum, current) => sum + current.count, 0)});
  districts.push({ _id: 'Проданные', count: selledBuildings.length});

  buildings.forEach(function(item, i, arr) {
    item.freeSpace = item.contracts ? 
                        item.contracts.reduce((sum, current) => sum - current.space, item.place) : 0;
    item.occupiedSpace = item.place - item.freeSpace;
    item.occupiedPercent = item.occupiedSpace/item.place * 100; 
  });


  res.render('buildings', { mainTitle: 'Объекты', districts, buildings, district, buttonTitle: 'объект'});
};