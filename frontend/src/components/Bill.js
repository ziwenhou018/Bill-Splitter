/* eslint-disable no-nested-ternary */
/* eslint-disable no-alert */
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import React, { useEffect, useRef, useState } from 'react'
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

  const [tax, setTax] = useState('8')
  const [isEditingTax, setIsEditingTax] = useState(false)
  const [taxChecked, setTaxChecked] = useState(true)

  const [tip, setTip] = useState('15')
  const [isEditingTip, setIsEditingTip] = useState(false)

  const [subtotal, setSubtotal] = useState('')
  const [total, setTotal] = useState('')
  const [payments, setPayments] = useState([])
  const [itemSelected, setItemSelected] = useState(null)

  const [isLoading, setIsLoading] = useState(true)

  const updates = useRef({ host, members, items })
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

  const setTaxModified = newTax => {
    let periodCount = 0
    let valsAfterPeriod = 0
    for (let i = 0; i < newTax.length; i++) {
      const c = newTax.charAt(i)
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
    setTax(newTax)
  }

  const setTipModified = newTip => {
    let periodCount = 0
    let valsAfterPeriod = 0
    for (let i = 0; i < newTip.length; i++) {
      const c = newTip.charAt(i)
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
    setTip(newTip)
  }

  const formatPrice = price => {
    const strPrice = String(price)
    let periodCount = 0
    let valsAfterPeriod = 0
    for (let i = 0; i < strPrice.length; i++) {
      const c = strPrice.charAt(i)
      if (c === '.') {
        periodCount += 1
      } else if (periodCount > 0) {
        valsAfterPeriod += 1
      }
    }
    if (periodCount === 0) {
      return `${strPrice}.00`
    }
    if (valsAfterPeriod === 0) {
      return `${strPrice}00`
    }
    if (valsAfterPeriod === 1) {
      return `${strPrice}0`
    }
    return price
  }

  const updatePayments = () => {
    if (members && items) {
      const fTax = parseFloat(tax)
      const fTip = parseFloat(tip)
      const dup = {}
      const dup2 = Object.entries(items).reduce(
        (prev, curr) => prev + curr[1].price,
        0
      )
      const dup3 = Math.round(
        Object.entries(items).reduce(
          (prev, curr) =>
            prev +
            curr[1].price *
              (items[curr[0]].taxed ? 100 + fTax + fTip : 100 + fTip),
          0
        )
      )

      let sum = 0
      Object.entries(members).forEach(member => {
        dup[member[0]] =
          member[1].items.length > 0
            ? Math.round(
                member[1].items.reduce(
                  (prevVal, curVal) =>
                    prevVal +
                    (items[curVal].price / items[curVal].members.length) *
                      (items[curVal].taxed ? 100 + fTax + fTip : 100 + fTip),
                  0
                )
              ) / 100
            : 0
        sum += dup[member[0]] * 100
      })
      dup[host] *= 100
      dup[host] = Math.round(dup[host] + dup3 - sum)
      dup[host] /= 100
      setPayments(dup)
      setSubtotal(dup2)
      setTotal(dup3 / 100)
    }
  }

  const newItem = () => {
    if (itemText && itemPrice) {
      if (itemText in items) {
        alert('Duplicate item name')
      } else {
        const dup = JSON.parse(JSON.stringify(items))
        dup[itemText] = {
          price: parseFloat(itemPrice),
          members: [host],
          taxed: taxChecked,
        }
        const dup2 = JSON.parse(JSON.stringify(members))
        dup2[host].items.push(itemText)
        setItems(dup)
        setMembers(dup2)
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
    if (itemSelected && host === username) {
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
    delete dup[item]
    setItems(dup)
    setMembers(dup2)
  }

  const save = async () => {
    await axios.post('/api/save', {
      _id: id,
      name,
      members,
      items,
      tax: parseFloat(tax),
      tip: parseFloat(tip),
    })
    alert('Saved!')
  }

  const refresh = async () => {
    const { data } = await axios.post('/api/', { id })
    setName(data.name)
    setHost(data.host)
    setMembers(data.members)
    setItems(data.items)
    setTax(String(data.tax))
    setTip(String(data.tip))
  }

  useEffect(() => {
    checkLoggedIn()
  }, [])

  useEffect(() => {
    if (
      host &&
      members !== updates.current.members &&
      items !== updates.current.items
    ) {
      updates.current = { members, items }
      setIsLoading(false)
      updatePayments()
      if (host !== username) {
        const interval = setInterval(() => {
          refresh()
        }, 2000)
        return () => clearInterval(interval)
      }
    }
  }, [host, members, items])

  useEffect(() => {
    if (host && members && items) {
      updatePayments()
    }
  }, [tax, tip])

  useEffect(() => {
    if (username) {
      refresh()
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
              <div className="description">{`$${formatPrice(
                payments[member[0]]
              )}`}</div>
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
          {host !== username ? (
            <div className="title">{name}</div>
          ) : isEditingName ? (
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
              <input
                className="small-button"
                type="button"
                value="Save"
                onClick={() => save()}
              />
            </div>
          )}
          {host !== username ? (
            <div className="description">{`Tax: $${formatPrice(
              Math.round(subtotal * tax) / 100
            )} (${tax}%)`}</div>
          ) : isEditingTax ? (
            <div style={{ display: 'flex' }}>
              <input
                className="small-input"
                type="text"
                onChange={e => setTaxModified(e.target.value)}
                value={tax}
                placeholder="8"
              />
              <input
                className="small-button"
                type="button"
                value="Ok"
                onClick={() => setIsEditingTax(false)}
              />
            </div>
          ) : (
            <div style={{ display: 'flex' }}>
              <div className="description">{`Tax: $${formatPrice(
                Math.round(subtotal * tax) / 100
              )} (${tax}%)`}</div>
              <input
                className="small-button"
                type="button"
                value="Edit"
                onClick={() => setIsEditingTax(true)}
              />
              <input
                className="small-button"
                type="button"
                value="Save"
                onClick={() => save()}
              />
            </div>
          )}
          {host !== username ? (
            <div className="description">{`Tip: $${formatPrice(
              Math.round(subtotal * tip) / 100
            )} (${tip}%)`}</div>
          ) : isEditingTip ? (
            <div style={{ display: 'flex' }}>
              <input
                className="small-input"
                type="text"
                onChange={e => setTipModified(e.target.value)}
                value={tip}
                placeholder="8"
              />
              <input
                className="small-button"
                type="button"
                value="Ok"
                onClick={() => setIsEditingTip(false)}
              />
            </div>
          ) : (
            <div style={{ display: 'flex' }}>
              <div className="description">{`Tip: $${formatPrice(
                Math.round(subtotal * tip) / 100
              )} (${tip}%)`}</div>
              <input
                className="small-button"
                type="button"
                value="Edit"
                onClick={() => setIsEditingTip(true)}
              />
              <input
                className="small-button"
                type="button"
                value="Save"
                onClick={() => save()}
              />
            </div>
          )}
          <div className="description">{`Subtotal: $${formatPrice(
            subtotal
          )}`}</div>
          <div className="description">{`Total: $${formatPrice(total)}`}</div>
          {host === username ? (
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
              <div className="description">Taxed?</div>
              <input
                className="checkbox"
                type="checkbox"
                checked={taxChecked}
                onChange={() => setTaxChecked(!taxChecked)}
              />
              <input
                className="small-button"
                type="button"
                value="Add Item"
                onClick={() => newItem()}
              />
            </div>
          ) : null}
          {Object.entries(items).map(item => (
            <div key={item[0]} style={{ display: 'flex' }}>
              {host === username ? (
                <input
                  className="remove"
                  type="button"
                  value="remove"
                  onClick={() => removeItem(item[0])}
                />
              ) : null}
              <input
                className="selectable"
                type="button"
                value={item[0]}
                onClick={() => onClickItem(item[0])}
                style={
                  item[0] === itemSelected ? rightButtonSelected : rightButton
                }
              />
              <div className="description">{`$${formatPrice(item[1].price)} ${
                item[1].taxed ? '(taxed)' : ''
              }`}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Bill
