import React, { useState, useRef, useEffect } from 'react'
import Linkify from 'react-linkify'
import EmojiConvertor from 'emoji-js'
import EmojiIcon from '@/components/EmojiIcon'
import SendIcon from '@/components/SendIcon'
import emojiData from '@/assets/emojiData'
import incomingMessageSound from '@/assets/notification.mp3'

const notifyAudio = new Audio(incomingMessageSound)
const emojiConvertor = new EmojiConvertor()
emojiConvertor.init_env()

export default () => {
  const [state, setState] = useState({ inputActive: false, inputHasText: false, emojiPickerIsOpen: false })
  const [messageList, setMessageList] = useState([
    { type: 'text', author: 'wallet', data: { text: 'Welcome to Fake Wallet!' } },
  ])
  const messageRef = useRef(null)
  const inputRef = useRef(null)

  const sendMessage = (msg) => setMessageList([...messageList, msg])
  const handleKeyDown = (e) => {
    if ((e.key === 'Enter' && !e.shiftKey) || e.type === 'click') {
      e.preventDefault()
      const text = inputRef.current.textContent
      if (text && text.length > 0) {
        sendMessage({ author: 'me', type: 'text', data: { text } })
        inputRef.current.innerHTML = ''
      }
    }
  }
  const handleMessage = (msg) => {
    console.log(msg)
    sendMessage({ type: 'text', author: 'wallet', data: { text: 'response...' } })
    notifyAudio.play()
  }
  const handleEmoji = (emoji) => {
    setState({ ...state, emojiPickerIsOpen: false })
    if (state.inputHasText) inputRef.current.innerHTML += emoji
    else sendMessage({ author: 'me', type: 'emoji', data: { emoji } })
  }

  useEffect(() => {
    const last = messageList.slice(-1)[0]
    if (last.author === 'me') handleMessage(last)
  }, [messageList])

  useEffect(() => {
    messageRef.current.scrollTop = messageRef.current.scrollHeight
  }, [messageRef.current?.scrollHeight])

  return (
    <div className="app">
      <div className="sc-chat-window">
        <div
          style={{
            background: '#4e8cff',
            minHeight: '50px',
            borderTopLeftRadius: '9px',
            borderTopRightRadius: '9px',
            color: 'white',
            padding: '10px',
            boxShadow: '0 1px 4px rgba(0, 0, 0, 0.2)',
            position: 'relative',
            boxSizing: 'border-box',
            display: 'flex',
          }}
        >
          <div style={{ alignSelf: 'center', padding: '10px', flex: 1 }}>Fake Wallet</div>
        </div>
        <div className="sc-message-list" ref={messageRef}>
          {messageList.map((message, i) => (
            <div className="sc-message" key={'message' + i}>
              <div className={`sc-message--content ${message.author === 'me' ? 'sent' : 'received'}`}>
                {message.type === 'text' && (
                  <div className="sc-message--text">
                    {<Linkify properties={{ target: '_blank' }}>{message.data.text}</Linkify>}
                  </div>
                )}
                {message.type === 'emoji' && <div className="sc-message--emoji">{message.data.emoji}</div>}
              </div>
            </div>
          ))}
        </div>

        <form className={`sc-user-input ${state.inputActive ? 'active' : ''}`}>
          <div
            role="button"
            tabIndex="0"
            onFocus={() => setState({ ...state, inputActive: true })}
            onBlur={() => setState({ ...state, inputActive: false })}
            ref={inputRef}
            onKeyDown={handleKeyDown}
            onKeyUp={(e) =>
              setState({ ...state, inputHasText: e.target.innerHTML.length !== 0 && e.target.innerText !== '\n' })
            }
            contentEditable="true"
            placeholder="Write a reply..."
            className="sc-user-input--text"
          ></div>
          <div className="sc-user-input--buttons">
            <div className="sc-user-input--button">
              <EmojiIcon
                onClick={(e) => {
                  e.preventDefault()
                  setState({ ...state, emojiPickerIsOpen: !state.emojiPickerIsOpen })
                }}
                isActive={state.emojiPickerIsOpen}
                tooltip={
                  <div className="sc-popup-window">
                    <div className={`sc-popup-window--cointainer ${state.emojiPickerIsOpen ? '' : 'closed'}`}>
                      <div
                        style={{
                          overflow: 'auto',
                          width: '100%',
                          maxHeight: '100%',
                          boxSizing: 'border-box',
                          padding: '10px',
                        }}
                      >
                        <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap' }}>
                          {emojiData.map(({ emoji }) => (
                            <span
                              style={{
                                margin: '5px',
                                width: '30px',
                                lineHeight: '30px',
                                textAlign: 'center',
                                cursor: 'pointer',
                                verticalAlign: 'middle',
                                fontSize: '28px',
                                transition: 'transform 60ms ease-out, -webkit-transform 60ms ease-out',
                                transitionDelay: '60ms',
                              }}
                              onMouseOver={(e) => (e.target.style.transform = 'scale(1.2)')}
                              onMouseOut={(e) => (e.target.style.transform = 'unset')}
                              key={emoji}
                              onClick={() => handleEmoji(emoji)}
                            >
                              {emoji}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                }
              />
            </div>
            <div className="sc-user-input--button">
              <SendIcon onClick={handleKeyDown} />
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
