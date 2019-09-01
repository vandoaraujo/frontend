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
import Consulta from '../../user/Consulta';
import HomeList from '../../user/HomeList';
import Administrativo from '../../user/Administrativo';



export default props =>
<Router>
    <aside className="menu-area">
        <nav className="menu">
            <NavItem rota="/" icon="fa fa-home" title="Início" />
            <NavItem rota="/cadastro"  icon="fa fa-users" title="Cadastro" />
            <NavItem rota="/consulta" icon="fa fa-search" title="Consulta" />
            <NavItem rota="/administrativo" icon="fa fa-gear" title="Administrativo" />
        </nav>
    </aside>
    <Route path="/" component={HomeList} />
    <Route path="/cadastro" component={UserCrud} />
    <Route path="/consulta" component={Consulta} />
    <Route path="/administrativo" component={Administrativo} />

</Router>