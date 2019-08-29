import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'font-awesome/css/font-awesome.min.css'
import React from 'react'
import { BrowserRouter } from 'react-router-dom'

import Routes from './Routes'
import Logo from '../components/template/Logo'
import Nav from '../components/template/Nav'
import Footer from '../components/template/Footer'
import Row from '../common/layout/row'
import Grid from '../common/layout/grid'
import Main from '../components/template/Main'

export default props =>
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
    
