import React, { Component } from 'react'
import Main from '../components/template/Main'
import axios from 'axios'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import MaskedInput from 'react-text-mask'

const headerProps = {
    icon: 'users',
    title: 'Consulta',
    subtitle: 'Permite consultar dados específicos...'
}


export default class Consulta
 extends Component {

    state = { ...initialState }

    retornarURL(e){
        var url = window.location.href;
        if(url.includes('http://localhost:3000/')){
            console.log('localhost')
            return 'http://localhost:3001/membros'
        }else{
            console.log('cadastro membros')
            return 'https://cadastromembrosibbback.herokuapp.com/membros'
        }
    }

    componentWillMount() {
        var apiBaseUrl = undefined;
        apiBaseUrl = this.retornarURL();

        if(localStorage.getItem('token') != null){
            var config = {
                headers: {'Authorization': localStorage.getItem('token')}
            };
        }
    }

    render() {
        return (
            <Main {...headerProps}>
                <div className="form-group">
                    <label>Consulta </label>
                </div>
            </Main>
        )
    }
}
