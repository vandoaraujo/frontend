import React, { Component } from 'react'
import Main from '../components/template/Main'
import axios from 'axios'
import 'react-toastify/dist/ReactToastify.css';

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

    state = { ...homeList }

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
            axios.get(apiBaseUrl, config).then(resp => {
                this.setState({ list: resp.data.users })
            });
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
    
    load(user){
        this.setState({ user })
    }

    renderTable(){
        return(
            <table className="table mt-4">
                <thead>
                    <tr>
                        <th>Nome</th>
                        <th>E-mail</th>
                        <th>Endereco</th>
                        <th>Telefone</th>
                        <th>Nascim</th>
                        <th>Ações</th>
                    </tr>
                </thead>
                <tbody>
                    {this.renderRows()}
                </tbody>
            </table>
        )
    }

    remove(user){
        var baseURL = undefined;
        baseURL = this.retornarURL();
        var config = {
            headers: {'Authorization': localStorage.getItem('token')}
        };
        axios.delete(`${baseURL}/${user.id}`, config).then(resp => {
            const list = this.getUpdatedList(user, false)
            this.setState({list})
        })
    }

    renderRows(){
        return this.state.list.map(user => {
            return (
                <tr key={user.id}>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>{user.endereco}</td>
                    <td>{user.telefone}</td>
                    <td>{user.dataNascimento}</td>
                    <td>
                        <button className="btn btn-warning"
                            onClick={() => this.load(user)}>
                            <i className="fa fa-pencil"></i>
                        </button    >
                    </td>
                    <td>
                        <button className="btn btn-danger ml-2"
                            onClick={() => this.remove(user)}>
                            <i className="fa fa-trash"></i>
                        </button>
                    </td>   
                </tr>
            )
        })
    }

    render() {
        return (
            <Main {...headerProps}>
                <div className="form-group">
                    <label>Quantidade de membros: </label>
                    <h3>{this.state.list.length}</h3>
                </div>
                {this.renderTable()} 
            </Main>
        )
    }
}