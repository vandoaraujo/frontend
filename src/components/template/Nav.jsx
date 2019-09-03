import './Nav.css'
import React from 'react'
import NavItem from './NavItem'
import {
    BrowserRouter as Router,
    Route
  } from "react-router-dom";
import UserCrud from '../../controller/UserCrud'
import HomeList from '../../controller/HomeList';
import Consulta from '../../controller/Consulta';
import Administrativo from '../../controller/Administrativo';


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