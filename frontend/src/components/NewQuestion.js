import React, { useState } from 'react'
import Modal from 'react-modal'

const NewQuestion = ({ visible, closeModal, onSubmit }) => {
  // .title, .suggestedText, .currentText
  const [question, setQuestion] = useState('')

  return (
    <Modal
      isOpen={visible}
      ariaHideApp={false}
      style={{
        overlay: {
          top: '23%',
          bottom: '23%',
          left: '38%',
          right: '28%',
        },
        content: {
          backgroundColor: '#96d6e3',
        },
      }}
    >
      <div style={{ fontFamily: 'cursive' }}>
        <div className="title">New Question</div>

        <textarea
          cols="40"
          rows="8"
          className="small-input"
          type="text"
          placeholder="How many days are in a year?"
          value={question}
          onChange={event => setQuestion(event.target.value)}
        />

        <div>
          <input
            className="small-button"
            type="button"
            value="Submit"
            onClick={() => {
              onSubmit(question)
              closeModal()
            }}
          />
          <input
            className="small-button"
            type="button"
            value="Cancel"
            onClick={() => closeModal()}
          />
        </div>
      </div>
    </Modal>
  )
}

export default NewQuestion
