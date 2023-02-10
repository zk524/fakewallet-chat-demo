import React, { useState, useRef, useEffect } from 'react'
import Linkify from 'react-linkify'
import EmojiConvertor from 'emoji-js'
import incomingMessageSound from '@/assets/notification.mp3'
import messageController from './controller/message'
import Emoji from './components/Emoji'
import Send from '@/components/Send'

const _message = { type: 'text', author: 'wallet', data: { text: 'Welcome to Fake Wallet!' } }
const notifyAudio = new Audio(incomingMessageSound)
const emojiConvertor = new EmojiConvertor()
emojiConvertor.init_env()

export default () => {
  const [messageRef, inputRef] = [useRef(null), useRef(null)]
  const [messageList, setMessageList] = useState([_message])
  const [state, setState] = useState({ inputActive: false, inputHasText: false, emojiPickerIsOpen: false, inputRef })

  const sendMessage = (msg) => {
    setMessageList([...messageList, msg])
  }

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

  useEffect(() => {
    const last = messageList.slice(-1)[0]
    if (last.author === 'me')
      messageController(last).then((res) => {
        if (res) {
          sendMessage({ type: 'text', author: 'wallet', data: { text: res } })
          notifyAudio.play()
        }
      })
    messageRef.current.scrollTop = messageRef.current.scrollHeight
  }, [messageList])

  return (
    <div id="app">
      <div id="chat-window">
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
        <div
          style={{
            height: '80%',
            overflowY: 'auto',
            backgroundColor: 'white',
            backgroundSize: '100%',
            padding: '20px 0px',
          }}
          ref={messageRef}
        >
          {messageList.map((message, i) => (
            <div style={{ width: 'calc(100% - 40px)', padding: '10px 20px', display: 'flex' }} key={'message' + i}>
              <div
                style={{
                  width: '100%',
                  display: 'flex',
                  ...(message.author === 'me' ? { justifyContent: 'flex-end' } : {}),
                }}
              >
                {message.type === 'text' && (
                  <div
                    style={{
                      padding: '17px 20px',
                      borderRadius: '6px',
                      fontWeight: '300',
                      fontSize: '14px',
                      lineHeight: '1.4',
                      whitSpace: 'pre-wrap',
                      WebkitFontSmoothing: 'subpixel-antialiased',
                      wordWrap: 'break-word',
                      minWidth: '200px',
                      width: 'calc(100% - 200px)',
                      ...(message.author === 'me'
                        ? {
                            color: 'white',
                            backgroundColor: '#4e8cff',
                            maxWidth: 'calc(100% - 120px)',
                            wordWrap: 'break-word',
                          }
                        : {
                            color: '#263238',
                            backgroundColor: '#f4f7f9',
                            marginRight: '40px',
                          }),
                    }}
                  >
                    {<Linkify properties={{ target: '_blank' }}>{message.data.text}</Linkify>}
                  </div>
                )}
                {message.type === 'emoji' && <div style={{ fontSize: '40px' }}>{message.data.emoji}</div>}
              </div>
            </div>
          ))}
        </div>

        <form
          style={{
            minHeight: '100px',
            margin: '0px',
            position: 'relative',
            bottom: 0,
            display: 'flex',
            backgroundColor: '#f4f7f9',
            borderBottomLeftRadius: '10px',
            borderBottomRightRadius: '10px',
            transition: 'background-color 0.2s ease, box-shadow 0.2s ease',
            ...(state.inputActive
              ? { backgroundColor: 'white', boxShadow: '0px -5px 20px 0px rgba(150, 165, 190, 0.2)' }
              : {}),
          }}
        >
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
            style={{
              width: '100%',
              resize: 'none',
              border: 'none',
              outline: 'none',
              borderBottomLeftRadius: '10px',
              boxSizing: 'border-box',
              padding: '18px 36px 18px 18px',
              fontSize: '15px',
              fontWeight: 400,
              lineHeight: 1.33,
              whiteSpace: 'pre-wrap',
              wordWrap: 'break-word',
              color: '#565867',
              WebkitFontSmoothing: 'antialiased',
              maxHeight: '200px',
              overflow: 'scroll',
              bottom: 0,
              overflowX: 'hidden',
              overflowY: 'auto',
            }}
          ></div>
          <div
            style={{
              marginTop: '10px',
              width: '100px',
              position: 'absolute',
              right: '10px',
              height: '100%',
              display: 'flex',
              justifyContent: 'flex-end',
            }}
          >
            <div
              style={{
                width: '30px',
                height: '55px',
                display: 'flex',
                flexDirection: 'column',
                justifCcontent: 'center',
              }}
            >
              <Emoji state={state} setState={setState} sendMessage={sendMessage} />
            </div>
            <div
              style={{
                width: '30px',
                height: '55px',
                display: 'flex',
                flexDirection: 'column',
                justifCcontent: 'center',
              }}
            >
              <Send onClick={handleKeyDown} />
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
