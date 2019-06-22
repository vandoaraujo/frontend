import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'font-awesome/css/font-awesome.min.css'
import Auth from '../auth/Auth'
import React from 'react'
import { BrowserRouter } from 'react-router-dom'

import Logo from '../components/template/Logo'
import Footer from '../components/template/Footer'

export default props =>
    <BrowserRouter>
        <div className='app'>
            <Logo />
            <Auth />
            <Footer /> 
        </div>
    </BrowserRouter>
    
