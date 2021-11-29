const isAuthenticated = (req, res, next) => {
  if (req.session.username && req.session.password) {
    next()
  } else {
    next(new Error('Not logged in!'))
  }
}

module.exports = isAuthenticated
