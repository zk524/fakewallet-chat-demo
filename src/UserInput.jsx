import { useState, useRef } from 'react'
import EmojiIcon from './components/EmojiIcon'
import PopupWindow from './PopupWindow'
import EmojiPicker from './components/EmojiPicker'

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
        onKeyDown={(event) => {
          if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault()
            const text = userInput.current.textContent
            if (text && text.length > 0) {
              props.onSubmit({
                author: 'me',
                type: 'text',
                data: { text },
              })
              userInput.current.innerHTML = ''
            }
          }
        }}
        onKeyUp={(event) => {
          const inputHasText = event.target.innerHTML.length !== 0 && event.target.innerText !== '\n'
          setState({ ...state, inputHasText })
        }}
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
              <PopupWindow
                isOpen={state.emojiPickerIsOpen}
                onClickedOutside={(e) => {
                  if (document.querySelector('#sc-emoji-picker-button').contains(e.target)) {
                    e.stopPropagation()
                    e.preventDefault()
                  }
                  setState({ ...state, emojiPickerIsOpen: false })
                }}
                onInputChange={(event) => setState({ ...state, emojiFilter: event.target.value })}
              >
                <EmojiPicker
                  onEmojiPicked={(emoji) => {
                    setState({ ...state, emojiPickerIsOpen: false })
                    if (state.inputHasText) {
                      userInput.current.innerHTML += emoji
                    } else {
                      props.onSubmit({
                        author: 'me',
                        type: 'emoji',
                        data: { emoji },
                      })
                    }
                  }}
                  filter={state.emojiFilter}
                />
              </PopupWindow>
            }
          />
        </div>
      </div>
    </form>
  )
}
