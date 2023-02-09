import React, { useRef } from 'react'

export default (props) => {
  const emojiPopup = useRef(null)
  const { isOpen, children } = props
  return (
    <div className="sc-popup-window" ref={emojiPopup}>
      <div className={`sc-popup-window--cointainer ${isOpen ? '' : 'closed'}`}>
        <input onChange={props.onInputChange} className="sc-popup-window--search" placeholder="Search emoji..." />
        {children}
      </div>
    </div>
  )
}
