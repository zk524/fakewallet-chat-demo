import React, { useRef, useEffect } from 'react'
import EmojiConvertor from 'emoji-js'
import incomingMessageSound from '@/assets/notification.mp3'
import messageController from '@/controllers/message'
import Emoji from './components/Emoji'
import Send from '@/components/Send'
import store, { observer } from '@/controllers/store'
import { init } from '@/controllers/wallet'

const notifyAudio = new Audio(incomingMessageSound)
const emojiConvertor = new EmojiConvertor()
emojiConvertor.init_env()

export default observer(() => {
  const { messageList } = store
  const [messageRef, inputRef] = [useRef(null), useRef(null)]

  const handleKeyDown = (e) => {
    if ((e.key === 'Enter' && !e.shiftKey) || e.type === 'click') {
      const text = inputRef.current.textContent
      if (text && text.length > 0) {
        e.preventDefault()
        inputRef.current.innerHTML = ''
        store.setMessage({ author: 'me', type: 'text', data: { text } })
      }
    }
  }

  useEffect(() => {
    init()
  }, [])

  useEffect(() => {
    messageRef.current.scrollTop = messageRef.current.scrollHeight
    const last = messageList.slice(-1)[0]
    if (last.author === 'me')
      messageController(last).then((res) => {
        if (res) {
          store.setMessage({ type: 'text', author: 'wallet', data: { text: res } })
          notifyAudio.play()
        }
      })
    else messageList.length > 1 && notifyAudio.play()
  }, [messageList])

  return (
    <div id="app" onClick={() => store.emojiPickerIsOpen && store.set({ emojiPickerIsOpen: false })}>
      <div id="chat-window">
        <div
          style={{
            background: '#4e8cff',
            minHeight: '50px',
            borderTopLeftRadius: '9px',
            borderTopRightRadius: '9px',
            color: 'white',
            padding: '10px',
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
                    {<span style={{ whiteSpace: 'pre-wrap' }}>{message.data.text}</span>}
                  </div>
                )}
                {message.type === 'emoji' && <div style={{ fontSize: '40px' }}>{message.data.emoji}</div>}
              </div>
            </div>
          ))}
        </div>

        <div
          style={{
            width: '100%',
            display: 'flex',
            padding: '5px 10px',
            backgroundColor: 'rgba(100,100,100,.1)',
            boxSizing: 'border-box',
          }}
        >
          <div
            style={{
              width: '30px',
              display: 'flex',
              flexDirection: 'column',
              justifCcontent: 'center',
            }}
          >
            <Send onClick={handleKeyDown} />
          </div>
          <div
            style={{
              width: '30px',
              display: 'flex',
              flexDirection: 'column',
              justifCcontent: 'center',
            }}
          >
            <Emoji inputRef={inputRef} />
          </div>
        </div>

        <form
          style={{
            height: '100px',
            padding: '10px 0px 10px 10px',
            margin: 0,
            position: 'relative',
            display: 'flex',
            backgroundColor: 'rgba(100,100,100,.1)',
            borderBottomLeftRadius: '10px',
            borderBottomRightRadius: '10px',
            transition: 'background-color 0.5s ease, box-shadow 0.5s ease',
            boxSizing: 'border-box',
            ...(store.inputActive ? { backgroundColor: 'white' } : {}),
          }}
        >
          <div
            onFocus={() => store.set({ inputActive: true })}
            onBlur={() => store.set({ inputActive: false })}
            ref={inputRef}
            onKeyDown={handleKeyDown}
            onKeyUp={(e) => store.set({ inputHasText: e.target.innerHTML.length !== 0 && e.target.innerText !== '\n' })}
            contentEditable="true"
            placeholder="Command..."
            style={{
              width: '100%',
              height: '100%',
              outline: 'none',
              paddingRight: '6px',
              borderBottomLeftRadius: '10px',
              fontSize: '15px',
              whiteSpace: 'pre-wrap',
              wordWrap: 'break-word',
              overflow: 'scroll',
              overflowX: 'hidden',
              overflowY: 'auto',
            }}
          ></div>
        </form>
      </div>
    </div>
  )
})
