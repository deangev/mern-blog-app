import React from 'react'
import './Errors.css'
export default function Errors(props) {
    return (
        <div className="error">
            <span>{props.message}</span>
       </div>
    )
}
