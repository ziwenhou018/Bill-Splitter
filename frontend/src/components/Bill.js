/* eslint-disable no-alert */
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import {
  leftButton,
  leftButtonSelected,
  rightButton,
  rightButtonSelected,
} from '../styles'

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
  const [payments, setPayments] = useState([])
  const [itemSelected, setItemSelected] = useState(null)

  const [isLoading, setIsLoading] = useState(true)

  const { id } = useParams()
  const navigation = useNavigate()

  const setItemPriceModified = price => {
    let periodCount = 0
    let valsAfterPeriod = 0
    for (let i = 0; i < price.length; i++) {
      const c = price.charAt(i)

      if (c === '.') {
        if (i === 0) return
        periodCount += 1
        if (periodCount > 1) return
      } else if (!(c >= '0' && c <= '9')) return
      else if (periodCount > 0) {
        valsAfterPeriod += 1
        if (valsAfterPeriod > 2) return
      }
    }
    setItemPrice(price)
  }

  const getItemPrice = () => parseFloat(itemPrice)

  const setPaymentsModified = () => {
    const dup = JSON.parse(JSON.stringify(payments))
    let sum = 0
    Object.entries(members).forEach(member => {
      dup[member[0]] =
        member[1].items.length > 0
          ? member[1].items.reduce(
              (prevVal, curVal) =>
                prevVal +
                Math.round(
                  (items[curVal].price / items[curVal].members.length) * 100
                ) /
                  100,
              0
            )
          : 0
      sum += dup[member[0]]
    })
    dup[host] += total - sum
    setPayments(dup)
  }

  const newItem = () => {
    if (itemText && itemPrice) {
      if (itemText in items) {
        alert('Duplicate item name')
      } else {
        const dup = JSON.parse(JSON.stringify(items))
        dup[itemText] = {
          price: getItemPrice(),
          members: [host],
          taxed: true,
        }
        const dup2 = JSON.parse(JSON.stringify(members))
        dup2[host].items.push(itemText)
        setItems(dup)
        setMembers(dup2)
        setTotal(total + getItemPrice())
      }
    } else {
      alert('Please fill out the name and price of the item')
    }
  }

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

  const removeItem = item => {
    const dup = JSON.parse(JSON.stringify(items))
    const dup2 = JSON.parse(JSON.stringify(members))
    dup[item].members.forEach(member => {
      dup2[member].items = dup2[member].items.filter(it => it !== item)
    })
    setTotal(total - dup[item].price)
    delete dup[item]
    setItems(dup)
    setMembers(dup2)
  }

  const refresh = async () => {
    const { data } = await axios.post('/api/', { id })
    setName(data.name)
    setHost(data.host)
    setMembers(data.members)
    setItems(data.items)
    const names = {}
    Object.entries(data.members).forEach(member => {
      names[member[0]] = 0
    })
    setPayments(names)
  }

  useEffect(() => {
    checkLoggedIn()
  }, [])

  useEffect(() => {
    if (host && members && items) {
      setIsLoading(false)
      setPaymentsModified()
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
        <div>
          <div className="title">Bill Splitter</div>
          <input
            className="small-button"
            type="button"
            value="Back"
            onClick={() => navigation('/')}
          />
        </div>

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
            <div key={member[0]} style={{ display: 'flex' }}>
              <input
                className="selectable"
                type="button"
                value={member[0]}
                onClick={() => onClickFriend(member[0])}
                style={
                  members[member[0]].items.includes(itemSelected)
                    ? leftButtonSelected
                    : leftButton
                }
              />
              <div>{`$${payments[member[0]]}`}</div>
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
                className="small-input"
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
              className="small-input"
              type="text"
              onChange={e => setItemText(e.target.value)}
              value={itemText}
              placeholder="Fried rice"
            />
            <input
              className="small-input"
              type="text"
              onChange={e => setItemPriceModified(e.target.value)}
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
                className="remove"
                type="button"
                value="remove"
                onClick={() => removeItem(item[0])}
              />
              <input
                className="selectable"
                type="button"
                value={item[0]}
                onClick={() => onClickItem(item[0])}
                style={
                  item[0] === itemSelected ? rightButtonSelected : rightButton
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
