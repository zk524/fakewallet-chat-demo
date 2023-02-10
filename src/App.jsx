import React, { useState, useRef, useEffect } from 'react'
import Message from './Message'
import UserInput from './UserInput'
import incomingMessageSound from './assets/notification.mp3'

const notifyAudio = new Audio(incomingMessageSound)

export default () => {
  const [messageList, setMessageList] = useState([
    { type: 'text', author: 'wallet', data: { text: 'Welcome to Fake Wallet!' } },
  ])
  const messageRef = useRef(null)

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
          {messageList.map((message, i) => {
            return <Message message={message} key={i} />
          })}
        </div>
        <UserInput
          onSubmit={(message) => setMessageList([...messageList, message])}
          onFilesSelected={(fileList) => {
            setMessageList([
              ...messageList,
              {
                type: 'file',
                author: 'me',
                data: {
                  url: window.URL.createObjectURL(fileList[0]),
                  fileName: fileList[0].name,
                },
              },
            ])
          }}
        />
      </div>
    </div>
  )
}
