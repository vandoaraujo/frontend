import React, { Component } from 'react'
import Main from '../components/template/Main'
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import constantes from '../common/constants'
import Popup from '../components/template/Popup'
import { Redirect } from 'react-router-dom'

const headerProps = {
    icon: 'search',
    title: 'Consulta',
    subtitle: 'Consulta por filtros específicos...'
}

const consultaState = {
    membro: { name: '', inativo: false }, list: []
}


export default class Consulta
    extends Component {

    state = { ...consultaState, admin: true, showPopup: false,  transferenciaMembro: false, }

    updateField(event) {
        const membroPesquisa = { ...this.state.membro }
        const target = event.target
        const value = target.type === 'checkbox' ? target.checked : target.value
        membroPesquisa[target.name] = value
        this.setState({ membro: membroPesquisa })
    }

    componentWillMount() {
        this.setState({msgRetorno: 'Efetue sua busca'})
    }

    renderFormConsulta() {
        return (
            <div className="form">
                <div className="row">
                    <div className="col-8 col-md-8">
                        <div className="form-group">
                            <label>Buscar por Nome</label>
                            <input type="text" className="form-control"
                                name="name" value={this.state.membro.name}
                                onChange={e => this.updateField(e)}
                                placeholder="Digite o nome..." />
                        </div>
                    </div>
                    <div className="col-4 col-md-4">
                        <div className="form-group">
                            <label>Inativo?</label>
                            <input type="checkbox"
                                name="inativo"
                                checked={this.state.membro.inativo}
                                onChange={e => this.updateField(e)}
                            />
                        </div>
                    </div>
                </div>
                <hr />
                <div className="row">
                    <div className="col-12 d-flex justify-content-start">
                        <button className="btn btn-primary"
                            onClick={e => this.buscar(e)}>
                            Buscar
                        </button>
                    </div>
                </div>
            </div>
        )
    }


    retornarURL(e) {
        var url = window.location.href;
        if (url.includes(constantes.API_BASE_LOCAL)) {
            return constantes.API_BASE_BACKEND;
        } else {
            return constantes.API_BASE_BACKEND_SERVER;
        }
    }

    render() {
        return (
            <Main {...headerProps}>
                {this.state.showPopup ?
                <Popup
                    text='Deseja realmente apagar?'
                    removerMembro={this.removerMembro.bind(this)}
                    closePopup={this.togglePopup.bind(this)} />
                : null
                }
                {this.renderFormConsulta()}
                {this.renderTable()}
            </Main>
        )
    }

    getUpdatedList(user, add = true) {
        const list = this.state.list.filter(u => u.id !== user.id)
        if (add) list.unshift(user)
        return list
    }

    setTransferenciaMembro = (user) => {
        this.setState({
            transferenciaMembro: true,
            user: user
        })
    }
    
    renderTransferenciaMembro() {
        if (this.state.transferenciaMembro) {
            return <Redirect to={{
                pathname: '/transferencia',
                state: { userLoad: this.state.user }
            }} />
        }
    }

    emitirToast(action, mensagem) {
        toast[action](mensagem, {
            position: "top-right",
            autoClose: 6000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true
        });
    }

    removerMembro() {
        var membroARemover = this.state.membroSelecionado
        var baseURL = undefined;
        baseURL = this.retornarURL();
        var config = {
            headers: { 'Authorization': localStorage.getItem('token') }
        };
        axios.delete(`${baseURL}membros/${membroARemover.id}`, config).then(resp => {
            this.togglePopup()
            if (resp.status > 200) {
                this.emitirToast('error', 'Ocorreu um erro ao remover o membro...');
            } else {
                const list = this.getUpdatedList(membroARemover, false)
                this.setState({ list })
                this.emitirToast('success', 'Membro ' + membroARemover.name + ' removido com sucesso! ');
                this.refreshListaMembros(baseURL);
            }
        }).catch(error => {
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


    efetuarBackup() {
        var config = {
            headers: {
                'Authorization': localStorage.getItem('token'),
                'email': 'vandoaraujo@hotmail.com', 'perfil': 777
            }
        };

        axios['get'](this.retornarURLBackup(), config)
            .then(resp => {
                var backup = resp.data.backup
            });
    }

    retornarURLBackup(e) {
        var url = window.location.href;
        if (url.includes(constantes.API_BASE_LOCAL)) {
            return constantes.API_BASE_BACKEND + constantes.APP_SECRET_KEY;
        } else {
            return constantes.API_BASE_BACKEND_SERVER + constantes.APP_SECRET_KEY
        }
    }

    buscar() {
        const membroFiltro = this.state.membro
        var ativo = !membroFiltro.inativo
        if (this.validarDados(membroFiltro)) {
            var apiBaseUrl = undefined;
            apiBaseUrl = this.retornarURL();
            if (localStorage.getItem('token') != null) {
                var config = {
                    headers: {
                        'Authorization': localStorage.getItem('token'),
                        'ativo': ativo,
                        'name': membroFiltro.name
                    }
                };
                axios['get'](apiBaseUrl + 'membrosConsulta', config)
                    .then(resp => {
                        console.log(resp.data.membros)
                        this.setState({ ...this.state, list: resp.data.membros, 
                            msgRetorno: resp.data.msgRetorno });
                    }).catch(error => {
                        console.log("Ocorreu um erro..." + error);
                        if (error.response) {
                            this.setState({ ...this.state, list: [], 
                                msgRetorno: 'Busca sem Registros...' });
                            this.emitirToastErro(error.response.data.msgRetorno);
                        } else if (error.request) {
                            console.log(error.request);
                        } else {
                            console.log('Error codigo...', error.message);
                        }
                    });
            }
        }
    }

    emitirToastErro(erro) {
        toast.error(erro, {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true
        });
    }


    validarDados(user) {
        var erro = false
        if (!user.inativo && !user.name) {
            toast.error('Favor preencher o nome desejado...', {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true
            });
            erro = true
        }

        if (erro)
            return false;

        return true
    }

    setEdicaoMembro = (user) => {
        this.setState({
            edicaoMembro: true,
            user: user
        })
    }

    load(user) {
        this.setEdicaoMembro(user)
    }

    togglePopup(membro) {
        this.setState({
            showPopup: !this.state.showPopup,
            membroSelecionado: membro
        });
    }

    loadTransferencia(user) {
        this.setTransferenciaMembro(user)
    }





    renderTable() {
        return (
            <div>
                {this.renderTransferenciaMembro()}

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

    renderRows() {
        return this.state.list.length !== 0 ? this.state.list.map(user => {

            return (
                <tr key={user.id}>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>{user.telefone}</td>
                    {this.state.admin ?
                        <td>
                            <button title="Editar" className="btn btn-info"
                                onClick={() => this.load(user)}>
                                <i className="fa fa-pencil"></i>
                            </button    >
                            <button title="Transferir" className="btn btn-warning ml-2"
                                onClick={() => this.loadTransferencia(user)}>
                                <i className="fa fa-cut"></i>
                            </button>
                            <button title="Excluir" className="btn btn-danger ml-2"
                                onClick={this.togglePopup.bind(this, user)}>
                                <i className="fa fa-trash"></i>
                            </button>
                        </td>
                        :null
                    }
                </tr>
            )
        }) :
            <tr>
                <td>
                    {this.state.msgRetorno}
                </td>
            </tr>
    }


}
