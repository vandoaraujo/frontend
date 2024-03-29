import React, { Component } from 'react'
import Main from '../components/template/Main'
import axios from 'axios'
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Redirect } from 'react-router-dom'
import constantes from '../common/constants'
import Popup from '../components/template/Popup'
import * as moment from 'moment';
import 'moment/locale/pt-br';

const fetch = require("node-fetch");

const headerProps = {
    icon: 'users',
    title: 'Membros',
    subtitle: 'Lista de membros'
}

const homeList = {
    user: {
        name: '', email: '', cep: '', endereco: '', bairro: '',
        cidade: '', telefone: '', dataNascimento: '', numero: '',
        uf: '', sexo: '', estadoCivil: '', conjuge: '', complemento: '',
        escolaridade: '', profissao: ''
    },
    list: []
}

export default class HomeList extends Component {

    state = { ...homeList, edicaoMembro: false, transferenciaMembro: false, admin: false, showPopup: false }

    componentWillMount() {
        var apiBaseUrl = undefined;
        apiBaseUrl = this.retornarURL();
        if (localStorage.getItem('token') != null) {
            (async () => {
                await fetch(
                    apiBaseUrl + 'membros',
                    {
                        method: 'GET',
                        headers: { 'Authorization': localStorage.getItem('token') }
                    },
                ).then(res => res.json())
                    .then(json => this.setState({ list: json.membros.sort(this.compare) }));
            })()
        }

        var { baseURL, config } = this.getURLUsers();
        const url = `${baseURL}/` + localStorage.getItem('user_id')
        axios['get'](url, config)
            .then(resp => {
                if (constantes.PERFIL_SUPER_USER === resp.data.perfil) {
                    this.setState({ ...this.state, admin: true });
                }
            });
    }

    togglePopup(membro) {
        this.setState({
            showPopup: !this.state.showPopup,
            membroSelecionado: membro
        });
    }

    getURLUsers() {
        var baseURL = undefined;
        window.location.href.includes(constantes.API_BASE_LOCAL) === true ? baseURL = constantes.API_BASE_BACKEND + 'users' :
            baseURL = constantes.API_BASE_BACKEND_SERVER + 'users';
        var config = {
            headers: { 'Authorization': localStorage.getItem('token') }
        };
        return { baseURL, config };
    }

    compare(a, b) {
        // Use toUpperCase() to ignore character casing
        const nameA = a.name.toUpperCase();
        const nameB = b.name.toUpperCase();

        let comparison = 0;
        if (nameA > nameB) {
            comparison = 1;
        } else if (nameA < nameB) {
            comparison = -1;
        }
        return comparison;
    }

    retornarURL(e) {
        var url = window.location.href;
        if (url.includes(constantes.API_BASE_LOCAL)) {
            return constantes.API_BASE_BACKEND;
        } else {
            return constantes.API_BASE_BACKEND_SERVER;
        }
    }
    /**
     * 
     * Removo usuario da lista e adiciono o novo criando uma lista nova
     * @param user 
     */
    getUpdatedList(user, add = true) {
        const list = this.state.list.filter(u => u.id !== user.id)
        if (add) list.unshift(user)
        return list
    }

    setEdicaoMembro = (user) => {
        this.setState({
            edicaoMembro: true,
            user: user
        })
    }

    load(user) {
        this.setEdicaoMembro(user)
    }

    setTransferenciaMembro = (user) => {
        this.setState({
            transferenciaMembro: true,
            user: user
        })
    }

    loadTransferencia(user) {
        this.setTransferenciaMembro(user)
    }

    setNovoMembro = () => {
        this.setState({
            novoMembro: true
        })
    }

    renderEdicaoMembro() {
        if (this.state.edicaoMembro) {
            return <Redirect to={{
                pathname: '/cadastro',
                state: { userLoad: this.state.user }
            }} />
        }
    }

    renderTransferenciaMembro() {
        if (this.state.transferenciaMembro) {
            return <Redirect to={{
                pathname: '/transferencia',
                state: { userLoad: this.state.user }
            }} />
        }
    }

    renderNovoMembro() {
        if (this.state.novoMembro) {
            return <Redirect to={{
                pathname: '/cadastro'
            }} />
        }
    }

    renderTable() {
        return (
            <div>
                {this.renderEdicaoMembro()}
                {this.renderTransferenciaMembro()}
                {this.renderNovoMembro()}
                <table className="table mt-4">
                    <thead>
                        <tr>
                            <th>Nome</th>
                            <th>E-mail</th>
                            <th>Telefone</th>
                            {this.state.admin ? <th>Ações</th> : null}
                        </tr>
                    </thead>
                    <tbody>
                        {this.renderRows()}
                    </tbody>
                </table>
            </div>
        )
    }

    //Colocar o user que será apagado no state...
    removerMembro() {
        var membroARemover = this.state.membroSelecionado
        var baseURL = undefined;
        baseURL = this.retornarURL();
        var config = {
            headers: { 'Authorization': localStorage.getItem('token') }
        };
        axios.delete(`${baseURL}membros/${membroARemover.id}`, config).then(resp => {
            this.togglePopup()
            if (resp.status > 200) {
                this.emitirToast('error', 'Ocorreu um erro ao remover o membro...');
            } else {
                const list = this.getUpdatedList(membroARemover, false)
                this.setState({ list })
                this.emitirToast('success', 'Membro ' + membroARemover.name + ' removido com sucesso! ');
                this.refreshListaMembros(baseURL);
            }
        }).catch(error => {
            console.log("Ocorreu um erro..." + error);
            if (error.response) {
                this.emitirToast('error', error.response.data);
            } else if (error.request) {
                console.log(error.request);
            } else {
                console.log('Error codigo...', error.message);
            }
        });
    }

