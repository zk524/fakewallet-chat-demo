import React, { useState } from 'react'
import { render } from 'react-dom'
import './styles'
import Message from './Messages'
import UserInput from './UserInput'

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
        url: '',
        fileName: 'bigBlue.png',
      },
    },
  ])
  return (
    <div>
      <div id="sc-launcher">
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
    </div>
  )
}
