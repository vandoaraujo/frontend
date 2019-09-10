import axios from 'axios';
import React, { Component } from 'react';
import MaskedInput from 'react-text-mask';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Main from '../components/template/Main';
import ToastMessage from '../components/ToastMessage';

const headerProps = {
    icon: 'address-card',
    title: 'Cadastro',
    subtitle: 'Incluir membro'
}

const initialState = {
    user: { name: '', email: '', cep: '', endereco: '', bairro: '',
            cidade: '', telefone: '', dataNascimento: '', numero: '',
            uf: '', sexo: '', estadoCivil: '', conjuge: '', complemento: '',
            escolaridade: '', profissao: '', ativo: 1},
    list: []
}

export default class UserCrud extends Component {

    state = { ...initialState }

    componentWillMount() {
        this.setState({ list: undefined })
        //obter no load do componente HomeList o usar passado.
        this.buscarMembro();
        
    }

    buscarMembro() {
        if (this.props.location.state && this.props.location.state.userLoad) {
            var { baseURL, config } = this.obterApi();
            const url = `${baseURL}/${this.props.location.state.userLoad.id}`
            console.log(url)
            axios['get'](url, config)
                .then(resp => {
                    console.log('usuario banco' + resp.data)
                    this.setState({ user: resp.data });
                });
        }
    }

    clear() {
        this.setState( { user: initialState.user} )
    }

    retornarURL(e){
        var url = window.location.href;
        if(url.includes('http://localhost:3000/')){
            console.log('localhost')
            return 'http://localhost:3001/membros';
        }else{
            console.log('cadastro membros')
            return 'https://cadastromembrosibbback.herokuapp.com/membros';
        }
    }

    save() {
        const user  = this.state.user
        if(this.validarDados(user)){
            var { baseURL, config } = this.obterApi();
            const method = user.id ? 'put' : 'post'
            const url = user.id ? `${baseURL}/${user.id}` : baseURL
            axios[method](url, user, config)
                .then(resp => {
                    this.setState({ user: initialState.user })    
                    toast.success('Membro cadastrado com sucesso! ', {
                        position: "top-right",
                        autoClose: 6000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true
                    });
                })
        }
    }

    obterApi() {
        var baseURL = undefined;
        baseURL = this.retornarURL();
        var config = {
            headers: { 'Authorization': localStorage.getItem('token') }
        };
        return { baseURL, config };
    }

