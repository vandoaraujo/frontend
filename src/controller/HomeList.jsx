import React, { Component } from 'react'
import Main from '../components/template/Main'
import axios from 'axios'
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Redirect } from 'react-router-dom'
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

export default class HomeList
 extends Component {
    
    state = { ...homeList, edicaoMembro: false }

    componentWillMount() {
        var apiBaseUrl = undefined;
        apiBaseUrl = this.retornarURL();

        if(localStorage.getItem('token') != null){
            var config = {
                headers: {'Authorization': localStorage.getItem('token')}
            };

            // axios.get(apiBaseUrl, config).then(resp => {
            //     this.setState({ list: resp.data.membros.membros.sort(this.compare) })
            // });
            (async () => {
                const result = await fetch(
                    apiBaseUrl,
                    {
                    method: 'GET',
                    headers: { 'Authorization': localStorage.getItem('token') }
                    },
                ).then(res => res.json())
                .then(json => this.setState({ list: json.membros }));
            })()
        }
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
        if(url.includes('http://localhost:3000/')){
            console.log('localhost')
            return 'http://localhost:3001/membros'
        }else{
            console.log('cadastro membros')
            return 'https://cadastromembrosibbback.herokuapp.com/membros'
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
                            <th>Ações</th>
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
        axios.delete(`${baseURL}/${user.id}`, config).then(resp => {
            console.log(resp)
            if(resp.status > 200){
                toast.error('Ocorreu um erro ao remover o membro...', {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true
                    });
            }else{
                const list = this.getUpdatedList(user, false)
                this.setState({list})
                toast.success('Membro ' + user.name  + ' removido com sucesso! ', {
                position: "top-right",
                autoClose: 6000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true
            });    
            }
            
        })
        .catch(error => {
            console.log("Ocorreu um erro..." + error);
      
            if (error.response) {
              toast.error(error.response.data, {
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
        const method = 'put'
        const url = user.id ? `${baseURL}/${user.id}` : baseURL
        user['ativo'] = 0;
        axios[method](url, user, config)
        .then(resp => {
            const list = this.getUpdatedList(user, false)
            this.setState({list})
            toast.success('Membro ' + user.name  + ' desvinculado com sucesso! ', {
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
              toast.error(error.response.data, {
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


    }

    renderRows(){
        return  this.state.list ? this.state.list.map(user => {
            return (
                <tr key={user.id}>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>{user.telefone}</td>
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
