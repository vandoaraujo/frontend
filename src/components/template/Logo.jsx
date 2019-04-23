import './Logo.css'
import React from 'react'
import logo from '../../assets/imgs/logoIgreja.jpg'

export default props =>
    <aside className="logo">
        <a href="/" className="logo">
            <img src={logo} alt="logo" />
        </a>
    </aside>