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


export default class Consulta
 extends Component {

    state = {}

    componentWillMount() {
        var apiBaseUrl = undefined;
        // apiBaseUrl = this.retornarURL();

        // if(localStorage.getItem('token') != null){
        //     var config = {
        //         headers: {'Authorization': localStorage.getItem('token')}
        //     };
        // }
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
