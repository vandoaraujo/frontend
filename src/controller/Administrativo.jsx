import React, { Component } from 'react'
import Main from '../components/template/Main'
import axios from 'axios'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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

    componentWillMount() {
        this.setState({
            baseURL: this.retornarURLBackup(), config: this.obterApi()
        })
        var { baseURL, config } = this.obterApiNovoUsuario();
        const url = `${baseURL}/`+localStorage.getItem('user_id')
        axios['get'](url, config)
            .then(resp => {
                const admin = 777;
                if (admin == resp.data.perfil ) {
                    this.setState({ ...this.state, admin: true });
                }
            });
    }

    retornarURLBackup(e) {
        var url = window.location.href;
        if (url.includes('http://localhost:3000/')) {
            return 'http://localhost:3001/930dca47b14ba687cdcb62469a3c95b5';
        } else {
            return 'https://cadastromembrosibbback.herokuapp.com/930dca47b14ba687cdcb62469a3c95b5';
        }
    }

    exibirUsuarioSenha() {
        this.setState({ showNewUser: true })
    }

    efetuarBackup(user) {
        var config = {
            headers: { 'Authorization': localStorage.getItem('token'), 'nickname': user }
        };

        axios['get'](this.state.baseURL, config)
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

    obterApi() {
        var baseURL = undefined;
        baseURL = this.retornarURLBackup();
        var config = {
            headers: { 'Authorization': localStorage.getItem('token') }
        };
        return { baseURL, config };
    }

    obterApiNovoUsuario() {
        var baseURL = undefined;
        var url = window.location.href;
        url.includes('http://localhost:3000/') == true ? baseURL = 'http://localhost:3001/users' : 
        baseURL = 'https://cadastromembrosibbback.herokuapp.com/users';
        var config = {
            headers: { 'Authorization': localStorage.getItem('token') }
        };
        return { baseURL, config };
    }


    validarDados(novoUsuario) {
        console.log(novoUsuario)
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
            let re = /^(([^<>()\]\\.,;:\s@"]+(\.[^<>()\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            if (!re.test(novoUsuario.email)) {
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
            var { baseURL, config } = this.obterApiNovoUsuario();
            console.log(baseURL)
            axios.post(baseURL, payload, config)
                .then(resp => {
                    console.log(resp)
                    // this.setState({ user: initialState.user })
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
                {this.state.admin ? this.renderAdmin() : <h3>Funcionalidade exclusiva para administradores...</h3>}
            </Main>
        )
    }
}
