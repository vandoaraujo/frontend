import './Logo.css'
import React from 'react'
//import logo from '../../assets/imgs/logoIgreja.jpg'
import { Link } from 'react-router-dom'
import logo from '../../assets/imgs/imgs.png'


export default props =>
    <aside className="logo">
        <Link to="/" className="logo">
            <img src={logo} alt="logo" />
        </Link>
    </aside>