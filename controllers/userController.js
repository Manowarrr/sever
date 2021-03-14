const mongoose = require('mongoose');
const User = mongoose.model('User');
const Task = mongoose.model('Task');
const promisify = require('es6-promisify');

exports.loginForm = (req, res) =>  {
  res.render('login');
}

exports.registerForm = (req, res) =>  {
  res.render('register');
}

exports.validateRegister = (req, res, next) => {
  req.sanitizeBody('name');
  req.checkBody('name', 'Введите имя').notEmpty();
  req.checkBody('email', 'Некорректный email').isEmail();
  req.sanitizeBody('email').normalizeEmail({
    remove_dots: false,
    remove_extension: false,
    gmail_remove_subaddress: false
  });
  req.checkBody('password', 'Пароль не может быть пустым').notEmpty();
  const errors = req.validationErrors();
  if(errors) {
    req.flash('error', errors.map(err => err.msg));
    res.render('register', {body: req.body, flashes: req.flash()});
    return
  }
  next();
};

exports.register = async (req, res, next) => {
  const user = new User({ email: req.body.email, name: req.body.name});
  const register = promisify(User.register, User);
  await register(user, req.body.password);
  next();
};

exports.account = (req, res) => {
  res.render('account', { mainTitle: 'Редактирование профиля' });
}

exports.getTasks = async (req, res) => {
  const userData = await User.findOne({_id: req.params.id }).populate({
    path: 'tasks',
    populate: { path: 'user' }       
  });
  console.log(userData);
  res.render('tasks', { mainTitle: 'Задачи', userData });
}

exports.addTask = async (req, res) => {
  console.log('task');
  const task = await (new Task(req.body).save());
  req.flash('success', `Задача добавлена`);
  res.redirect(`/addTask/${req.params.id}`);
}

exports.deleteTask = async (req, res) => {
  const task = await Task.findOne({_id: req.params.id});
  const user = task.user._id;
  await Task.deleteOne({ _id: req.params.id });
  req.flash('success', `Задача удалена`);
  res.redirect(`/addTask/${user}`);
}

exports.changePassword = (req, res) => {
  res.render('changepassword');
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
  const users = await User.find({name: {$ne:'admin'}});
  res.render('users', { users });
}