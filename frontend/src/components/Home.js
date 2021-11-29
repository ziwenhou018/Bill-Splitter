import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import NewQuestion from './NewQuestion'

const Home = () => {
  const [username, setUsername] = useState(null)
  const [questions, setQuestions] = useState([])
  const [currQuestion, setCurrQuestion] = useState({ _id: '' })
  const [answer, setAnswer] = useState('')
  const [isNewQuestion, setIsNewQuestion] = useState(false)

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

  const fetchQuestions = async () => {
    const { data } = await axios.get('/api/questions/')
    setQuestions(data)
  }

  const onQuestionClick = question => {
    if (question._id === currQuestion._id) {
      setCurrQuestion({ _id: '' })
    } else {
      setCurrQuestion(question)
    }
    setAnswer('')
  }

  const addNewQuestion = question => {
    try {
      axios.post('api/questions/add', { questionText: question }).then(() => {
        fetchQuestions()
      })
    } catch (err) {
      alert('Cannot add new question')
    }
  }

  const submitAnswer = () => {
    try {
      axios
        .post('api/questions/answer', { _id: currQuestion._id, answer })
        .then(() => {
          fetchQuestions()
        })
    } catch (err) {
      alert('Cannot answer question')
    }
  }

  useEffect(() => checkLoggedIn(), [])

  useEffect(() => {
    fetchQuestions()
    const interval = setInterval(() => {
      fetchQuestions()
    }, 2000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    questions.forEach(question => {
      if (currQuestion._id === question._id) {
        setCurrQuestion(question)
      }
    })
  }, [questions])

  return (
    <div>
      <NewQuestion
        visible={isNewQuestion}
        closeModal={() => setIsNewQuestion(false)}
        onSubmit={question => addNewQuestion(question)}
      />
      <div style={{ display: 'flex' }}>
        <div className="title">Campuswire Lite</div>
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
        ) : null}
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
          {username ? (
            <input
              className="button"
              type="button"
              onClick={() => setIsNewQuestion(true)}
              value="Ask a question!"
              style={{ width: '97%' }}
            />
          ) : (
            <input
              className="button"
              type="button"
              onClick={() => navigation('/login')}
              value="Login to submit a question"
              style={{ width: '97%' }}
            />
          )}
          {questions.map(question => (
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
          {currQuestion._id ? (
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
          ) : null}
        </div>
      </div>
    </div>
  )
}

export default Home
