import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import React from 'react'
import Signup from './components/Signup'
import Login from './components/Login'
import Home from './components/Home'

import './styles.css'

const App = () => (
  <Router>
    <Routes>
      <Route exact path="/signup" element={<Signup />} />
      <Route exact path="/login" element={<Login />} />
      <Route exact path="/" element={<Home />} />
    </Routes>
  </Router>
)

export default App