    refreshListaMembros(baseURL) {
        (async () => {
            await fetch(baseURL + 'membrosUpdated', {
                method: 'GET',
                headers: { 'Authorization': localStorage.getItem('token') }
            }).then(res => res.json())
                .then(json => this.setState({ newList: json.membros.membros }));
        })();
    }

    emitirToast(action, mensagem) {
        toast[action](mensagem, {
            position: "top-right",
            autoClose: 6000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true
        });
    }

    obterApi() {
        var baseURL = undefined;
        baseURL = this.retornarURL();
        var config = {
            headers: { 'Authorization': localStorage.getItem('token') }
        };
        return { baseURL, config };
    }

    renderRows() {
        return this.state.list.length !== 0 ? this.state.list.map(user => {
            return (
                <tr key={user.id}>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>{user.telefone}</td>
                    {this.state.admin ?
                        <td>
                            <button title="Editar" className="btn btn-info"
                                onClick={() => this.load(user)}>
                                <i className="fa fa-pencil"></i>
                            </button    >
                            <button title="Transferir" className="btn btn-warning ml-2"
                                onClick={() => this.loadTransferencia(user)}>
                                <i className="fa fa-cut"></i>
                            </button>
                            <button title="Excluir" className="btn btn-danger ml-2"
                                onClick={this.togglePopup.bind(this, user)}>
                                <i className="fa fa-trash"></i>
                            </button>
                        </td>
                        :null
                    }
                </tr>
            )
        }) : 'Não há membros cadastrados...'
    }

    quantidadeMembros() {
        if (this.state.list && this.state.list.length > 0)
            return this.state.list.length
        else return 0;
    }

    mediaFaixaEtaria() {
        var somaIdades = 0;
        if (this.state.list && this.state.list.length > 0){
            for(let i =0 ; i < this.state.list.length; i++){
                var membro = this.state.list[i];
                if(membro.dataNascimento){
                    moment.locale('pt-BR');
                    var idade = moment().year() - membro.dataNascimento.substring(0, 4);
                    somaIdades = somaIdades + idade;
                }
            }
            var media = somaIdades / this.state.list.length
            return media;
        }
        return 0;
    }

    retornarQuantidadeCriancas(){
        var qtdCriancas = 0;
        if (this.state.list && this.state.list.length > 0){
            for(let i =0 ; i < this.state.list.length; i++){
                var membro = this.state.list[i];
                if(membro.dataNascimento){
                    moment.locale('pt-BR');
                    var idade = moment().year() - membro.dataNascimento.substring(0, 4);
                    if(idade < 12){
                        qtdCriancas++;    
                    }
                }
            }
            return qtdCriancas;
        }
        return 0;
    }

    quantidadeMembrosMasculino() {
        var somaIdadesMasculino = 0;
        if (this.state.list && this.state.list.length > 0){
            for(let i =0 ; i < this.state.list.length; i++){
                var membro = this.state.list[i];
                if(membro.sexo && membro.sexo === 'M' ){
                    somaIdadesMasculino++
                }
            }
        }
        return somaIdadesMasculino
    }

    quantidadeMembrosFeminino() {
        var somaIdadesFeminino = 0;
        if (this.state.list && this.state.list.length > 0){
            for(let i =0 ; i < this.state.list.length; i++){
                var membro = this.state.list[i];
                if(membro.sexo && membro.sexo === 'F' ){
                    somaIdadesFeminino++
                }
            }
        }
        return somaIdadesFeminino
    }

    render() {
        return (
            <Main {...headerProps}>
                {this.state.showPopup ?
                    <Popup
                        text='Deseja realmente apagar?'
                        removerMembro={this.removerMembro.bind(this)}
                        closePopup={this.togglePopup.bind(this)} />
                    : null
                }
                <div className="row">
                    <div className="col-9 col-md-9">
                        <div className="form-group">
                            <label>Quantidade </label>
                            <h3>{this.quantidadeMembros()}</h3>
                        </div>
                    </div>
                    <div className="col-3 col-md-3">
                        <div className="col-12 d-flex justify-content-start">
                            <button className="btn btn-info"
                                onClick={() => this.setNovoMembro()}>
                                <i className="fa fa-user-plus"></i>
                            </button>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-3 col-md-3">
                        <div className="form-group">
                            <label>Masculinos: </label>
                            <h3>{this.quantidadeMembrosMasculino()}</h3>
                        </div>
                    </div>
                    <div className="col-3 col-md-3">
                        <div className="form-group">
                            <label>Femininos: </label>
                            <h3>{this.quantidadeMembrosFeminino()}</h3>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-3 col-md-3">
                        <div className="form-group">
                            <label>Média Etária </label>
                            <h3>{this.mediaFaixaEtaria()}</h3>
                        </div>
                    </div>
                    <div className="col-3 col-md-3">
                        <div className="form-group">
                            <label>Crianças</label>
                            <h3>{this.retornarQuantidadeCriancas()}</h3>
                        </div>
                    </div>
                    <div className="col-3 col-md-3">
                        <div className="form-group">
                            <label>Adolescentes</label>
                            <h3>Em breve...</h3>
                        </div>
                    </div>
                </div>
                
                
                
                {this.renderTable()}
            </Main>
        )
    }
}
