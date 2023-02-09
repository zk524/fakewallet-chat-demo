import React, { useState } from 'react'
import Message from './Message'
import UserInput from './UserInput'
import mp3test from './assets/notification.mp3'

export default () => {
  const [messageList, setMessageList] = useState([
    {
      type: 'text',
      author: 'them',
      data: { text: "You've got to have a story." },
    },
    { type: 'emoji', author: 'me', data: { emoji: '😋' } },
    {
      type: 'file',
      author: 'me',
      data: {
        url: mp3test,
        fileName: 'test.mp3',
      },
    },
  ])

  return (
    <div className="app">
      <div className="sc-chat-window opened">
        <div className="sc-header">
          <div className="sc-header--team-name"> {'Fake Wallet'} </div>
        </div>
        <div className="sc-message-list">
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
