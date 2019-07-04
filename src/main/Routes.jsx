import React, { Component } from "react";
import {
  BrowserRouter as Router,
  Route,
  Link,
  Redirect,
  withRouter
} from "react-router-dom";
import App from '../main/App';
import Main from '../components/template/Main'
import Public from '../main/Public'
import axios from 'axios'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


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
    var apiBaseUrl;
    if(url.includes('http://localhost:3000/')){
      console.log('localhost')
      apiBaseUrl = 'http://localhost:3001/api-token-auth'
    }else{
      console.log('cadastro membros')
      apiBaseUrl = 'https://cadastromembrosibbback.herokuapp.com/api-token-auth'
    }
        
    var payload = {
      email: this.state.formControls.email.value,
      password: this.state.formControls.password.value
    }

    axios.post(apiBaseUrl, payload)
    .then(response => {
      if (response.status === 200) {
        //FIXME axios.defaults.headers.common['Authorization'] = response.data.token;
        fakeAuth.authenticate(() => {
          this.setState({ ...this.state, redirectToReferrer: true, userLogado: response.data.user });
          localStorage.setItem('userLogado', response.data.user.username);
          localStorage.setItem('token', response.data.token);
        });
      }
      else if (response.status === 204) {
        
        toast('Usuario e Senha não conferem', {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true
          });
        
      }
      else {
        alert("Usuário não existe...")
      }
    })
    .catch(error => {
      console.log("Ocorreu um erro...500" + error);

      if (error.response) {
        console.log('Retorno 500...');
        toast(error.response.data, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true
          });
      } else if (error.request) {
        console.log(error.request);
      } else {
        console.log('Error codigo...', error.message);
      }
    });
        
  };

  render() {
    let { from } = this.props.location.state || { from: { pathname: "/" } };
    let { redirectToReferrer } = this.state;

    if (redirectToReferrer) return <Redirect to={from}  />;

    return (
      <div className="centerLogin">
        <div className="login-box">
          <Main icon="home" title=""
            subtitle="Login">
          </Main>
          <form>
            <div className="row">
              <div className="col-12 col-md-6">
                <div className="form-group">
                  <label>E-mail</label>
                  <input type="email"
                    name="email"
                    className="form-control"
                    value={this.state.formControls.email.value}
                    placeholder="Digite o e-mail..."
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
                    placeholder="Digite o password..."
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
      </div>
    );
  }
}

function AuthExample() {
  return (
    <Router>
      <div>
        <AuthButton />
        <ul>
          <li>
            <Link to="/public">Informações.</Link>
          </li>
          <li>
            <Link to="/protected">Login</Link>
          </li>
        </ul>
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
      <p>
        Bem-vindo, {localStorage.getItem('userLogado')}!
        <button
          onClick={() => {
            fakeAuth.signout(() => history.push("/"));
          }}
        >
          Sair
        </button>
      </p>
    ) : (
        <p>
          <a target="_blank" rel="noopener noreferrer" href="http://www.igrejabatistanosbancarios.org.br">Site da Igreja</a>
        </p>
      )
);

export default AuthExample;
