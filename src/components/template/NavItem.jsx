import './Nav.css'
import React from 'react'

export default props =>
        <a href={props.rota}>
            <i className={props.icon}></i> {props.title}
        </a> 
    