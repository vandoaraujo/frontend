import React, { Component } from 'react'
import Main from '../components/template/Main'
import 'react-toastify/dist/ReactToastify.css';

const headerProps = {
    icon: 'book',
    title: 'Início',
    subtitle: 'Sistema para cadastrar a família IBB...'
}

export default class BemVindo extends Component {

    state = {}

    render() {
        return (
            <Main {...headerProps}>
                <BoasVindas headerProps />
            </Main>
        )
    }
}

class BoasVindas extends Component {

    render() {
        return (
            <div className="form">
                <div className="row">
                    <div className="col-8 col-md-8">
                        <div className="form-group">
                        <h3>{this.exibeMensagemBoasVindas()}</h3>
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
        )    }
    
    exibeMensagemBoasVindas(){
        if(localStorage.getItem('nomeUsuario')){
            return 'Bem vindo, ' + localStorage.getItem('nomeUsuario')
        }else{
            return 'Olá, Bem vindo ao SISCAD!'
        }
        
    }

}
