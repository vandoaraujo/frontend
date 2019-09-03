import React, { Component } from 'react'
import Main from '../components/template/Main'
import axios from 'axios'
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const headerProps = {
    icon: 'users',
    title: 'Consulta',
    subtitle: 'Permite consultar dados específicos...'
}

const initialState = {
    user: { name: ''},
}


export default class Consulta
 extends Component {

    state = { ...initialState }

   updateField(event){
       const user = { ...this.state.user }
       user[event.target.name] = event.target.value
       this.setState({ user })
   }

    componentWillMount() {
        var apiBaseUrl = undefined;
        this.setState({ list: undefined })
    }

    renderFormConsulta() {
        return (
            <div className="form">
                <div className="row">
                    <div className="col-8 col-md-8">
                        <div className="form-group">
                            <label>Buscar por Nome</label>
                            <input type="text" className="form-control"
                                name="name" value={this.state.user.name}
                                onChange={e => this.updateField(e)}
                                placeholder="Digite o nome..."/>
                        </div>
                    </div>
                </div>
                <hr />
                <div className="row">
                    <div className="col-12 d-flex justify-content-start">
                        <button className="btn btn-primary"
                            onClick={e => this.buscar(e)}>
                            Buscar
                        </button>
                    </div>   
                </div>  
            </div>
        )
    }

    render() {
        return (
            <Main {...headerProps}>
                 {this.renderFormConsulta()} 
            </Main>
        )
    }
}
