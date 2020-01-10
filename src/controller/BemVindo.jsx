import React, { Component } from 'react'
import Main from '../components/template/Main'
import 'react-toastify/dist/ReactToastify.css';
import * as moment from 'moment';
import 'moment/locale/pt-br';


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
                        <p>{this.exibeUltimoLogin()}</p>
                        </div>
                        <hr></hr>
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
            //1578618851991
            var saudacao = this.retornarMensagemSaudacao()
            return saudacao + localStorage.getItem('nomeUsuario')
        }else{
            return 'Olá, Bem vindo ao SISCAD!'
        }
        
    }

    exibeUltimoLogin(){
        if(localStorage.getItem('ultimoLogin') !== undefined){
            var ultimoLogin = localStorage.getItem('ultimoLogin')
            moment.locale('pt-BR');
            var timeNumber = Number(ultimoLogin.substring(0,10))
            var formatted = moment.unix(timeNumber).format("DD/MM/YYYY HH:mm:ss");
            return 'Seu ultimo login foi no dia : ' + formatted
        }else{
            return 'Esse é seu primeiro acesso. Navegue no menu ao lado para buscar os membros da IBB. '
        }
        
    }

    retornarMensagemSaudacao() {
        var d = new Date();
        var hora = d.getHours();
        if(hora > 17 && hora < 24){
            return "Boa noite, "
        }
        if(hora >= 0 && hora < 7){
            return "Boa Madrugada, "
        }

        if(hora >= 7 && hora < 12){
            return "Bom dia, "
        }

        if(hora >= 12 && hora < 18){
            return "Boa tarde, "
        }

        return "Bem vindo, ";
    }

}
