import axios from 'axios';
import React, { Component } from 'react';
import MaskedInput from 'react-text-mask';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Main from '../components/template/Main';
import { Redirect } from 'react-router-dom'
import ToastMessage from '../components/ToastMessage';

const headerProps = {
    icon: 'address-card',
    title: 'Transferir',
    subtitle: 'Transferir membro'
}

const initialState = {
    user: {
        name: '', ativo: 1, motivoTransferencia: 0
    }
}

export default class UserTransferir extends Component {

    state = { ...initialState }

    componentWillMount() {
        this.buscarMembro();
    }

    buscarMembro() {
        if (this.props.location.state && this.props.location.state.userLoad) {
            var { baseURL, config } = this.obterApi();
            const url = `${baseURL}membros/${this.props.location.state.userLoad.id}`
            axios['get'](url, config)
                .then(resp => {
                    console.log('usuario banco' + resp.data)
                    this.setState({ user: resp.data });
                });
        }
    }

    retornarListaMembros() {
        this.setState({ retornarTelaMembros: true })
    }

    voltarTelaMembros() {
        if (this.state.retornarTelaMembros) {
            return <Redirect to={{
              pathname: '/membros',
              state: { user: undefined }
          }}  />
          }
    }

    retornarURL(e) {
        var url = window.location.href;
        if (url.includes('http://localhost:3000/')) {
            console.log('localhost')
            return 'http://localhost:3001/';
        } else {
            console.log('cadastro membros')
            return 'https://cadastromembrosibbback.herokuapp.com/';
        }
    }

    emitirToast(acao, mensagem) {
        toast[acao](mensagem, {
            position: "top-right",
            autoClose: 6000,
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
    

    /**
     * Interessante evoluir o estado e nao atualizá-lo diretamente
     * @param {event}
     */
    updateField(event) {
        const user = { ...this.state.user }
        user[event.target.name] = event.target.value
        this.setState({ user })
    }

    renderForm() {
        return (
            <div className="form">
                {this.voltarTelaMembros()}
                <div className="row">
                    <div className="col-8 col-md-8">
                        <div className="form-group">
                            <label>Nome</label>
                            <input type="text" className="form-control"
                                name="name" value={this.state.user.name}
                                onChange={e => this.updateField(e)}
                                placeholder="Digite o nome..." />
                        </div>
                    </div>
                </div>
                
                <div className="row">
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
                </div>

                <div className="row">
                    <div className="col-12 d-flex justify-content-start">
                        <button className="btn btn-primary"
                            onClick={e => this.transferir(e)}>
                            Transferir
                        </button>
                        <button className="btn btn-secondary ml-2"
                                onClick={e => this.retornarListaMembros(e)}>
                                Retornar
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
