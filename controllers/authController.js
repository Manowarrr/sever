const passport = require('passport');
const mongoose = require('mongoose');
const User = require('../models/User');
const crypto = require('crypto');
const promisify = require('es6-promisify');

exports.login = passport.authenticate('local', {
  failureRedirect: '/login',
  failureFlash: 'Ошибка',
  successRedirect: '/buildings',
  successFlash: 'Вы авторизированы в приложении'
});

exports.isLoggedIn = (req, res, next) =>  {
  if(req.isAuthenticated()) {
    next();
    return;
  }
  req.flash('error', 'Вы должны авторизоваться');
  res.redirect('/login');
 };

 exports.logout = (req, res) => {
  req.logout();
  res.redirect('/');
}

 exports.changePassword = async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  if(!user) {
    req.flash('error', 'Пользователь с таким адресом не зарегистрирован.');
    return res.redirect('/login');
  }
  user.resetPasswordToken = crypto.randomBytes(20).toString('hex');
  user.resetExpires = Date.now() + 3600000;
  await user.save();
  req.flash('success', 'На указанный адрес была направлена ссылка для изменения пароля.');
  res.redirect('/login');
}

exports.reset = async (req, res) =>  {
  const user = await User.findOne({ 
    resetPasswordToken: req.params.token,
    resetExpires: { $gt: Date.now() } 
  });
  if(!user) {
    req.flash('error', 'Ошибка');
    return res.redirect('/login');
  }
  res.render('render');
}

exports.confirmedPasswords = (req, res, next) => {
  if(req.body.password === req.body['password-confirm']) {
    next();
    return;
  }
  req.flash('error', 'Пароли не совпадают');
  res.redirect('back');
}

exports.update  =  async (req, res)  =>  {
  const user = await User.findOne({ name: req.body.name });
  if(!user) {
    req.flash('error', 'Ошибка');
    return res.redirect('/login');
  }
  const setPassword = promisify(user.setPassword, user);
  await setPassword(req.body.password);
  const updatedUser = await user.save();
  //await req.login(updatedUser);
  req.logout();
  req.flash('success', 'Пароль  был изменен');
  res.redirect('/');
}