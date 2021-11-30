const express = require('express')

const isAuthenticated = require('../middlewares/isAuthenticated')
const User = require('../models/user')

const router = express.Router()

router.get('/', isAuthenticated, async (req, res, next) => {
  try {
    const user = await User.findOne({ username: req.session.username })
    req.session.friends = user.friends
    req.session.requests = user.requests
    req.session.requested = user.requested
    res.send({
      friends: user.friends,
      requests: user.requests,
      requested: user.requested,
    })
  } catch (err) {
    next(new Error('Cannot find account'))
  }
})

router.post('/signup', async (req, res, next) => {
  const { username, password } = req.body
  const bills = []
  const friends = []
  const requests = []
  const requested = []
  try {
    await User.create({
      username,
      password,
      bills,
      friends,
      requests,
      requested,
    })
    res.send('Created user')
  } catch (err) {
    next(new Error('Username already exists!'))
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
        req.session.bills = user.bills
        req.session.friends = user.friends
        req.session.requests = user.requests
        req.session.requested = user.requested
        // res.send({
        //   friends: user.friends,
        //   requested: user.requested,
        //   requests: user.requests,
        // })
        res.send('Logged in')
      } else {
        next(new Error('Wrong password!'))
      }
    } else {
      next(new Error('Account with the username does not exist!'))
    }
  } catch (err) {
    next(new Error('Login problems'))
  }
})

router.post('/logout', isAuthenticated, (req, res, next) => {
  req.session.username = null
  req.session.password = null
  req.session.bills = null
  req.session.friends = null
  req.session.requests = null
  req.session.requested = null
  res.send('Logged out')
})

router.get('/isLoggedIn', (req, res) => {
  res.send(req.session.username)
})

module.exports = router
