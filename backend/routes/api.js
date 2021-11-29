const express = require('express')

const isAuthenticated = require('../middlewares/isAuthenticated')
const Question = require('../models/question')

const router = express.Router()

router.get('/', async (req, res, next) => {
  try {
    const questions = await Question.find()
    res.send(questions)
  } catch (err) {
    next(new Error('Fetch problems'))
  }
})

router.post('/add', isAuthenticated, async (req, res, next) => {
  const { questionText } = req.body
  try {
    await Question.create({
      questionText,
      answer: '',
      author: req.session.username,
    })
    res.send('Added new q')
  } catch (err) {
    next(new Error('Add problems'))
  }
})

router.post('/answer', isAuthenticated, async (req, res, next) => {
  const { _id, answer } = req.body
  try {
    await Question.updateOne({ _id }, { answer })
    res.send('Answered q')
  } catch (err) {
    next(new Error('Answer problems'))
  }
})

module.exports = router
