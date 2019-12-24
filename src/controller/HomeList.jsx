import React, { Component } from 'react'
import Main from '../components/template/Main'
import axios from 'axios'
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Redirect } from 'react-router-dom'
import constantes from '../common/constants'


const fetch = require("node-fetch");

const headerProps = {
    icon: 'users',
    title: 'Membros',
    subtitle: 'Lista de membros'
}

const homeList = {
    user: { name: '', email: '', cep: '', endereco: '', bairro: '',
            cidade: '', telefone: '', dataNascimento: '', numero: '',
            uf: '', sexo: '', estadoCivil: '', conjuge: '', complemento: '',
            escolaridade: '', profissao: ''},
    list: []
}

export default class HomeList extends Component {
    
    state = { ...homeList, edicaoMembro: false, admin: false }

    componentWillMount() {
        var apiBaseUrl = undefined;
        apiBaseUrl = this.retornarURL();
        if(localStorage.getItem('token') != null){
            (async () => {
                await fetch(
                    apiBaseUrl+'membros',
                    {
                    method: 'GET',
                    headers: { 'Authorization': localStorage.getItem('token') }
                    },
                ).then(res => res.json())
                .then(json => this.setState({ list: json.membros.sort(this.compare) }));
            })()
        }

        var { baseURL, config } = this.getURLUsers();
        const url = `${baseURL}/`+localStorage.getItem('user_id')
        axios['get'](url, config)
            .then(resp => {
                if (constantes.PERFIL_SUPER_USER === resp.data.perfil ) {
                    this.setState({ ...this.state, admin: true});
                }
            });
    }

    getURLUsers() {
        var baseURL = undefined;
        var url = window.location.href;
        url.includes(constantes.API_BASE_LOCAL) === true ? baseURL = constantes.API_BASE_BACKEND+'users' : 
        baseURL = constantes.API_BASE_BACKEND_SERVER+'users';
        var config = {
            headers: { 'Authorization': localStorage.getItem('token') }
        };
        return { baseURL, config };
    }

    compare(a, b) {
        // Use toUpperCase() to ignore character casing
        const nameA = a.name.toUpperCase();
        const nameB = b.name.toUpperCase();
      
        let comparison = 0;
        if (nameA > nameB) {
          comparison = 1;
        } else if (nameA < nameB) {
          comparison = -1;
        }
        return comparison;
      }

    retornarURL(e){
        var url = window.location.href;
        if(url.includes(constantes.API_BASE_LOCAL)){
            console.log('localhost')
            return constantes.API_BASE_BACKEND;
        }else{
            console.log('cadastro membros')
            return constantes.API_BASE_BACKEND_SERVER;
        }
    }
    /**
     * 
     * Removo usuario da lista e adiciono o novo criando uma lista nova
     * @param user 
     */
    getUpdatedList(user, add = true) {
        const list = this.state.list.filter(u => u.id !== user.id)
        if(add) list.unshift(user)
        return list
    }

    setEdicaoMembro = (user) => {
        this.setState({
          edicaoMembro: true,
          user: user
        })
    }
    
    load(user){
        this.setEdicaoMembro(user)
    }

    renderEdicaoMembro () {
        if (this.state.edicaoMembro) {
          return <Redirect to={{
            pathname: '/cadastro',
            state: { userLoad: this.state.user }
        }}  />
        }
      }

    renderTable(){
        return(
            <div>
                {this.renderEdicaoMembro()}
                <table className="table mt-4">
                    <thead>
                        <tr>
                            <th>Nome</th>
                            <th>E-mail</th>
                            <th>Telefone</th>
                            {this.state.admin ? <th>Ações</th> : null}
                        </tr>
                    </thead>
                    <tbody>
                        {this.renderRows()}
                    </tbody>
                </table>
            </div>
        )
    }

    remove(user){
        var baseURL = undefined;
        baseURL = this.retornarURL();
        var config = {
            headers: {'Authorization': localStorage.getItem('token')}
        };
        axios.delete(`${baseURL}membros/${user.id}`, config).then(resp => {
            if(resp.status > 200){
                this.emitirToastErro('Ocorreu um erro ao remover o membro...');
            }else{
                const list = this.getUpdatedList(user, false)
                this.setState({list})
                this.emitirToastSucesso('Membro ' + user.name + ' removido com sucesso! ');
                this.refreshListaMembros(baseURL);    
            }
            
        })
        .catch(error => {
            console.log("Ocorreu um erro..." + error);
            if (error.response) {
              this.emitirToastErro(error.response.data);
            } else if (error.request) {
              console.log(error.request);
            } else {
              console.log('Error codigo...', error.message);
            }
          });
    }

    refreshListaMembros(baseURL) {
        (async () => {
            await fetch(baseURL + 'membrosUpdated', {
                method: 'GET',
                headers: { 'Authorization': localStorage.getItem('token') }
            }).then(res => res.json())
                .then(json => this.setState({ newList: json.membros.membros }));
        })();
    }

    emitirToastSucesso(mensagem) {
        toast.success(mensagem, {
            position: "top-right",
            autoClose: 6000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true
        });
    }

    emitirToastErro(mensagem) {
        toast.error(mensagem, {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true
        });
    }

    obterApi() {
        var baseURL = undefined;
        baseURL = this.retornarURL();
        var config = {
            headers: { 'Authorization': localStorage.getItem('token') }
        };
        return { baseURL, config };
    }

    transferir(user){
        var { baseURL, config } = this.obterApi();
        user['ativo'] = 0;
        axios['put'](baseURL+'membros/'+user.id, user, config)
        .then(resp => {
            const list = this.getUpdatedList(user, false)
            this.setState({list})
            this.emitirToastSucesso('Membro ' + user.name  + ' desvinculado com sucesso! ');    
            //Tentando resolver o bug do CACHE com o lowDB
            this.refreshListaMembros(baseURL); 
        })
        .catch(error => {
            console.log("Ocorreu um erro..." + error);
            if (error.response) {
                this.emitirToastErro(error.response.data);
            } else if (error.request) {
              console.log(error.request);
            } else {
              console.log('Error codigo...', error.message);
            }
          });
    }

    renderRows(){
        return  this.state.list ? this.state.list.map(user => {
            return (
                <tr key={user.id}>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>{user.telefone}</td>
                    {this.state.admin ?
                    <td>
                        <button className="btn btn-info"
                            onClick={() => this.load(user)}>
                            <i className="fa fa-pencil"></i>
                        </button    >
                        <button className="btn btn-warning ml-2"
                            onClick={() => this.transferir(user)}>
                            <i className="fa fa-cut"></i>
                        </button>
                        <button className="btn btn-danger ml-2"
                            onClick={() => this.remove(user)}>
                            <i className="fa fa-trash"></i>
                        </button>

                    </td>  
                         : null
                    }
                </tr>
            )
        }) : 'Não há membros cadastrados...'
    }

    quantidadeMembros(){
        if(this.state.list && this.state.list.length > 0 )
            return this.state.list.length
        else return 0;
    }
    

    render() {
        return (
            <Main {...headerProps}>
                <div className="form-group">
                    <label>Quantidade de membros: </label>
                    <h3>{this.quantidadeMembros()}</h3>
                </div>
                {this.renderTable()} 
            </Main>
        )
    }
}
