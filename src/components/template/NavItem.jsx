import './Nav.css'
import React from 'react'
import { Link } from 'react-router-dom'


export default props =>
        <Link to={props.rota}>
            <i className={props.icon}></i> {props.title}
        </Link> 
    