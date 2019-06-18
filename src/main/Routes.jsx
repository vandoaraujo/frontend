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
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios'

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

function Public() {
  return <h3>Public</h3>;
}

function Protected() {
  return <App/>;
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
    var apiBaseUrl = 'https://cadastromembrosibbback.herokuapp.com/api-token-auth'
    //var apiBaseUrl = 'http://localhost:3001/api-token-auth'

    var payload = {
      email: this.state.formControls.email.value,
      password: this.state.formControls.password.value
    }

    axios.post(apiBaseUrl, payload)
    .then(response => {
      if (response.status === 200) {
        axios.defaults.headers.common['Authorization'] = response.data.token;
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
      <div>
        <p>Preencha seu usuario e senha para entrar {from.pathname}</p>
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
        <button onClick={() => {this.login()}}>Log in</button>
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
            <Link to="/public">Public Page</Link>
          </li>
          <li>
            <Link to="/protected">Protected Page</Link>
          </li>
        </ul>
        <Route path="/public" component={Public} />
        <Route path="/login" component={Login} />
        <PrivateRoute path="/protected" component={Protected} />
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
        <p>Clique no link para efetuar o login no sistema</p>
      )
);

export default AuthExample;
