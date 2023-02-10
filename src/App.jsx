import React, { useState, useRef, useEffect } from 'react'
import Linkify from 'react-linkify'
import UserInput from './UserInput'
import FileIcon from './components/FileIcon'
import chatIconUrl from './assets/chat-icon.svg'
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
          {messageList.map((message, i) => (
            <div className="sc-message" key={i}>
              <div className={`sc-message--content ${message.author === 'me' ? 'sent' : 'received'}`}>
                <div className="sc-message--avatar" style={{ backgroundImage: `url(${chatIconUrl})` }}></div>
                {message.type === 'text' && (
                  <div className="sc-message--text">
                    {<Linkify properties={{ target: '_blank' }}>{message.data.text}</Linkify>}
                  </div>
                )}
                {message.type === 'emoji' && <div className="sc-message--emoji">{message.data.emoji}</div>}
                {message.type === 'file' && (
                  <a className="sc-message--file" href={message.data.url} download={message.data.fileName}>
                    <FileIcon />
                    <p>{message.data.fileName}</p>
                  </a>
                )}
              </div>
            </div>
          ))}
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
