import React from 'react'
import './entry.css'

export default function Entry(props) {
    return (
        <div className="sContact border-bottom padding-bottom ">
            <span>
                {props.name}
            </span>
        </div>
    )
}
