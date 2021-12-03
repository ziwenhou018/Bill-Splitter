import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import React, { useEffect, useState } from 'react'

const Bill = () => {
  const [username, setUsername] = useState(null)
  const [host, setHost] = useState(null)
  const [members, setMembers] = useState(null)
  const [items, setItems] = useState(null)

  const [itemText, setItemText] = useState('')
  const [itemPrice, setItemPrice] = useState('')

  const [itemSelected, setItemSelected] = useState(null)

  const [isLoading, setIsLoading] = useState(true)

  const { id } = useParams()
  const navigation = useNavigate()

  const newItem = () => {
    if (itemText in items) {
      alert('Duplicate item name')
    } else {
      const dup = JSON.parse(JSON.stringify(items))
      dup[itemText] = {
        price: parseFloat(itemPrice),
        members: [host],
        taxed: true,
      }
      setItems(dup)
    }
  }

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
    const { data } = await axios.post('/api/', { id })
    console.log(data)
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
      console.log(items)
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
            <div key={member[0]}>
              <input
                type="button"
                value={member[0]}
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
          <div style={{ display: 'flex' }}>
            <input
              type="text"
              onChange={e => setItemText(e.target.value)}
              value={itemText}
              placeholder="Fried rice"
            />
            <input
              type="text"
              onChange={e => setItemPrice(e.target.value)}
              value={itemPrice}
              placeholder="4.99"
            />
            <input
              className="small-button"
              type="button"
              value="Add Item"
              onClick={() => newItem()}
            />
          </div>
          {Object.entries(items).map(item => (
            <div key={item[0]} style={{ display: 'flex' }}>
              <input
                type="button"
                value={item[0]}
                onClick={() => {}}
                style={{
                  width: '50%',
                  height: '30px',
                  margin: '3px',
                  fontFamily: 'Arial',
                  fontSize: '19px',
                }}
              />
              <div>{`$${item[1].price}`}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Bill
