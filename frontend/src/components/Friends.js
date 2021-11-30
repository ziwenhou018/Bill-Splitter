import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import NewQuestion from './NewQuestion'

const Friends = () => {
  const [username, setUsername] = useState(null)
  const [bills, setBills] = useState([])
  const [friends, setFriends] = useState([])
  const [requests, setRequests] = useState([])
  const [requested, setRequested] = useState([])
  const [search, setSearch] = useState([])

  const navigation = useNavigate()

  const logout = async () => {
    axios.post('/account/logout').then(() => {
      navigation('/login')
    })
  }

  const checkLoggedIn = async () => {
    const { data } = await axios.get('/account/isLoggedIn')
    setUsername(data)
  }

  const addFriend = () => {
    axios.post('/api/new', { host: username, group: ['test'] }).then(res => {
      console.log(res)
      // navigation(`/bill/${res._id}`)
    })
  }

  const refresh = async () => {
    const { data } = await axios.get('/account/')
    setBills(data.bills)
    setFriends(data.friends)
    setRequests(data.requests)
    setRequested(data.requested)
  }

  useEffect(() => {
    checkLoggedIn()
  }, [])

  useEffect(() => {
    if (username) {
      refresh()
      const interval = setInterval(() => {
        refresh()
      }, 2000)
      return () => clearInterval(interval)
    }
  }, [username])

  // useEffect(() => {
  //   questions.forEach(question => {
  //     if (currQuestion._id === question._id) {
  //       setCurrQuestion(question)
  //     }
  //   })
  // }, [questions])

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
              type="text"
              onChange={e => setSearch(e.target.value)}
              value={search}
              placeholder="Search friends..."
            />
            <input
              className="small-button"
              type="button"
              value="Add Friend"
              onClick={addFriend}
            />
          </div>
          {friends.map(friend => (
            <div key={friend}>{friend}</div>
          ))}
          {/* {questions.map(question => (
            <div key={question._id}>
              <input
                type="button"
                value={question.questionText}
                onClick={() => onQuestionClick(question)}
                style={{
                  width: '97%',
                  height: '30px',
                  margin: '3px',
                  fontFamily: 'Arial',
                  fontSize: '19px',
                }}
              />
            </div>
          ))} */}
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
          {/* {currQuestion._id ? (
            <div>
              <div
                style={{
                  backgroundColor: 'white',
                  padding: '5px',
                  borderWidth: '1px',
                  borderStyle: 'solid',
                  borderColor: 'gray',
                  width: '99%',
                }}
              >
                <div style={{ fontSize: '24px', margin: '3px' }}>
                  {currQuestion.questionText}
                </div>
                <div style={{ fontWeight: 'bold', margin: '3px' }}>Author:</div>
                <div style={{ margin: '3px' }}>{currQuestion.author}</div>
                <div style={{ fontWeight: 'bold', margin: '3px' }}>Answer:</div>
                <div style={{ margin: '3px' }}>{currQuestion.answer}</div>
              </div>
              {username ? (
                <div>
                  <div>Answer this question:</div>
                  <div>
                    <textarea
                      cols="112"
                      rows="8"
                      className="small-input"
                      type="text"
                      value={answer}
                      onChange={event => setAnswer(event.target.value)}
                    />
                  </div>
                  <div>
                    <input
                      className="small-button"
                      type="button"
                      value="Submit"
                      onClick={submitAnswer}
                    />
                  </div>
                </div>
              ) : null}
            </div>
          ) : null} */}
        </div>
      </div>
    </div>
  )
}

export default Friends
