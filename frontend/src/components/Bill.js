import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import React, { useEffect, useState } from 'react'

const Bill = () => {
  const [name, setName] = useState('New Bill')
  const [username, setUsername] = useState(null)
  const [host, setHost] = useState(null)
  const [members, setMembers] = useState(null)
  const [items, setItems] = useState(null)

  const [isEditingName, setIsEditingName] = useState(false)
  const [itemText, setItemText] = useState('')
  const [itemPrice, setItemPrice] = useState('')

  const [total, setTotal] = useState(0)
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
      const dup2 = JSON.parse(JSON.stringify(members))
      dup2[host].items.push(itemText)
      setItems(dup)
      setMembers(dup2)
      setTotal(total + parseFloat(itemPrice))
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

  const onClickItem = item => {
    if (itemSelected === item) {
      setItemSelected(null)
    } else {
      setItemSelected(item)
    }
  }

  const onClickFriend = friend => {
    if (itemSelected) {
      if (items[itemSelected].members.includes(friend)) {
        const dup = JSON.parse(JSON.stringify(items))
        dup[itemSelected].members = dup[itemSelected].members.filter(
          user => user !== friend
        )
        const dup2 = JSON.parse(JSON.stringify(members))
        dup2[friend].items = dup2[friend].items.filter(
          item => item !== itemSelected
        )
        setItems(dup)
        setMembers(dup2)
      } else {
        const dup = JSON.parse(JSON.stringify(items))
        dup[itemSelected].members.push(friend)
        const dup2 = JSON.parse(JSON.stringify(members))
        dup2[friend].items.push(itemSelected)
        setItems(dup)
        setMembers(dup2)
      }
    }
  }

  const refresh = async () => {
    const { data } = await axios.post('/api/', { id })
    console.log(data)
    setName(data.name)
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
                onClick={() => onClickFriend(member[0])}
                style={
                  members[member[0]].items.includes(itemSelected)
                    ? {
                        width: '80%',
                        height: '30px',
                        margin: '3px',
                        fontFamily: 'Arial',
                        fontSize: '19px',
                        backgroundColor: 'lightgreen',
                      }
                    : {
                        width: '80%',
                        height: '30px',
                        margin: '3px',
                        fontFamily: 'Arial',
                        fontSize: '19px',
                      }
                }
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
          {isEditingName ? (
            <div style={{ display: 'flex' }}>
              <input
                type="text"
                onChange={e => setName(e.target.value)}
                value={name}
                placeholder="New Bill"
              />
              <input
                className="small-button"
                type="button"
                value="Ok"
                onClick={() => setIsEditingName(false)}
              />
            </div>
          ) : (
            <div style={{ display: 'flex' }}>
              <div className="title">{name}</div>
              <input
                className="small-button"
                type="button"
                value="Edit"
                onClick={() => setIsEditingName(true)}
              />
            </div>
          )}
          <div>{`Total: $${total}`}</div>
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
                value="remove"
                onClick={() => {}}
                style={{
                  width: '17%',
                  height: '30px',
                  margin: '3px',
                  fontFamily: 'Arial',
                  fontSize: '19px',
                }}
              />
              <input
                type="button"
                value={item[0]}
                onClick={() => onClickItem(item[0])}
                style={
                  item[0] === itemSelected
                    ? {
                        width: '50%',
                        height: '30px',
                        margin: '3px',
                        fontFamily: 'Arial',
                        fontSize: '19px',
                        backgroundColor: 'lightgreen',
                      }
                    : {
                        width: '50%',
                        height: '30px',
                        margin: '3px',
                        fontFamily: 'Arial',
                        fontSize: '19px',
                      }
                }
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
