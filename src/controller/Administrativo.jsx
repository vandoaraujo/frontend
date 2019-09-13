import React, { Component } from 'react'
import Main from '../components/template/Main'
import axios from 'axios'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const headerProps = {
    icon: 'users',
    title: 'Administrativo',
    subtitle: 'Administração...'
}

export default class Administrativo
 extends Component {

    componentWillMount() {
        this.setState({ baseURL: this.retornarURL(),  config: this.obterApi() ,
            user : localStorage.getItem('userLogado') });
    }

    obterApi() {
        var config = {
            headers: { 'Authorization': localStorage.getItem('token')  }
        };
        return { config };
    }

    retornarURL(e){
        var url = window.location.href;
        if(url.includes('http://localhost:3000/')){
            console.log('localhost')
            return 'http://localhost:3001/930dca47b14ba687cdcb62469a3c95b5';
        }else{
            console.log('cadastro membros')
            return 'https://cadastromembrosibbback.herokuapp.com/930dca47b14ba687cdcb62469a3c95b5';
        }
    }

    efetuarBackup(user) {
        
        var config = {
            headers: {'Authorization': localStorage.getItem('token'), 'nickname': user}
        };

        axios['get'](this.state.baseURL, config)
            .then(resp => {
                this.setState({ backup: resp.data.backup })
                console.log(resp.data.backup)
                toast.success('Arquivo obtido com sucesso! ', {
                    position: "top-right",
                    autoClose: 6000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true
                });
            })
            .catch(error => {
                console.log("Ocorreu um erro..." + error);
            
                if (error.response) {
                    if(error.response.status == 500){
                        toast.error('Ocorreu um erro interno, contate o administrador!', {
                            position: "top-right",
                            autoClose: 5000,
                            hideProgressBar: false,
                            closeOnClick: true,
                            pauseOnHover: true,
                            draggable: true
                            });
                    }else{
                        toast.error('Acesso não autorizado!', {
                            position: "top-right",
                            autoClose: 5000,
                            hideProgressBar: false,
                            closeOnClick: true,
                            pauseOnHover: true,
                            draggable: true
                            });
                    }
                } else if (error.request) {
                    console.log(error.request);
                } else {
                    console.log('Error codigo...', error.message);
                }
            });
    }

        // quantidadeMembros(){
        //     if(this.state.backup && this.state.backup.length > 0 )
        //         return this.state.list
        //     else return 0;
        // }

        render() {
            return (
                <Main {...headerProps}>
                    <div className="form-group">
                        <label>Backup Base</label>
                        <button className="btn btn-warning ml-2"
                                onClick={() => this.efetuarBackup(this.state.user)}>
                                <i className="fa fa-database"></i>
                        </button>
                        <div></div>
                        {this.state.backup ?  this.state.backup : <div></div>}
                    </div>
                </Main>
            )
    }
}
