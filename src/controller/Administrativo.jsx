import React, { Component } from 'react'
import Main from '../components/template/Main'
import axios from 'axios'
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import constantes from '../common/constants'
import { Redirect } from 'react-router-dom'

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
                },
                perfil: {
                    value: ''
                }

            }
        }
    }

    componentWillMount() {
        var { baseURL, config } = this.getURLUsers();
        const url = `${baseURL}/`+localStorage.getItem('user_id')
        axios['get'](url, config)
            .then(resp => {
                if (constantes.PERFIL_SUPER_USER === resp.data.perfil ) {
                    this.setState({ ...this.state, admin: true,
                        email: resp.data.email, perfil: resp.data.perfil });
                    axios.get( this.getURLSistemaManutencao()+'/1' , config)
                          .then(resp => {
                            if (resp.data.desabilitado === 0) {
                                this.setState({...this.state, manutencao : 0})
                            }else{
                                this.setState({...this.state, manutencao : 1})
                            }
                    }).catch(error => {
                            if (error.response) {
                              this.emitirToast('error',error.response.data);
                            } else if (error.request) {
                              this.emitirToast('error', 'Ocorreu um erro interno ao tentar efetuar o login...');
                            } else {
                              console.log('Error codigo...', error.message);
                            }
                    });   
                }
            });
    }

    getURLSistemaManutencao() {
        var baseURL = undefined;
        window.location.href.includes(constantes.API_BASE_LOCAL) === true ? baseURL = constantes.API_BASE_BACKEND+'infoSystem' : 
        baseURL = constantes.API_BASE_BACKEND_SERVER+'infoSystem';
        return  baseURL
    }

    getURLUsers() {
        var baseURL = undefined;
        var url = window.location.href;
        url.includes(constantes.API_BASE_LOCAL) === true ? baseURL = constantes.API_BASE_BACKEND+'users' : 
        baseURL = constantes.API_BASE_BACKEND_SERVER+'users';
        var config = {
            headers: { 'Authorization': localStorage.getItem('token') }
        };
        return { baseURL, config };
    }

    retornarURLBackup(e) {
        var url = window.location.href;
        if (url.includes(constantes.API_BASE_LOCAL)) {
            return constantes.API_BASE_BACKEND+constantes.APP_SECRET_KEY;
        } else {
            return constantes.API_BASE_BACKEND_SERVER+constantes.APP_SECRET_KEY
        }
    }

    exibirCamposNovoUsuario() {
        this.setState({ showNewUser: true })
    }

    efetuarBackup(email, perfil) {
        var config = {
            headers: { 'Authorization': localStorage.getItem('token'),
            'email': email, 'perfil': perfil }
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
                    if (error.response.status === 500) {
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
                    onClick={() => this.efetuarBackup(this.state.email, this.state.perfil)}>
                    <i className="fa fa-database"></i>
                </button>
                <div></div>
                {this.state.backup ? this.state.backup : <div></div>}
                <hr></hr>
                <label>Incluir Novo Usuário</label>
                <button className="btn btn-warning ml-2"
                    onClick={() => this.exibirCamposNovoUsuario()}>
                    <i className="fa fa-user-circle"></i>
                </button>
                {this.state.showNewUser ? 
                <div>
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
                <div className="row">
                    <div className="col-12 col-md-6">
                        <div className="form-group">
                            <label>Perfil</label>
                            <select className="form-control" name="perfil"
                                value={this.state.formControlsUser.perfil.value}
                                onChange={this.changeHandler}>
                                <option value="consulta">Consulta</option>
                                <option value="admin">Administrador</option>
                            </select>
                        </div>
                    </div>
                </div>
                
                <button className="btn btn-primary"
                    onClick={e => this.inserir(e)}>
                    Incluir
                </button>
                </div> : <div></div>}
                <hr></hr>
                <label>Habilitar/Desabilitar Sistema</label>
                <button className="btn btn-warning ml-2"
                    onClick={() => this.habilitarDesabilitarSistema()}>
                    <i className="fa fa-microchip"></i>
                </button><p></p>
                <label>O sistema no momento está:  {this.state.manutencao ? 'EM MANUTENÇÃO' : 'ATIVO'} </label>
            </div>
        )
    }

    habilitarDesabilitarSistema(){
        var payload = {
            desabilitado: this.state.manutencao ? 0 : 1
        }
        var config = {
            headers: { 'Authorization': localStorage.getItem('token') }
        };
        axios.put(this.getURLSistemaManutencao()+'/1', payload, config)
                .then(resp => {
                    this.setState({ manutencao: payload.desabilitado })
                    this.emitirToast('success', 'Acao efetuada com sucesso! ');
                })
    }

    clear(){
        this.setState ( {
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
                },
                perfil: {
                    value: ''
                }

            }
        })
        this.setState({ backTelaPrincipal : true})
    }

    inserir() {
        var payload = {
            email: this.state.formControlsUser.email.value,
            userName: this.state.formControlsUser.userName.value,
            password: this.state.formControlsUser.passwordUser.value,
            perfil: this.state.formControlsUser.perfil.value
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
                this.clear()
        }
    }

    goHome() {
        return <Redirect to={{
              pathname: '/membros',
              state: { user: undefined }
        }}  />
    }

    render() {
        return (
            <Main {...headerProps}>
                {this.state.backTelaPrincipal ? this.goHome() : null}
                {this.state.admin ? this.renderAdmin()
                     : <h4>Funcionalidade exclusiva para administradores...</h4>}
            </Main>
        )
    }
}
