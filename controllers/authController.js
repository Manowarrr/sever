const passport = require('passport');

exports.login = passport.authenticate('local', {
  failureRedirect: '/login',
  failureFlash: 'Не удалось выполнить вход.',
  successRedirect: '/buildings',
  successFlash: "Вы вошли в приложение"
})

exports.logout = (req, res) => {
  req.logout();
  res.redirect('/');
}

exports.isLoggedIn = (req, res, next) => {
  if(req.isAuthenticated()) {
    next();
    return;
  }
  req.flash('error', 'Вы должны войти в приложение, чтобы продолжить работу.')
  res.redirect('/login');
}