import chatIconUrl from './assets/chat-icon.svg'
import FileIcon from './components/FileIcon'
import Linkify from 'react-linkify'

export default (props) => {
  return (
    <div className="sc-message">
      <div className={`sc-message--content ${props.message.author === 'me' ? 'sent' : 'received'}`}>
        <div className="sc-message--avatar" style={{ backgroundImage: `url(${chatIconUrl})` }}></div>
        {props.message.type === 'text' && (
          <div className="sc-message--text">
            {<Linkify properties={{ target: '_blank' }}>{props.message.data.text}</Linkify>}
          </div>
        )}
        {props.message.type === 'emoji' && <div className="sc-message--emoji">{props.message.data.emoji}</div>}
        {props.message.type === 'file' && (
          <a className="sc-message--file" href={props.message.data.url} download={props.message.data.fileName}>
            <FileIcon />
            <p>{props.message.data.fileName}</p>
          </a>
        )}
      </div>
    </div>
  )
}
