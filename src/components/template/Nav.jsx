import './Nav.css'
import React from 'react'
import NavItem from './NavItem'
import {
    BrowserRouter as Router,
    Route,
    Redirect,
    withRouter
  } from "react-router-dom";
import UserCrud from '../../user/UserCrud'


export default props =>
<Router>
    <aside className="menu-area">
        <nav className="menu">
            <NavItem rota="/" icon="fa fa-home" title="Início" />
            <NavItem rota="/membros"  icon="fa fa-users" title="Cadastro" />
            <NavItem rota="/consulta" icon="fa fa-search" title="Consulta" />
            <NavItem rota="/relatorio" icon="fa fa-gear" title="Administrativo" />
        </nav>
    </aside>
    <Route path="/consulta" component={UserCrud} />
    <Route path="/membros" component={UserCrud} />
    <Route path="/consulta" component={UserCrud} />
    <Route path="/consulta" component={UserCrud} />

</Router>