import React, { Component } from 'react'
import Main from '../components/template/Main'
import axios from 'axios'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import constantes from '../common/constants'

const headerProps = {
    icon: 'users',
    title: 'Administrativo',
    subtitle: 'Administração...'
}

export default class Administrativo extends Component {
    constructor(props) {
        super(props)
        this.state = {
            ...this.state,
            formControlsUser: {
                email: {
                    value: ''
                },
                userName: {
                    value: ''
                },
                passwordUser: {
                    value: ''
                }
            }
        }
    }

    getURLUsers() {
        var baseURL = undefined;
        var url = window.location.href;
        url.includes(constantes.API_BASE_LOCAL) == true ? baseURL = constantes.API_BASE_BACKEND+'users' : 
        baseURL = constantes.API_BASE_BACKEND_SERVER+'users';
        var config = {
            headers: { 'Authorization': localStorage.getItem('token') }
        };
        return { baseURL, config };
    }

    componentWillMount() {

        var { baseURL, config } = this.getURLUsers();
        const url = `${baseURL}/`+localStorage.getItem('user_id')
        axios['get'](url, config)
            .then(resp => {
                if (constantes.PERFIL_SUPER_USER == resp.data.perfil ) {
                    this.setState({ ...this.state, admin: true });
                }
            });
    }

    retornarURLBackup(e) {
        var url = window.location.href;
        if (url.includes(constantes.API_BASE_LOCAL)) {
            return constantes.API_BASE_BACKEND+constantes.APP_SECRET_KEY;
        } else {
            return constantes.API_BASE_BACKEND_SERVER+constantes.APP_SECRET_KEY
        }
    }

    exibirUsuarioSenha() {
        this.setState({ showNewUser: true })
    }

    efetuarBackup(user) {
        var config = {
            headers: { 'Authorization': localStorage.getItem('token'), 'nickname': user }
        };

        axios['get'](this.retornarURLBackup(), config)
            .then(resp => {
                this.setState({ backup: resp.data.backup })
                console.log(resp.data.backup)
                this.emitirToast('success', 'Arquivo obtido com sucesso! ');
            })
            .catch(error => {
                console.log("Ocorreu um erro..." + error);
                if (error.response) {
                    if (error.response.status == 500) {
                        this.emitirToast('error', 'Ocorreu um erro interno, contate o administrador!');
                    } else {
                        this.emitirToast('error', 'Acesso não autorizado!');
                    }
                } else if (error.request) {
                    console.log(error.request);
                } else {
                    console.log('Error codigo...', error.message);
                }
            });
    }

    emitirToast(action, mensagem) {
        toast[action](mensagem, {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true
        });
        return true;
    }

    changeHandler = event => {
        const name = event.target.name;
        const value = event.target.value;
        this.setState({
            formControlsUser: {
                ...this.state.formControlsUser,
                [name]: {
                    ...this.state.formControlsUser[name],
                    value
                }
            }
        });
    }

    validarDados(novoUsuario) {
        var erro = false
        if (!novoUsuario.userName) {
            erro = this.emitirToast('error', 'O campo nome não pode ficar vazio...');
        }

        if (!novoUsuario.password) {
            erro = this.emitirToast('error', 'O campo password não pode ficar vazio...');
        }

        if (!novoUsuario.email) {
            erro = this.emitirToast('error', 'Email obrigatório...');
        }

        if (novoUsuario.email) {
            if (!constantes.EMAIL_VALIDO.test(novoUsuario.email)) {
                erro = this.emitirToast('error', 'Email inválido...');
            }
        }
        if (erro)
            return false;
        return true
    }

    renderAdmin() {
        return (
            <div className="form-group">
                <label>Backup Base</label>
                <button className="btn btn-warning ml-2"
                    onClick={() => this.efetuarBackup(localStorage.getItem('nomeUsuario'))}>
                    <i className="fa fa-database"></i>
                </button>
                <div></div>
                {this.state.backup ? this.state.backup : <div></div>}
                <hr></hr>
                <label>Incluir Novo Usuário</label>
                <button className="btn btn-warning ml-2"
                    onClick={() => this.exibirUsuarioSenha()}>
                    <i className="fa fa-database"></i>
                </button>
                <div className="row">
                    <div className="col-12 col-md-6">
                        <div className="form-group">
                            <label>UserName</label>
                            <input type="text"
                                name="userName"
                                className="form-control"
                                value={this.state.formControlsUser.userName.value}
                                placeholder="Digite o Nome do Usuário..."
                                onChange={this.changeHandler} />
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-12 col-md-6">
                        <div className="form-group">
                            <label>E-mail</label>
                            <input type="email"
                                name="email"
                                className="form-control"
                                value={this.state.formControlsUser.email.value}
                                placeholder="Digite o e-mail do usuario..."
                                onChange={this.changeHandler} />
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-12 col-md-6">
                        <div className="form-group">
                            <label>Password</label>
                            <input type="password"
                                name="passwordUser"
                                className="form-control"
                                value={this.state.formControlsUser.passwordUser.value}
                                placeholder="Digite a senha do usuário..."
                                onChange={this.changeHandler}
                            />
                        </div>
                    </div>
                </div>
                <button className="btn btn-primary"
                    onClick={e => this.inserir(e)}>
                    Incluir
                </button>
            </div>
        )
    }

    inserir() {
        var payload = {
            email: this.state.formControlsUser.email.value,
            userName: this.state.formControlsUser.userName.value,
            password: this.state.formControlsUser.passwordUser.value
        }

        if (this.validarDados(payload)) {
            var { baseURL, config } = this.getURLUsers();
            axios.post(baseURL, payload, config)
                .then(resp => {
                    this.emitirToast('success', 'Novo usuario cadastrado com sucesso! ');
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
    }

    render() {
        return (
            <Main {...headerProps}>
                {this.state.admin ? this.renderAdmin() : <h4>Funcionalidade exclusiva para administradores...</h4>}
            </Main>
        )
    }
}
