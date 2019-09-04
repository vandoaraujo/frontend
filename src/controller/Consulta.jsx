import React, { Component } from 'react'
import Main from '../components/template/Main'
import axios from 'axios'
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const headerProps = {
    icon: 'search',
    title: 'Consulta',
    subtitle: 'Permite consultar dados específicos...'
}

const consultaState = {
    user: { name: ''},
}


export default class Consulta
 extends Component {

    state = { ...consultaState }

   updateField(event){
       const user = { ...this.state.user }
       user[event.target.name] = event.target.value
       this.setState({ user })
   }

    componentWillMount() {
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

    buscar() {
        const user  = this.state.user
        if(this.validarDados(user)){
            var baseURL = undefined;
            //baseURL = this.retornarURL();
            var config = {
                headers: {'Authorization': localStorage.getItem('token')}
            };
            
            const url = user.id ? `${baseURL}/${user.id}` : baseURL
            axios['get'](url, user, config)
                .then(resp => {
                    //const list = this.getUpdatedList(resp.data)
                    //this.setState({ user: initialState.user, list })    
                })
        }
    }

    validarDados(user) {
        var erro = false
        if(!user.name){
            toast.error('Favor preencher o nome desejado...', {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true
                });
                erro = true
         }

        if(erro)
            return false;
     
        return true
    }



}
