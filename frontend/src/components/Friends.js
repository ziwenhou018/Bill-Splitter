/* eslint-disable no-alert */
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  leftButton,
  leftButtonSelected,
  rightButton,
  rightButtonSelected,
} from '../styles'

const Friends = () => {
  const [username, setUsername] = useState(null)
  const [bills, setBills] = useState({})
  const [friends, setFriends] = useState([])
  const [requests, setRequests] = useState([])
  const [requested, setRequested] = useState([])
  const [search, setSearch] = useState('')
  const [clickedOn, setClickedOn] = useState([])

  const [isLoading, setIsLoading] = useState(true)

  const navigation = useNavigate()

  const logout = async () => {
    axios.post('/account/logout').then(() => {
      navigation('/login')
    })
  }

  const checkLoggedIn = async () => {
    const { data } = await axios.get('/account/isLoggedIn')
    if (data) {
      setUsername(data)
    } else {
      navigation('/login')
    }
  }

  const requestFriend = async () => {
    if (search === username) {
      alert('Cannot request self!')
    } else if (search.length > 0) {
      const { data } = await axios.post('/account/requestFriend', {
        username,
        request: search,
      })
      if (typeof data === 'string' && data.startsWith('Error')) {
        alert(data)
      } else {
        setRequested(data)
        alert('Requested!')
      }
    }
  }

  const acceptRequest = async request => {
    const { data } = await axios.post('/account/acceptRequest', {
      username,
      request,
    })
    if (typeof data === 'string' && data.startsWith('Error')) {
      alert(data)
    } else {
      setFriends(data.friends)
      setRequests(data.requests)
    }
  }

  const declineRequest = async request => {
    const { data } = await axios.post('/account/declineRequest', {
      username,
      request,
    })
    if (typeof data === 'string' && data.startsWith('Error')) {
      alert(data)
    } else {
      setRequests(data)
    }
  }

  const removeFriend = async friend => {
    const { data } = await axios.post('/account/removeFriend', {
      username,
      friend,
    })
    if (typeof data === 'string' && data.startsWith('Error')) {
      alert(data)
    } else {
      setFriends(data)
      if (clickedOn.includes(friend)) {
        setClickedOn(clickedOn.filter(user => user !== friend))
      }
    }
  }

  const newBill = async () => {
    if (clickedOn.length < 1) {
      if (friends.length > 0) {
        alert('Select at least 1 friend to create a bill')
      } else {
        alert('Add a friend first before creating a bill')
      }
    } else {
      const { data } = await axios.post('/api/new', {
        host: username,
        group: [...clickedOn, username],
      })
      if (typeof data === 'string' && data.startsWith('Error')) {
        alert(data)
      } else {
        navigation(`/bill/${data._id}`)
      }
    }
  }

  const onClickFriend = friend => {
    if (clickedOn.includes(friend)) {
      setClickedOn(clickedOn.filter(user => user !== friend))
    } else {
      setClickedOn([...clickedOn, friend])
    }
  }

  const refresh = async () => {
    const { data } = await axios.get('/account/')
    setBills(data.bills)
    setFriends(data.friends)
    setRequests(data.requests)
    setRequested(data.requested)
  }

  useEffect(() => {}, [bills])

  useEffect(() => {
    checkLoggedIn()
  }, [])

  useEffect(() => {
    if (username) {
      refresh()
      setIsLoading(false)
      const interval = setInterval(() => {
        refresh()
      }, 2000)
      return () => clearInterval(interval)
    }
  }, [username])

  if (isLoading) {
    return <div />
  }
  return (
    <div>
      <div style={{ display: 'flex' }}>
        <div className="title">Bill Splitter</div>
        {username ? (
          <div
            style={{
              marginLeft: 'auto',
              marginRight: 10,
              marginTop: 10,
              marginBottom: 10,
            }}
          >
            <div>{username}</div>
            <input
              className="small-button"
              type="button"
              value="Log out"
              onClick={logout}
            />
          </div>
        ) : (
          <input
            style={{
              marginLeft: 'auto',
              marginRight: 10,
              marginTop: 10,
              marginBottom: 10,
            }}
            className="small-button"
            type="button"
            value="Log in"
            onClick={() => navigation('/login')}
          />
        )}
      </div>
      <div
        style={{
          display: 'flex',
          height: '90%',
        }}
      >
        <div
          style={{
            backgroundColor: 'lightgray',
            padding: '5px',
            borderWidth: '1px',
            borderStyle: 'solid',
            borderColor: 'gray',
            width: '30%',
          }}
        >
          <div style={{ display: 'flex' }}>
            <input
              className="small-input"
              type="text"
              onChange={e => setSearch(e.target.value)}
              value={search}
              placeholder="Search people..."
            />
            <input
              className="small-button"
              type="button"
              value="Request"
              onClick={requestFriend}
            />
          </div>
          <input
            className="big-button"
            type="button"
            value="Create new bill"
            onClick={() => newBill()}
            style={{ marginBottom: '10px' }}
          />
          <div className="mini-title">Friends</div>
          {requests.map(request => (
            <div
              key={request}
              style={{ display: 'flex', marginBottom: '10px' }}
            >
              <input
                className="selectable"
                type="button"
                value={request}
                onClick={() => {}}
                style={leftButton}
              />
              <input
                className="small-button"
                type="button"
                value="accept"
                onClick={() => acceptRequest(request)}
              />
              <input
                className="small-button"
                type="button"
                value="decline"
                onClick={() => declineRequest(request)}
              />
            </div>
          ))}
          {friends.map(friend => (
            <div key={friend} style={{ display: 'flex', marginBottom: '10px' }}>
              <input
                className="remove"
                type="button"
                value="remove"
                onClick={() => {
                  removeFriend(friend)
                }}
              />
              <input
                className="selectable"
                type="button"
                value={friend}
                onClick={() => onClickFriend(friend)}
                style={
                  clickedOn.includes(friend) ? leftButtonSelected : leftButton
                }
              />
            </div>
          ))}
          <div className="mini-title">Requested</div>
          {requested.map(request => (
            <div key={request}>
              <input
                className="selectable"
                type="button"
                value={request}
                onClick={() => {}}
                style={leftButton}
              />
            </div>
          ))}
        </div>
        <div
          style={{
            backgroundColor: 'lightgray',
            padding: '5px',
            borderWidth: '1px',
            borderStyle: 'solid',
            borderColor: 'gray',
            width: '70%',
          }}
        >
          <div className="title">Past Transactions</div>
          {Object.entries(bills).map(bill => (
            <div key={bill[0]} style={{ marginBottom: '10px' }}>
              <input
                className="selectable"
                type="button"
                value={bill[1].name}
                onClick={() => navigation(`/bill/${bill[0]}`)}
                style={rightButton}
              />
              <div>
                {`{${bill[1].members.reduce(
                  (prev, curr) => `${prev} - ${curr}`,
                  ''
                )} - }`}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Friends