    buscarCEP() {
        const cep  = this.state.user.cep
        axios("https://viacep.com.br/ws/" + cep+"/json").then(resp => {
            console.log(resp.data.erro)
                if(resp.data.erro){
                    toast.error('Cep inexistente! ', {
                        position: "top-right",
                        autoClose: 6000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true
                    });
                }else{
                    var user = { ...this.state.user }
                    user['endereco'] = resp.data.logradouro
                    user['bairro'] = resp.data.bairro
                    user['cidade'] = resp.data.localidade
                    user['uf'] = resp.data.uf
                    user['complemento'] = resp.data.complemento
                    this.setState({ user })
                }
        })
        .catch(error => {
          console.log("Ocorreu um erro ao buscar o CEP" + error);
    
          if (error.response) {
            console.log('Retorno 500...');
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

    /**
     * 
     * Removo usuario da lista e adiciono o novo criando uma lista nova
     * @param user 
     */
    // getUpdatedList(user, add = true) {
    //     const list = this.state.list.filter(u => u.id !== user.id)
    //     if(add) list.unshift(user)
    //     return list
    // }

    validarDados(user) {
        var erro = false
        if(!user.name){
            toast.error('O campo nome não pode ficar vazio...', {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true
                });
                erro = true
         }

         if(!user.cep){
            toast.error('O campo cep não pode ficar vazio...', {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true
                });
                erro = true
         }

         if(!user.sexo){
            toast.error('O campo Sexo não pode ficar vazio...', {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true
                });
                erro = true
         }

         if(!user.uf){
            toast.error('Favor informar a UF(estado)...', {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true
                });
                erro = true
         }

         if(!user.estadoCivil){
            toast.error('O campo Estado Civil não pode ficar vazio...', {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true
                });
                erro = true
         }

         if(user.email){

            let re = /^(([^<>()\]\\.,;:\s@"]+(\.[^<>()\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

            if (! re.test(user.email) ) {
                toast.error('O campo email inválido...', {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true
                    });
                    erro = true
            }
         }

         if(erro)
            return false;
        
        return true
    }

    /**
     * Interessante evoluir o estado e nao atualizá-lo diretamente
     * @param {event}
     */
    updateField(event){
        const user = { ...this.state.user }
        user[event.target.name] = event.target.value
        this.setState({ user })
        if(event.target.name === 'estadoCivil'){
            if(event.target.value === 'Casado'){
                this.setState({ showConjuge: true })
            } else{
                this.setState({ showConjuge: false })
                user['conjuge'] = '';
                this.setState({ user })
            }    
        }
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
                    <div className="col-2 col-md-">
                        <div className="form-group">
                            <label>CEP</label>
                            <MaskedInput
                            mask={[/\d/, /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/]}
                            className="form-control"
                            placeholder="Enter cep"
                            guide={false}
                            value={this.state.user.cep}
                            name="cep"
                            onChange={e => this.updateAdress(e)}/>
                           
                        </div>
                    </div>

                    <div className="col-1 col-md-1">
                        <div className="form-group">
                            <label>Consultar</label>
                            <button className="btn btn-warning"
                                onClick={() => this.buscarCEP()}>
                                <i className="fa fa-search"></i>
                            </button>
                        </div>
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

                    <div className="col-2 col-md-2">
                        <div className="form-group">
                            <label>UF</label>
                            <select className="form-control" name="uf"
                            value={this.state.user.uf} 
                            onChange={e => this.updateField(e)} >
                                <option value="">Selecione...</option>
                                <option value="AC">Acre</option>
                                <option value="AL">Alagoas</option>
                                <option value="AP">Amapá</option>
                                <option value="AM">Amazonas</option>
                                <option value="BA">Bahia</option>
                                <option value="CE">Ceará</option>
                                <option value="DF">Distrito Federal</option>
                                <option value="ES">Espírito Santo</option>
                                <option value="GO">Goiás</option>
                                <option value="MA">Maranhão</option>
                                <option value="MT">Mato Grosso</option>
                                <option value="MS">Mato Grosso do Sul</option>
                                <option value="MG">Minas Gerais</option>
                                <option value="PA">Pará</option>
                                <option value="PB">Paraíba</option>
                                <option value="PR">Paraná</option>
                                <option value="PE">Pernambuco</option>
                                <option value="PI">Piauí</option>
                                <option value="RJ">RJ</option>
                                <option value="RN">Rio Grande do Norte</option>
                                <option value="RS">Rio Grande do Sul</option>
                                <option value="RO">Rondônia</option>
                                <option value="RR">Roraima</option>
                                <option value="SC">Santa Catarina</option>
                                <option value="SP">São Paulo</option>
                                <option value="SE">Sergipe</option>
                                <option value="TO">Tocantins</option>
                                <option value="ES">Estrangeiro</option>
                            </select>
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
                            <label>Celular</label>
                            <MaskedInput
                            mask={['(', /[1-9]/, /\d/, ')', ' ', /\d/, ' ', /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/]}
                            className="form-control"
                            placeholder="Digite o celular"
                            guide={false}
                            value={this.state.user.telefone}
                            name="telefone"
                            onChange={e => this.updateAdress(e)}/>

                        </div>
                    </div>

                    <div className="col-3 col-md-3">
                        <div className="form-group">
                            <label>E-mail</label>
                            <input type="email" className="form-control"
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
                    <div className="col-2 col-md-2">
                        <div className="form-group">
                            <label>Sexo</label>
                            <select className="form-control"
                                name="sexo" value={this.state.user.sexo}
                                onChange={e => this.updateField(e)} >
                                <option value="">Informe...</option>
                                <option value="M">Masculino</option>
                                <option value="F">Feminino</option>
                            </select>
                            
                        </div>
                    </div>

                    <div className="col-2 col-md-2">
                        <div className="form-group">
                            <label>Estado Civil</label>
                            <select className="form-control" name="estadoCivil"
                             value={this.state.user.estadoCivil}
                                onChange={e => this.updateField(e)} >
                                <option value="">Informe...</option>
                                <option value="Solteiro">Solteiro</option>
                                <option value="Casado">Casado</option>
                                <option value="Separado">Separado</option>
                                <option value="Divorciado">Divorciado</option>
                                <option value="Viúvo">Viúvo</option>
                                <option value="Amasiado">Amasiado</option>
                            </select>
                        </div>
                    </div>
                </div>
                
                { this.state.showConjuge ? 
                
                <div className="row" >
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
                
                : null }

                
                <div className="row">
                    <div className="col-3 col-md-3">
                        <div className="form-group">
                            <label>Escolaridade</label>
                            <select className="form-control" name="escolaridade"
                                value={this.state.user.escolaridade}
                                onChange={e => this.updateField(e)}>
                                <option value="">Informe...</option>
                                <option value="ensino-fundamental">Ensino fundamental</option>
                                <option value="ensino-fundamental-incompleto">Ensino fundamental incompleto</option>
                                <option value="ensino-medio">Ensino médio</option>
                                <option value="ensino-medio-incompleto">Ensino médio incompleto</option>
                                <option value="ensino-superior">Ensino superior</option>
                                <option value="ensino-superior-incompleto">Ensino superior incompleto</option>
                            </select>
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
                    <div className="col-12 d-flex justify-content-start">
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

    render() {
        return (
            <Main {...headerProps}>
                {this.renderForm()}
            </Main>
        )
    }
}
