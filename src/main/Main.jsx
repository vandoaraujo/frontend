import axios from 'axios';
import React, { Component } from "react";
import { BrowserRouter as Router, Link, Redirect, Route, withRouter } from "react-router-dom";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import App from './App';
import Public from './Public';
import constantes from '../common/constants'
import TrocarPassword from '../controller/TrocarPassword';
import * as moment from 'moment';
import 'moment/locale/pt-br';

toast.configure()

const fakeAuth = {
  isAuthenticated: false,
  authenticate(cb) {
    this.isAuthenticated = true;
    setTimeout(cb, 100); // fake async
  },
  signout(cb) {
    this.isAuthenticated = false;
    localStorage.removeItem('nomeUsuario')
    localStorage.removeItem('token')
    localStorage.removeItem('user_id');
    localStorage.removeItem('ultimoLogin');
    setTimeout(cb, 100);
  }
};

function PrivateRoute({ component: Component, ...rest }) {
  return (
    <Route
      {...rest}
      render={props =>
        fakeAuth.isAuthenticated ? (
          <Component {...props} />
        ) : (
            <Redirect
              to={{
                pathname: "/login",
                state: { from: props.location }
              }}
            />
          )
      }
    />
  );
}

class Login extends Component {

  constructor(props) {
    super(props)
    this.state = this.initialState
    this.init()
  }

  get initialState() {
    return {
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

  init = (e) => {
    var urlBase = this.obterApiLogin(window.location.href);
    axios.get(urlBase.concat('estatistica/1'))
      .then(resp => {
        var incremento = resp.data.count + 1;
        var payload = {
          count: incremento
        }
        axios.put(urlBase.concat('estatistica/1'), payload)
          .then(response => {
          })
      })

  };

  login = (e) => {
    axios.defaults.headers.post['Content-Type'] = 'application/json';
    var urlBase = this.obterApiLogin(window.location.href);
    if (this.validarEmail(this.state.formControls.email.value)) {
      var payload = {
        email: this.state.formControls.email.value,
        password: this.state.formControls.password.value
      }
      axios.post(urlBase.concat('api-token-auth'), payload)
        .then(response => {
          if (response.status === 200) {
            fakeAuth.authenticate(() => {
              this.informacoesUsuarioBuilder(response);
            });
          } else {
            this.emitirToasterErro('Ops, Usuario e/ou Senha inválidos...');
          }
        }).catch(error => {
          console.log("Ocorreu um erro... " + error);
          if (error.response) {
            console.log('ocorreu um erro no response....')
            this.emitirToasterErro(error.response.data);
          } else if (error.request) {
            this.emitirToasterErro('Ocorreu um erro interno ao tentar efetuar o login...');
          } else {
            console.log('Error codigo...', error.message);
          }
        });
    }
  };

  informacoesUsuarioBuilder(response) {

    this.setState({
      ...this.state,
      usuarioLogado: response.data.user.userName,
      primeiroAcesso: response.data.user.primeiroAcesso
    });

    localStorage.removeItem('user_id');
    localStorage.removeItem('nomeUsuario');
    localStorage.removeItem('token');
    localStorage.removeItem('ultimoLogin')
    localStorage.setItem('user_id', response.data.user.id);
    localStorage.setItem('nomeUsuario', response.data.user.userName);
    localStorage.setItem('token', response.data.token);
    console.log(response.data.user.ultimoLogin)
    if (response.data.user.primeiroAcesso === 0)
      localStorage.setItem('ultimoLogin', response.data.user.ultimoLogin);

  }

  validarEmail(email) {
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
    let { from } = this.props.location.state || { from: { pathname: "/" } };

    if (this.state.usuarioLogado && this.state.primeiroAcesso) {
      return <Redirect to={{
        pathname: '/trocarPassword',
        state: { usuarioLogado: this.state.usuarioLogado }
      }} />
    }

    else if (this.state.usuarioLogado) {
      return <Redirect to={from} usuarioLogado={this.state.usuarioLogado} />;
    }

    return (
      <div className="limiter">
        <div className="container-login100">
          <div className="wrap-login100">
            <div className="login100-form-title-img">
              <span className="login100-form-title-1">
                SISCAD
            </span>
            </div>
            <form className="login100-form validate-form">
              <div className="wrap-input100 validate-input m-b-26">
                <span className="label-input100">E-mail</span>
                <input type="email"
                  name="email"
                  className="input100"
                  value={this.state.formControls.email.value}
                  placeholder="Digite o seu e-mail..."
                  onChange={this.changeHandler} />
                <span className="focus-input100"></span>
              </div>

              <div className="wrap-input100 validate-input m-b-18">
                <span className="label-input100">Password</span>
                <input type="password"
                  name="password"
                  className="input100"
                  value={this.state.formControls.password.value}
                  placeholder="Digite a sua senha..."
                  onChange={this.changeHandler}
                />
                <span className="focus-input100"></span>
              </div>
            </form>
            <div className="container-login100-form-btn">
              <button className="login100-form-btn" onClick={() => { this.login() }}>Login</button>
            </div>
            <ToastContainer />
          </div>
        </div>
      </div>

    );
  }
}

function AuthExample() {
  return (
    <Router>
      <div>
        <AuthButton />
        <Route path="/public" component={Public} />
        <Route path="/login" component={Login} />
        <PrivateRoute path="/trocarPassword" component={TrocarPassword} />
        <PrivateRoute path="/protected" component={App} />
      </div>
    </Router>
  );
}


/**Cabecalho da pagina */
const AuthButton = withRouter(
  ({ history }) =>
    fakeAuth.isAuthenticated ? (

      <div className="col-12 d-flex justify-content-start">
        <DataHora />
        <button className="btn btn-dark"
          onClick={() => {
            fakeAuth.signout(() => history.push("/login"));
          }}

        > <i className="fa fa-sign-out" aria-hidden="true">Sair</i>
        </button>
      </div>
    ) : (
        <div>
          {/* <Link to="/public">Manual de Uso</Link> */}
          <div className="col-12 d-flex justify-content-start">
            <Link to="/protected" className="btn btn-dark">Acessar</Link>
          </div>
          <a target="_blank" rel="noopener noreferrer" href="http://www.igrejabatistanosbancarios.org.br">igrejabatistanosbancarios</a>
        </div>
      )
);

export default AuthExample;

class DataHora extends Component {

  render() {
    return (
      <div className="form">
        <div className="row">
          <div className="col-12 col-md-12">
            <div className="form-group">
              <p>{this.exibeDataHora()}</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  exibeDataHora(){
    moment.locale('pt-BR');
    return moment().format('LLL')
  }
}


