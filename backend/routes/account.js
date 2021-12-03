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

router.post('/requestFriend', async (req, res, next) => {
  const { username, request } = req.body
  try {
    const user = await User.findOne({ username })
    if (user.requests.includes(request)) {
      next(new Error('User is asking to be your friend'))
    } else if (user.requested.includes(request)) {
      next(new Error('Already requested user'))
    } else if (user.friends.includes(request)) {
      next(new Error('Already friends with user'))
    } else {
      const user2 = await User.findOne({ username: request })
      if (user2 == null) {
        next(new Error('User not found'))
      } else {
        user.requested.unshift(request)
        user2.requests.unshift(username)
        await User.updateOne({ username }, { requested: user.requested })
        await User.updateOne(
          { username: request },
          { requests: user2.requests }
        )
        res.send(user.requested)
      }
    }
  } catch (err) {
    next(new Error('Request error'))
  }
})

router.post('/acceptRequest', async (req, res, next) => {
  const { username, request } = req.body
  try {
    const user = await User.findOne({ username })
    const user2 = await User.findOne({ username: request })
    user.requests = user.requests.filter(value => value !== request)
    user2.requested = user2.requested.filter(value => value !== username)
    user.friends.push(request)
    user2.friends.push(username)
    await User.updateOne(
      { username },
      { requests: user.requests, friends: user.friends.sort() }
    )
    await User.updateOne(
      { username: request },
      { requested: user2.requested, friends: user2.friends.sort() }
    )
    res.send({ friends: user.friends, requests: user.requests })
  } catch (err) {
    next(new Error('Accept error'))
  }
})

router.post('/declineRequest', async (req, res, next) => {
  const { username, request } = req.body
  try {
    const user = await User.findOne({ username })
    const user2 = await User.findOne({ username: request })
    user.requests = user.requests.filter(value => value !== request)
    user2.requested = user2.requested.filter(value => value !== username)
    user.friends.push(request)
    user2.friends.push(username)
    await User.updateOne({ username }, { requests: user.requests })
    await User.updateOne({ username: request }, { requested: user2.requested })
    res.send(user.requests)
  } catch (err) {
    next(new Error('Accept error'))
  }
})

router.post('/removeFriend', async (req, res, next) => {
  const { username, friend } = req.body
  try {
    const user = await User.findOne({ username })
    const user2 = await User.findOne({ username: friend })
    user.friends = user.friends.filter(value => value !== friend)
    user2.friends = user2.friends.filter(value => value !== username)
    await User.updateOne({ username }, { friends: user.friends })
    await User.updateOne({ username: friend }, { friends: user2.friends })
    res.send(user.friends)
  } catch (err) {
    next(new Error('Accept error'))
  }
})

module.exports = router
