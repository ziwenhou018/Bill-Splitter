import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import React, { useEffect, useState } from 'react'

const Bill = () => {
  const [username, setUsername] = useState(null)
  const [host, setHost] = useState(null)
  const [members, setMembers] = useState(null)
  const [items, setItems] = useState(null)

  const [isLoading, setIsLoading] = useState(true)

  const { id } = useParams
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

  const refresh = async () => {
    const { data } = await axios.get('/api/')
    setHost(data.host)
    setMembers(data.members)
    setItems(data.items)
  }

  useEffect(() => {
    checkLoggedIn()
  }, [])

  useEffect(() => {
    if (host && members && items) {
      setIsLoading(false)
    }
  }, [host, members, items])

  useEffect(() => {
    if (username) {
      refresh()
      // const interval = setInterval(() => {
      //   refresh()
      // }, 2000)
      // return () => clearInterval(interval)
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
          {Object.entries(members).map(member => (
            <div key={member.name}>
              <input
                type="button"
                value={member.name}
                onClick={() => {}}
                style={{
                  width: '97%',
                  height: '30px',
                  margin: '3px',
                  fontFamily: 'Arial',
                  fontSize: '19px',
                }}
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

export default Bill
