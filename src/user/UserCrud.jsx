import React, { Component } from 'react'
import Main from '../components/template/Main'
import axios from 'axios'

const headerProps = {
    icon: 'users',
    title: 'Membros',
    subtitle: 'Cadastro de membros: Incluir, Listar, Alterar e Excluir'
}

const initialState = {
    user: { name: '', email: '', cep: '', endereco: '', bairro: '',
            cidade: '', telefone: '', dataNascimento: '', numero: '',
            uf: '', sexo: '', estadoCivil: '', conjuge: '', complemento: '',
            escolaridade: '', profissao: ''},
    list: []
}

export default class UserCrud extends Component {

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
            axios.get(apiBaseUrl, config).then(resp => {
                this.setState({ list: resp.data.users })
            });
        }
    }

    clear() {
        this.setState( { user: initialState.user} )
    }

    save() {

        var baseURL = undefined;
        baseURL = this.retornarURL();
        //FIXME axios.defaults.headers.common['Authorization'] =  localStorage.getItem('token');
        const user  = this.state.user
        const method = user.id ? 'put' : 'post'
        const url = user.id ? `${baseURL}/${user.id}` : baseURL
        axios[method](url, user)
            .then(resp => {
                const list = this.getUpdatedList(resp.data)
                this.setState({ user: initialState.user, list })    
            })
    }

    buscarCEP() {
        const cep  = this.state.user.cep
        axios("https://viacep.com.br/ws/" + cep+"/json").then(resp => {
                console.log(resp.data.logradouro)
                var user = { ...this.state.user }
                user['endereco'] = resp.data.logradouro
                user['bairro'] = resp.data.bairro
                user['cidade'] = resp.data.localidade
                user['uf'] = resp.data.uf
                user['complemento'] = resp.data.complemento
                this.setState({ user })
        })
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

    /**
     * Interessante evoluir o estado e nao atualizá-lo diretamente
     * @param {event}
     */
    updateField(event){
        const user = { ...this.state.user }
        user[event.target.name] = event.target.value
        this.setState({ user })
    }

        /**
     * Interessante evoluir o estado e nao atualizá-lo diretamente
     * @param {event}
     */
    updateAdress(event){
        const user = { ...this.state.user }
        user[event.target.name] = event.target.value
        this.setState({ user })
    }

    load(user){
        this.setState({ user })
    }

    renderTable(){
        return(
            <table className="table mt-4">
                <thead>
                    <tr>
                        <th>Id</th>
                        <th>Nome</th>
                        <th>E-mail</th>
                        <th>Cep</th>
                        <th>Endereco</th>
                        <th>Cidade</th>
                        <th>Telefone</th>
                        <th>Data Nas</th>
                        <th>Sexo</th>
                        <th>Estado Civil</th>
                        <th>Conjuge</th>
                        <th>Escolaridade</th>
                        <th>Profissão</th>
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
        var url = window.location.href;
        if(url.includes('http://localhost:3000/')){
            console.log('localhost')
            baseURL = 'http://localhost:3001/membros'
        }else{
            console.log('cadastro membros')
            baseURL = 'https://cadastromembrosibbback.herokuapp.com/membros'
        }

        //FIXME axios.defaults.headers.common['Authorization'] =  localStorage.getItem('token');
        axios.delete(`${baseURL}/${user.id}`).then(resp => {
            const list = this.getUpdatedList(user, false)
            this.setState({list})
        })
    }

    renderForm() {
        return (
            <div className="form">
                <div className="row">
                    <div className="col-8 col-md-8">
                        <div className="form-group">
                            <label>Nome</label>
                            <input type="text" className="form-control"
                                name="name" value={this.state.user.name}
                                onChange={e => this.updateField(e)}
                                placeholder="Digite o nome..."/>
                        </div>
                    </div>
                </div>
                
                <div className="row">
                    <div className="col-2 col-md-2">
                        <div className="form-group">
                            <label>CEP</label>
                            <input type="text" className="form-control"
                            name="cep" 
                            value={this.state.user.cep}
                            onChange={e => this.updateAdress(e)}
                            placeholder="Digite o cep..."
                            />
                             <button className="btn btn-warning"
                                onClick={() => this.buscarCEP()}>
                                <i className="fa fa-search"></i>
                            </button    >
                        </div>
{/* 
                        <ViaCep cep={this.state.cep} lazy>
                        { ({ data, loading, error, fetch }) => {
                            if (loading) {
                            return <p>loading...</p>
                            }
                            if (error) {
                            return <p>error</p>
                            }
                            if (data) {
                            return <div>
                                <p>
                                CEP: {data.cep} <br/>
                                CIDADE: {data.localidade} <br/>
                                UF: {data.uf} <br/>
                                </p>
                            </div>
                            }
                            return <div>
                            <input onChange={this.handleChangeCep} value={this.state.cep} placeholder="CEP" type="text"/>
                            <button onClick={fetch}>Pesquisar</button>
                            </div>
                        }}
                        </ViaCep> */}


                    </div>
                </div>
                
                <div className="row">
                    <div className="col-6 col-md-6">
                        <div className="form-group">
                            <label>Endereço</label>
                            <input type="text" className="form-control"
                            name="endereco" 
                            value={this.state.user.endereco}
                            onChange={e => this.updateField(e)}
                            />
                        </div>
                    </div>

                    <div className="col-1 col-md-1">
                        <div className="form-group">
                            <label>Número</label>
                            <input type="text" className="form-control"
                                name="numero" value={this.state.user.numero}
                                onChange={e => this.updateField(e)}
                                />
                        </div>
                    </div>

                    <div className="col-2 col-md-2">
                        <div className="form-group">
                            <label>Bairro</label>
                            <input type="text" className="form-control"
                                name="bairro" value={this.state.user.bairro}
                                onChange={e => this.updateField(e)}
                                />
                        </div>
                    </div>
                </div>

                <div className="row">
                    <div className="col-3 col-md-3">
                        <div className="form-group">
                            <label>Complemento</label>
                            <input type="text" className="form-control"
                            name="complemento" 
                            value={this.state.user.complemento}
                            onChange={e => this.updateField(e)}
                            />
                        </div>
                    </div>

                    <div className="col-1 col-md-1">
                        <div className="form-group">
                            <label>UF</label>
                            <input type="text" className="form-control"
                            name="uf" 
                            value={this.state.user.uf}
                            onChange={e => this.updateField(e)}
                            />
                        </div>
                    </div>

                    <div className="col-2 col-md-2">
                        <div className="form-group">
                            <label>Cidade</label>
                            <input type="text" className="form-control"
                                name="cidade" value={this.state.user.cidade}
                                onChange={e => this.updateField(e)}
                                />
                        </div>
                    </div>
                </div>


                <div className="row">
                    <div className="col-3 col-md-3">
                        <div className="form-group">
                            <label>Telefone</label>
                            <input type="text" className="form-control"
                                name="telefone" value={this.state.user.telefone}
                                onChange={e => this.updateField(e)}
                                placeholder="Digite o telefone..."/>
                        </div>
                    </div>

                    <div className="col-3 col-md-3">
                        <div className="form-group">
                            <label>E-mail</label>
                            <input type="text" className="form-control"
                            name="email" 
                            value={this.state.user.email}
                            onChange={e => this.updateField(e)}
                            placeholder="Digite o email..."
                            />
                        </div>
                    </div>

                    <div className="col-2 col-md-2">
                        <div className="form-group">
                            <label>Data Nascimento</label>
                            <input type="date" className="form-control"
                                name="dataNascimento" value={this.state.user.dataNascimento}
                                onChange={e => this.updateField(e)}
                                placeholder="Digite a Data de nascimento..."/>
                        </div>
                    </div>

                </div>

                <div className="row">

                    <div className="col-1 col-md-1">
                        <div className="form-group">
                            <label>Sexo</label>
                            <input type="text" className="form-control"
                            name="sexo" 
                            value={this.state.user.sexo}
                            onChange={e => this.updateField(e)}
                            placeholder="Digite o sexo..."
                            />
                        </div>
                    </div>

                    <div className="col-2 col-md-2">
                        <div className="form-group">
                            <label>Estado Civil</label>
                            <input type="text" className="form-control"
                                name="estadoCivil" value={this.state.user.estadoCivil}
                                onChange={e => this.updateField(e)}
                                placeholder="Digite o estado civil..."/>
                        </div>
                    </div>
                </div>
                
                <div className="row">
                    <div className="col-8 col-md-8">
                        <div className="form-group">
                            <label>Nome Cônjuge</label>
                            <input type="text" className="form-control"
                            name="conjuge" 
                            value={this.state.user.conjuge}
                            onChange={e => this.updateField(e)}
                            placeholder="Digite o nome do conjuge..."
                            />
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-3 col-md-3">
                        <div className="form-group">
                            <label>Escolaridade</label>
                            <input type="text" className="form-control"
                                name="escolaridade" value={this.state.user.escolaridade}
                                onChange={e => this.updateField(e)} />
                        </div>
                    </div>

                    <div className="col-3 col-md-3">
                        <div className="form-group">
                            <label>Profissão</label>
                            <input type="text" className="form-control"
                            name="profissao" 
                            value={this.state.user.profissao}
                            onChange={e => this.updateField(e)}
                            />
                        </div>
                    </div>
                </div>
                <hr />
                <div className="row">
                    <div className="col-12 d-flex justify-content-end">
                        <button className="btn btn-primary"
                            onClick={e => this.save(e)}>
                            Salvar
                        </button>

                        <button className="btn btn-secondary ml-2"
                            onClick={e => this.clear(e)}>
                            Cancelar
                        </button>
                    </div>   
                </div>  
            </div>
            
        )
    }

    renderRows(){
        return this.state.list.map(user => {
            return (
                <tr key={user.id}>
                    <td>{user.id}</td>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>{user.cep}</td>
                    <td>{user.endereco}</td>
                    <td>{user.cidade}</td>
                    <td>{user.telefone}</td>
                    <td>{user.dataNascimento}</td>
                    <td>{user.sexo}</td>
                    <td>{user.estadoCivil}</td>
                    <td>{user.conjuge}</td>
                    <td>{user.escolaridade}</td>
                    <td>{user.profissao}</td>
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
        console.log(this.state.list)
        return (
            <Main {...headerProps}>
                {this.renderForm()}
                {this.renderTable()} 
            </Main>
        )
    }
}
