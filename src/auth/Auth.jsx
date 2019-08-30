import './auth.css'
import React, { Component } from 'react'
import axios from 'axios'
import Row from '../common/layout/row'
import Grid from '../common/layout/grid'
import Main from '../components/template/Main'
import { ToastContainer, toast } from 'react-toastify';
import App from '../main/App';
import 'react-toastify/dist/ReactToastify.css';
import { Redirect } from 'react-router'
import { BrowserRouter as Router, Route, Link } from "react-router-dom";


toast.configure()

class Auth extends Component {

    constructor(props) {

        super(props)
        this.state = {
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

    render() {

        return (

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
                    <Row>
                        <Grid cols="4">
                            <button type="submit"
                                onClick={(event) => this.handleClick(event)}
                                className="btn btn-primary btn-block btn-flat">
                                Entrar
                            </button>
                        </Grid>
                    </Row>
                </form>
                <ToastContainer />
            </div>
        );
    }
}

export default Auth;
