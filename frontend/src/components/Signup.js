import React, { useState } from 'react'
import axios from 'axios'
import { Link, useNavigate } from 'react-router-dom'

const Signup = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const navigation = useNavigate()

  const onClickSignUpButton = async () => {
    try {
      const data = await axios.post('/account/signup', { username, password })
      navigation('/')
    } catch (err) {
      alert('Sign up failed')
    }
  }

  return (
    <div>
      <div className="title">Sign Up</div>
      <div>
        <input
          className="small-input"
          type="text"
          onChange={e => setUsername(e.target.value)}
          value={username}
          placeholder="Username..."
        />
      </div>
      <div>
        <input
          className="small-input"
          type="text"
          onChange={e => setPassword(e.target.value)}
          value={password}
          placeholder="Password..."
        />
      </div>
      <div>
        <input
          className="button"
          type="button"
          value="Sign Up"
          onClick={onClickSignUpButton}
        />
      </div>

      <Link to="/login">Have an account? Log In</Link>
    </div>
  )
}

export default Signup
