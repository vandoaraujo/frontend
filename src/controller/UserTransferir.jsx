import axios from 'axios';
import React, { Component } from 'react';
import MaskedInput from 'react-text-mask';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Main from '../components/template/Main';
import { Redirect } from 'react-router-dom'
import ToastMessage from '../components/ToastMessage';

const headerProps = {
    icon: 'exchange',
    title: 'Transferir',
    subtitle: 'Transferir membro'
}

const initialState = {
    user: {
        name: '', motivoTransferencia: 0
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
            return 'http://localhost:3001/';
        } else {
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

    transferir(){
        var membro = this.state.user
        if (this.validarDados(membro)) {
            var { baseURL, config } = this.obterApi();
            membro.ativo = 0;
            axios['put'](baseURL+'membros/'+membro.id, membro, config)
            .then(resp => {
                (async () => {
                    const result = await fetch(
                        baseURL + 'membrosUpdated',
                        {
                            method: 'GET',
                            headers: { 'Authorization': localStorage.getItem('token') }
                        },
                    ).then(res => res.json())
                        .then(json => this.setState({ list: json.membros.membros }));
                })()
                this.retornarListaMembros()  
                this.emitirToast('success', 'Membro ' + membro.name  + ' transferido com sucesso! ')
                //Tentando resolver o bug do CACHE com o lowDB
            })
            .catch(error => {
                console.log("Ocorreu um erro..." + error);
                if (error.response) {
                    this.emitirToast('error', error.response.data);
                } else if (error.request) {
                console.log(error.request);
                } else {
                console.log('Error codigo...', error.message);
                }
            });
        }
    }

    validarDados(membro) {
        var erro = false
        if (!membro.motivoTransferencia) {
            erro = true;
            this.emitirToast('error', 'Selecione o motivo da transferência...');
        }
        if (erro)
            return false;
        return true
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
                    <div className="col-12 col-md-12">
                        <div className="form-group">
                            <h3>{this.state.user.name}</h3>
                        </div>
                    </div>
                </div>
                
                <div className="row">
                    <div className="col-6 col-md-6">
                        <div className="form-group">
                            <label>Motivo</label>
                            <select className="form-control" name="motivo"
                                value={this.state.user.motivoTransferencia}
                                onChange={e => this.updateField(e)} >
                                <option value="">Selecione o motivo...</option>
                                <option value="1">Pedido de carta</option>
                                <option value="2">Saída do Estado/País</option>
                                <option value="3">Falecimento</option>
                                <option value="4">Afastamento</option>
                                <option value="5">Outros</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div className="row">
                    <div className="col-6 col-md-6">
                        <div className="form-group">
                            <label>Observação</label>
                            <textarea name="observacao" className="form-control"
                                value={this.state.user.observacao}
                                onChange={e => this.updateField(e)} /> 
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
