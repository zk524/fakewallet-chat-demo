import Linkify from 'react-linkify'
import chatIconUrl from './assets/chat-icon.svg'
import FileIcon from './components/FileIcon'

export default ({ message }) => {
  return (
    <div className="sc-message">
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
  )
}
