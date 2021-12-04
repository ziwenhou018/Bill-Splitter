const express = require('express')
const { ObjectId } = require('mongodb')

const isAuthenticated = require('../middlewares/isAuthenticated')
const Bill = require('../models/bill')

const router = express.Router()

router.post('/', async (req, res, next) => {
  const { id } = req.body
  try {
    const bill = await Bill.find({ _id: ObjectId(id) })
    res.send(bill[0])
  } catch (err) {
    next(new Error('Fetch problems'))
  }
})

router.post('/new', async (req, res, next) => {
  const { host, group } = req.body
  const members = {}
  const items = {}
  const name = 'New Bill'
  group.forEach(member => {
    members[member] = { items: [] }
  })
  try {
    const data = await Bill.create({
      name,
      host,
      members,
      items,
    })
    res.send(data)
  } catch (err) {
    next(new Error('New bill error'))
  }
})

// router.post('/add', isAuthenticated, async (req, res, next) => {
//   const { questionText } = req.body
//   try {
//     await Question.create({
//       questionText,
//       answer: '',
//       author: req.session.username,
//     })
//     res.send('Added new q')
//   } catch (err) {
//     next(new Error('Add problems'))
//   }
// })

// router.post('/answer', isAuthenticated, async (req, res, next) => {
//   const { _id, answer } = req.body
//   try {
//     await Question.updateOne({ _id }, { answer })
//     res.send('Answered q')
//   } catch (err) {
//     next(new Error('Answer problems'))
//   }
// })

module.exports = router
