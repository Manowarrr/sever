const mongoose = require('mongoose');
const Tenant = mongoose.model('Tenant');

exports.getTenants = async (req, res) => {
  const tenants = await Tenant.find();
  res.render('tenants', { mainTitle: 'Арендаторы', tenants, buttonTitle: 'арендатора' });
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