const mongoose = require('mongoose');
const Tenant = mongoose.model('Tenant');
const Contract = mongoose.model('Contract');
const xlsxj = require("xlsx-to-json-lc");
const multer = require('multer');
const fs = require('fs')

const multerOptions = {
  storage: multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './public/uploads');
    },
    filename: function (req, file, cb) {
      let fileName = `debt.xlsx`;
      
      cb(null, fileName);
    }
  })
}

exports.getTenants = async (req, res) => {
  //const tenants = await Tenant.find();
  const tenants = await Tenant.getTenants();
  //res.json(tenants);
  res.render('tenants', { mainTitle: 'Арендаторы', tenants, buttonTitle: 'арендатора' });
}

//Debt
exports.getDebts = async (req, res) => {
  const contracts = await Contract.find({debt : {$ne: 0}});
  res.render('debts', { mainTitle: 'Долги', contracts });
}

exports.uploadDebtFile = multer(multerOptions).single('debts');

exports.countDebt = async (req, res) => {

    xlsxj({
      input: "./public/uploads/debt.xlsx", 
      output: null,
      lowerCaseHeaders:true 
    }, function(err, result) {
      if(err) {
        console.error(err);
      }else {
        fs.unlinkSync("./public/uploads/debt.xlsx");
        res.json({data: result})
      }
    });
}

exports.deleteTenant = async (req, res) => {
  const tenant = await Tenant
    .findOne({_id: req.params.id})
    .populate({
      path: 'contracts',
      populate: { path: 'tenant' }       
    });
  if(Object.keys(tenant.contracts).length === 0) {
    await Tenant.deleteOne({ _id: req.params.id });
    req.flash('success', `Арендатор удален.`);
    res.redirect(`/tenants/`);
  } else {
    req.flash('error', `У арендатора есть договоры.`);
    res.redirect(`/tenants/`);
  }
}

exports.addTenant = (req, res) => {
  res.render('editTenant', { mainTitle: 'Арендаторы', title: 'Добавить арендатора' });
}

exports.createTenant = async (req, res) => {
  const tenant = await (new Tenant(req.body).save());
  req.flash('success', `Арендатор с именем: "${tenant.name}" добавлен.`);
  res.redirect(`/tenants`);
  //res.redirect(`/tenant/${tenant.slug}`);
}

exports.editTenant = async (req, res) => {
  const tenant = await Tenant.findOne({ _id: req.params.id });
  res.render('editTenant', { mainTitle: tenant.name, buttonTitle: 'арендатора', title: 'Редактировать', tenant});
}

exports.updateTenant = async (req, res) => {
  const tenant = await Tenant.findOneAndUpdate({ _id: req.params.id }, req.body, {
    new: true,
    runValidators: true
  }).exec();
  req.flash('success', `Арендатор отредактирован.`);
  res.redirect(`/tenants/${tenant._id}/edit`);
}

exports.getTenantBySlug = async (req, res, next) => {
  const tenant = await Tenant
  .findOne({ slug: req.params.slug})
  .populate({
    path: 'contracts',
    populate: { path: 'tenant' }       
  });

  if(!tenant) return next();

  tenant.contractNumber = tenant.contracts.length;
  tenant.status = tenant.contractNumber ? 'действующий' : 'недействующий';

  res.render('tenant', {tenant, mainTitle: tenant.name, buttonTitle: 'арендатора' });
}