// import { toastr } from 'react-redux-toastr'
import axios from 'axios'
import consts from '../consts'

export function login(values) {
    var retorno = submit(values, `${consts.OAPI_URL}api-token-auth`)
    console.log('Retorno function Login' + retorno)
    return retorno
}

// export function signup(values) {
//     return submit(values, `${consts.OAPI_URL}/signup`)
// }

function submit(values, url) {
    


    // return dispatch => {
    //     axios.post(url, values)
    //         .then(resp => {
    //             dispatch([
    //                 { payload: resp.data }
    //                 // { type: 'USER_FETCHED', payload: resp.data }
    //             ])
    //         })
    //         .catch(e => {
    //             e.response.data.errors.forEach(
    //                 error => console.log('Erro', error))
    //         })
}

export function logout() {
    return { type: 'TOKEN_VALIDATED', payload: false }
}

export function validateToken(token) {
    return dispatch => {
        if (token) {
            axios.post(`${consts.OAPI_URL}/validateToken`, { token })
                .then(resp => {
                    dispatch({ type: 'TOKEN_VALIDATED', payload: resp.data.valid })
                })
                .catch(e => dispatch({ type: 'TOKEN_VALIDATED', payload: false }))
        } else {
            dispatch({ type: 'TOKEN_VALIDATED', payload: false })
        }
    }
}