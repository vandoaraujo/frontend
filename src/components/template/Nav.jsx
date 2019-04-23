import './Nav.css'
import React from 'react'
import NavItem from './NavItem'

export default props =>
    <aside className="menu-area">
        <nav className="menu">
            <NavItem rota="#/" icon="fa fa-home" title="Início" />
            <NavItem rota="#/users" icon="fa fa-users" title="Usuários" />
        </nav>
    </aside>