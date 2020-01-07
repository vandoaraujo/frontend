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
import BemVindo from '../../controller/BemVindo';
import UserTransferir from '../../controller/UserTransferir';

export default props =>
<Router>
    <aside className="menu-area">
        <nav className="menu">
            {/* <NavItem rota="/protected" icon="fa fa-home" title="Início" />         */}
            <NavItem rota="/membros" icon="fa fa-table" title="Membros" />
            <NavItem rota="/consulta" icon="fa fa-search" title="Consulta" />
            {/* <NavItem rota="/cadastro"  icon="fa fa-users" title="Cadastro" /> */}
            <NavItem rota="/administrativo"  icon="fa fa-gear" title="Administrativo" />
        </nav>
    </aside>
    <Route path="/protected" component={BemVindo} />
    <Route path="/administrativo" component={Administrativo} />
    <Route path="/cadastro" component={UserCrud} />
    <Route path="/transferencia" component={UserTransferir} />
    <Route path="/consulta" component={Consulta} />
    <Route path="/membros" component={HomeList} />

</Router>