import axios from 'axios';
import React, { Component } from 'react';
import 'react-toastify/dist/ReactToastify.css';
import { toast, ToastContainer } from 'react-toastify';
import Main from '../components/template/Main';
import { Redirect } from 'react-router-dom'

const headerProps = {
    icon: 'lock',
    title: 'Primeiro Acesso',
    subtitle: 'Alterar Senha'
}

const initialState = {
    senhas: {
        password: '', passwordAgain: ''
    },
    user: {
        userName: ''
    }
}

export default class TrocarPassword extends Component {

    state = { ...initialState }

    componentWillMount() {
        this.buscarDadosUsuario();
    }

    buscarDadosUsuario() {
        var { baseURL, config } = this.obterApi();
        const url = `${baseURL}users/` + localStorage.getItem('user_id')
        axios['get'](url, config)
            .then(resp => {
                this.setState({ user: resp.data });
            });
    }

    retornarListaMembros() {
        this.setState({ retornarTelaMembros: true })
    }

    seguirTelaInicial() {
        if (this.state.retornarTelaMembros) {
            return <Redirect to={{
                pathname: '/protected',
                state: { user: undefined }
            }} />
        }
    }

    retornarURL(e) {
        var url = window.location.href;
        if (url.includes('http://localhost:3000/')) {
            return 'http://localhost:3001/';
        } else {
            return 'https://cadastromembrosibbback.herokuapp.com/';
        }
    }

    emitirToast(acao, mensagem) {
        toast[acao](mensagem, {
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

    alterarSenha() {
        var senhas = this.state.senhas
        var usuarioLogado = this.state.user
        if (this.validarDados(senhas)) {
            var { baseURL, config } = this.obterApi();
            usuarioLogado.primeiroAcesso = 0;
            usuarioLogado.password = senhas.password
            axios.post(baseURL + 'api-password-reset-confirm', usuarioLogado, config) 
                .then(response => {
                    const url = `${baseURL}users/` + localStorage.getItem('user_id')
                    axios['get'](url, config)
                        .then(resp => {
                            this.setState({ user: resp.data });
                            var usuarioBD = resp.data;
                            usuarioBD.password = response.data.hash
                            usuarioBD.primeiroAcesso = 0
                            axios.put(url, usuarioBD, config)
                                .then(responseFinal => {
                                this.emitirToast('success', 'Senha alterada com sucesso! ');
                                this.retornarListaMembros();
                        });
                    });
                    
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

    validarDados(senhas) {
        var erro = false
        if (!senhas.password) {
            erro = true;
            this.emitirToast('error', 'Favor preencher a senha');
        }
        if (!senhas.passwordAgain) {
            erro = true;
            this.emitirToast('error', 'Favor repetir a senha');
        }
        if (senhas.passwordAgain && senhas.password && senhas.passwordAgain !== senhas.password ) {
            erro = true;
            this.emitirToast('error', 'Senhas não conferem!');
        }
        if (erro)
            return false;
        return true
    }

    /**
     * Interessante evoluir o estado e nao atualizá-lo diretamente
     * @param {event}
     */
    updateField(event) {
        const senhas = { ...this.state.senhas }
        senhas[event.target.name] = event.target.value
        this.setState({ senhas })
    }

    renderForm() {
        return (
            <div className="limiter">
            {this.seguirTelaInicial()}
            <div className="container-login100">
              <div className="wrap-login100">
                <div className="login100-form-title-img">
                  <span className="login100-form-title-1">
                    SISCAD
                </span>
                </div>
                <form className="login100-form validate-form">
                  <div className="wrap-input100 validate-input m-b-26">
                    <span className="label-input100">Nova Senha: </span>
                    <input type="password"
                      name="password"
                      className="input100"
                      value={this.state.senhas.password}
                      placeholder="Digite a nova senha..."
                      onChange={e => this.updateField(e)} />
                    <span className="focus-input100"></span>
                  </div>
    
                  <div className="wrap-input100 validate-input m-b-18">
                    <span className="label-input100">Password</span>
                    <input type="password"
                      name="passwordAgain"
                      className="input100"
                      value={this.state.senhas.passwordAgain}
                      placeholder="Repita a sua nova senha..."
                      onChange={e => this.updateField(e)} />
                    <span className="focus-input100"></span>
                  </div>
                </form>
                <div className="container-login100-form-btn">
                  <button className="login100-form-btn" onClick={e => this.alterarSenha(e)}>Alterar</button>
                </div>
                <ToastContainer />
              </div>
            </div>
          </div>
        )
    }

    render() {
        return (
            <Main {...headerProps}>
                {this.renderForm()}
            </Main>
        )
    }
}
