import React, { Component } from 'react'
import Main from '../components/template/Main'
import axios from 'axios'

const headerProps = {
    icon: 'users',
    title: 'Usuários',
    subtitle: 'Cadastro de usuários: Incluir, Listar, Alterar e Excluir'
}

const baseURL = 'http://localhost:3001/users'
const initialState = {
    user: {name: '', email: ''},
    list: []
}

export default class UserCrud extends Component {

    state = { ...initialState }

    clear() {
        
    }

    render() {
        return (
            <Main {...headerProps}>

            </Main>
        )
    }
}
