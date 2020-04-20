const mongoose = require('mongoose');
const User = mongoose.model('User');
const promisify = require('es6-promisify');


exports.registerForm = (req, res) => {
  res.render('register');
}

exports.loginForm = (req, res) => {
  res.render('login');
}

exports.validateRegister = (req, res, next) => {
  req.sanitizeBody('name');
  req.checkBody('name', 'Введите имя').notEmpty();
  req.checkBody('email', 'Неверный email').isEmail();
  req.sanitizeBody('email').normalizeEmail({
    remove_dots: false,
    remove_extension: false,
    gmail_remove_subaddress: false
  });
  req.checkBody('password', 'Введите пароль').notEmpty();

  // Ошибка в пакете для валидации
  // const errors = req.validateErrors();

  // if (errors) {
  //   req.flash('error', errors.map(err => err.msg));
  //   res.render('register', { body:req.body, flashes: req.flash()});
  //   return
  // }
  next();
}

exports.register = async (req, res, next) => {
  const user = new User({ email: req.body.email, name: req.body.name });
  const register = promisify(User.register, User);
  await register(user, req.body.password);
  next();
}

exports.account = (req, res) => {
  res.render('account', { mainTitle: 'Редактирование профиля' });
}

exports.updateAccount = async (req, res) => {
  const updates = {
    name: req.body.name,
    email: req.body.email,
    phone: req.body.phone
  }

  const user = await User.findOneAndUpdate(
    { _id: req.user._id },
    { $set: updates },
    {new: true, runValidators: true, context: 'query'}
  )
  req.flash('success', 'Профиль успешно отредактирован');
  res.redirect('back');
}

exports.getUsers = async (req, res) => {
  const users = await User.find();
  res.render('users', { users });
}