/* eslint-disable no-alert */
import React, { useState } from 'react'
import axios from 'axios'
import { Link, useNavigate } from 'react-router-dom'

const Login = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const navigation = useNavigate()

  const onClickLoginButton = async () => {
    if (username && password) {
      const { data } = await axios.post('/account/login', {
        username,
        password,
      })
      if (typeof data === 'string' && data.startsWith('Error')) {
        alert(data)
      } else {
        navigation('/', data)
      }
    } else {
      alert('Username and password must not be empty!')
    }
  }

  return (
    <div>
      <div className="title">Login</div>
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
          value="Log In"
          onClick={onClickLoginButton}
        />
      </div>

      <Link to="/signup">Don&apos;t have an account? Sign Up</Link>
    </div>
  )
}

export default Login
