const express = require('express')

const isAuthenticated = require('../middlewares/isAuthenticated')
const User = require('../models/user')

const router = express.Router()

router.post('/signup', async (req, res, next) => {
  const { username, password } = req.body
  try {
    await User.create({ username, password })
    res.send('Created user')
  } catch (err) {
    next(new Error('Signup problems'))
  }
})

router.post('/login', async (req, res, next) => {
  const { username, password } = req.body
  try {
    const user = await User.findOne({ username })
    if (user) {
      if (password === user.password) {
        req.session.username = username
        req.session.password = password
        res.send('Logged in')
      } else {
        res.send('Wrong pass')
      }
    } else {
      res.send('Cant find acc with that username')
    }
  } catch (err) {
    next(new Error('Login problems'))
  }
})

router.post('/logout', isAuthenticated, (req, res, next) => {
  req.session.username = null
  req.session.password = null
  res.send('Logged out')
})

router.get('/isLoggedIn', (req, res) => {
  res.send(req.session.username)
})

module.exports = router
