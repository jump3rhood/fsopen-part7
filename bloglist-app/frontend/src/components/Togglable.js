// eslint-disable-next-line no-dupe-else-if
import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { Button } from 'react-bootstrap'
const Togglable = (props) => {
  const [visible, setVisible] = useState(false)

  const hideBtnWhenVisible = { display: visible ? 'none': '' }
  const showFormWhenVisible = { display: visible ? '' : 'none' }

  const toggleVisibility = () => {
    setVisible(!visible)
  }
  return (
    <div>
      <div style={hideBtnWhenVisible} >
        <Button variant='secondary' onClick={toggleVisibility} id="btn-label">{props.buttonLabel}</Button>
      </div>
      <div style={showFormWhenVisible}>
        {props.children}
        <Button variant='secondary' className='my-2' onClick={toggleVisibility}>Cancel</Button>
      </div>
    </div>
  )
}
Togglable.propTypes = {
  buttonLabel: PropTypes.string.isRequired
}
Togglable.displayName = 'Togglable'
export default Togglable