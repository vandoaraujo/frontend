import React, { Component } from 'react'
import Main from '../components/template/Main'
import axios from 'axios'
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const headerProps = {
    icon: 'book',
    title: 'Início',
    subtitle: 'Sistema para cadastrar a família IBB...'
}

const consultaState = {
    user: { name: ''},
}


export default class BemVindo
 extends Component {

    state = { ...consultaState }

   updateField(event){
       const user = { ...this.state.user }
       user[event.target.name] = event.target.value
       this.setState({ user })
   }

    componentWillMount() {
        this.setState({ list: undefined })
    }

    renderFormConsulta() {
        return (
            <div className="form">
                <div className="row">
                    <div className="col-8 col-md-8">
                        <div className="form-group">
                                <h3>Bem-vindo, {localStorage.getItem('userLogado')}! </h3>
                        </div>
                        <div className="form-group">
                            <label>Avisos: </label>
                            <label>Link Agenda Site Igreja</label>
                            <label>https://docs.google.com/spreadsheets/d/1ZgEwDF99_eBjJrLIC9QN--haI0ljkOg45nyry3gfn9o/edit#gid=1791516055</label>
                        </div>
                    </div>
                </div>
                <hr />
            </div>
        )
    }

    render() {
        return (
            <Main {...headerProps}>
                 {this.renderFormConsulta()} 
            </Main>
        )
    }
}
