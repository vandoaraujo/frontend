import axios from 'axios';
import React, { Component } from "react";
import { BrowserRouter as Router, Link } from "react-router-dom";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import constantes from '../common/constants'
import { Redirect } from 'react-router-dom'

class FormLogin extends Component {

    constructor(props) {
        super(props)
        this.state = { ...this.state,
          formControls: {
            email: {
              value: ''
            },
            name: {
              value: ''
            },
            password: {
              value: ''
            }
          }
        }
      }
    
      changeHandler = event => {
    
        const name = event.target.name;
        const value = event.target.value;
        this.setState({
          formControls: {
            ...this.state.formControls,
            [name]: {
              ...this.state.formControls[name],
            value
            }
          }
        });
      }
      
      login = (e) => {
        axios.defaults.headers.post['Content-Type'] = 'application/json';
        var url = window.location.href;
        var apiBaseUrl = this.obterApiLogin(url);
        if(this.validarEmail(this.state.formControls.email.value)){
          var payload = {
            email: this.state.formControls.email.value,
            password: this.state.formControls.password.value
          }
          axios.post(apiBaseUrl.concat('api-token-auth'), payload)
          .then(response => {
            if (response.status === 200) {
                this.props.fakeAuth.authenticate(() => {
                this.setState({ ...this.state, redirectToReferrer: true, usuarioLogado: response.data.user.userName });
                localStorage.removeItem('user_id')
                localStorage.removeItem('nomeUsuario')
                localStorage.setItem('user_id', response.data.user.id);
                localStorage.setItem('nomeUsuario', response.data.user.userName);
                localStorage.setItem('token', response.data.token);
                
                let { from } = this.props.from;
                return <Redirect to={from} usuarioLogado={this.state.usuarioLogado} />;
                
              });
            }
            else {
              this.emitirToasterErro('Ops, Usuario e/ou Senha inválidos...');
            }
          }).catch(error => {
            console.log("Ocorreu um erro... " + error);
            if (error.response) {
              console.log('Retorno 500...');
              this.emitirToasterErro(error.response.data);
            } else if (error.request) {
              console.log(error.request);
              this.emitirToasterErro('Ocorreu um erro interno ao tentar efetuar o login...');
            } else {
              console.log('Error codigo...', error.message);
            }
          });
        }
      };
    
      validarEmail(email){
        if (email) {
          if (!constantes.EMAIL_VALIDO.test(email)) {
              this.emitirToasterErro('Favor preencher o email no formato válido...');
              return false;
          }
          return true;
        }
        return false;
      }        
    
      obterApiLogin(url) {
        var apiBaseUrl;
        url.includes(constantes.API_BASE_LOCAL) === true
         ? apiBaseUrl = constantes.API_BASE_BACKEND : 
         apiBaseUrl = constantes.API_BASE_BACKEND_SERVER;
        return apiBaseUrl;
      }
    
      emitirToasterErro(mensagem) {
        toast.error(mensagem, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true
        });
      }  
    
    
    render() {
        return (
        <div className="centerLogin">
        <div className="login-box">
        <Link to="/" className="logo">
            {/* <img src={logo} alt="logo" /> */}
        </Link>
        <br />
        <form>
            <div className="row">
            <div className="col-4 col-md-4">
                <div className="form-group">
                <label>E-mail</label>
                <input type="email"
                    name="email"
                    className="form-control"
                    value={this.state.formControls.email.value}
                    placeholder="Digite o seu e-mail..."
                    onChange={this.changeHandler} />
                </div>
            </div>
            <div className="col-4 col-md-4">
                <div className="form-group">
                <label>Password</label>
                <input type="password"
                    name="password"
                    className="form-control"
                    value={this.state.formControls.password.value}
                    placeholder="Digite a sua senha..."
                    onChange={this.changeHandler}
                />
                </div>
            </div>
            </div>
        </form>
        <div className="col-4 col-md-4">
                <button className="btn btn-primary" onClick={() => {this.login()}}>Entrar</button>
            </div>
        <ToastContainer />
        </div>
        <div>
        </div>
        </div>
   )
  }
}

export default FormLogin;