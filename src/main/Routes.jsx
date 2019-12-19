import axios from 'axios';
import React, { Component } from "react";
import { BrowserRouter as Router, Link, Redirect, Route, withRouter } from "react-router-dom";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import logoSistema from '../assets/imgs/churchA.jpg';
import App from '../main/App';
import Public from '../main/Public';

toast.configure()

const fakeAuth = {
  isAuthenticated: false,
  authenticate(cb) {
    this.isAuthenticated = true;
    setTimeout(cb, 100); // fake async
  },
  signout(cb) {
    this.isAuthenticated = false;
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
  
      axios.post(apiBaseUrl, payload)
      .then(response => {
        if (response.status === 200) {
          fakeAuth.authenticate(() => {
            this.setState({ ...this.state, redirectToReferrer: true, userLogado: response.data.user });
            localStorage.setItem('userLogado', response.data.user.username);
            localStorage.setItem('usuarioLogado', response.data.user.username);
            localStorage.setItem('token', response.data.token);
          });
        }
        else {
          this.emitirToasterErro('Ops, Usuario e/ou Senha inválidos...');
        }
      })
      .catch(error => {
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
      let re = /^(([^<>()\]\\.,;:\s@"]+(\.[^<>()\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      if (!re.test(email)) {
          this.emitirToasterErro('Favor preencher o email no formato válido...');
          return false;
      }
      return true;
    }
    return false;
  }        


  obterApiLogin(url) {
    var apiBaseUrl;
    if (url.includes('http://localhost:3000/')) {
      console.log('localhost');
      apiBaseUrl = 'http://localhost:3001/api-token-auth';
    }
    else {
      console.log('cadastro membros');
      apiBaseUrl = 'https://cadastromembrosibbback.herokuapp.com/api-token-auth';
    }
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
    let { redirectToReferrer } = this.state;

    if (redirectToReferrer) return <Redirect to={from}  />;

    return (
      <div className="centerLogin">
        <div className="login-box">
        <Link to="/" className="logo">
            {/* <img src={logo} alt="logo" /> */}
        </Link>
          <br />
          <form>
            <div className="row">
              <div className="col-12 col-md-6">
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
            </div>
            <div className="row">
              <div className="col-12 col-md-6">
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
            <hr />
          </form>
          <ToastContainer />
        </div>
        <button className="btn btn-primary" onClick={() => {this.login()}}>Entrar</button>
        <div>
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
          <button className="btn btn-dark"
          onClick={() => {
            fakeAuth.signout(() => history.push("/"));
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
          {/* <a target="_blank" rel="noopener noreferrer" href="http://www.igrejabatistanosbancarios.org.br">igrejabatistanosbancarios</a> */}
          <hr/>
          <h1 className="centerLogin">SISCAD</h1>
          <div className="col-12 d-flex justify-content-start">
            <img src={logoSistema} alt="logo" className="centerImagem"  />
          </div>
        </div>
      )
);

export default AuthExample;
