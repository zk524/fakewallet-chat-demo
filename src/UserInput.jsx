import { useState, useRef } from 'react'
import EmojiIcon from './components/EmojiIcon'
import EmojiConvertor from 'emoji-js'
import emojiData from './assets/emojiData'

const emojiConvertor = new EmojiConvertor()
emojiConvertor.init_env()

export default (props) => {
  const [state, setState] = useState({
    inputActive: false,
    inputHasText: false,
    emojiPickerIsOpen: false,
    emojiFilter: '',
  })
  const userInput = useRef(null)

  return (
    <form className={`sc-user-input ${state.inputActive ? 'active' : ''}`}>
      <div
        role="button"
        tabIndex="0"
        onFocus={() => setState({ ...state, inputActive: true })}
        onBlur={() => setState({ ...state, inputActive: false })}
        ref={userInput}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            const text = userInput.current.textContent
            if (text && text.length > 0) {
              props.onSubmit({ author: 'me', type: 'text', data: { text } })
              userInput.current.innerHTML = ''
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
                            if (state.inputHasText) userInput.current.innerHTML += emoji
                            else props.onSubmit({ author: 'me', type: 'emoji', data: { emoji } })
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
      </div>
    </form>
  )
}
