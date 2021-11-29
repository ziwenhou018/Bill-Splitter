const express = require('express')
const mongoose = require('mongoose')
const session = require('cookie-session')
const path = require('path')

const AccountRouter = require('./routes/account')
const ApiRouter = require('./routes/api')

const app = express()

const MONGO_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/test'

mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})

app.use(express.static('dist'))

app.use(express.json())

app.use(
  session({
    name: 'account',
    keys: ['key1'], // what does this do?
  }),
)

app.get('/', (req, res) => {
  if (req.session.username && req.session.password) {
    res.send(`Hello ${req.session.username}!`)
  } else {
    res.send('Please log in')
  }
})

app.use('/account', AccountRouter)
app.use('/api/questions', ApiRouter)

app.use((err, req, res, next) => {
  res.status(500).send('There was an error!')
})

// set favicon
app.get('/favicon.ico', (req, res) => {
  res.status(404).send()
})

// set the initial entry point
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist/index.html'))
})

app.listen(3000, () => {
  // console.log('listening on port 3000')
})
