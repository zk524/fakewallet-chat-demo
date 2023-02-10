import React, { useState, useRef, useEffect } from 'react'
import Linkify from 'react-linkify'
import EmojiConvertor from 'emoji-js'
import EmojiIcon from './components/EmojiIcon'
import SendIcon from './components/SendIcon'
import chatIconUrl from './assets/chat-icon.svg'
import emojiData from './assets/emojiData'
import incomingMessageSound from './assets/notification.mp3'

const notifyAudio = new Audio(incomingMessageSound)
const emojiConvertor = new EmojiConvertor()
emojiConvertor.init_env()

export default () => {
  const [messageList, setMessageList] = useState([
    { type: 'text', author: 'wallet', data: { text: 'Welcome to Fake Wallet!' } },
  ])
  const [state, setState] = useState({ inputActive: false, inputHasText: false, emojiPickerIsOpen: false })
  const messageRef = useRef(null)
  const inputRef = useRef(null)

  useEffect(() => {
    const last = messageList.slice(-1)[0]
    if (last.author === 'me') {
      setMessageList([...messageList, { type: 'text', author: 'wallet', data: { text: 'response...' } }])
      notifyAudio.play()
    }
  }, [messageList])

  useEffect(() => {
    messageRef.current.scrollTop = messageRef.current.scrollHeight
  }, [messageRef.current?.scrollHeight])

  return (
    <div className="app">
      <div className="sc-chat-window opened">
        <div className="sc-header">
          <div className="sc-header--team-name"> {'Fake Wallet'} </div>
        </div>
        <div className="sc-message-list" ref={messageRef}>
          {messageList.map((message, i) => (
            <div className="sc-message" key={'message' + i}>
              <div className={`sc-message--content ${message.author === 'me' ? 'sent' : 'received'}`}>
                <div className="sc-message--avatar" style={{ backgroundImage: `url(${chatIconUrl})` }}></div>
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
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                const text = inputRef.current.textContent
                if (text && text.length > 0) {
                  setMessageList([...messageList, { author: 'me', type: 'text', data: { text } }])
                  inputRef.current.innerHTML = ''
                }
              }
            }}
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
                      <div className="sc-emoji-picker">
                        <div className="sc-emoji-picker--category">
                          {emojiData.map(({ emoji }) => (
                            <span
                              className="sc-emoji-picker--emoji"
                              key={emoji}
                              onClick={() => {
                                setState({ ...state, emojiPickerIsOpen: false })
                                if (state.inputHasText) inputRef.current.innerHTML += emoji
                                else setMessageList([...messageList, { author: 'me', type: 'emoji', data: { emoji } }])
                              }}
                            >
                              {emoji}
                            </span>
                          ))}
                        </div>
                        )
                      </div>
                    </div>
                  </div>
                }
              />
            </div>
            <div className="sc-user-input--button">
              <SendIcon
                onClick={() => {
                  console.log(1)
                }}
              />
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
