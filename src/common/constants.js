module.exports = Object.freeze({
    EMAIL_VALIDO : /^(([^<>()\]\\.,;:\s@"]+(\.[^<>()\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
    API_BASE_LOCAL: 'http://localhost:3000/',
    API_BASE_BACKEND: 'http://localhost:3001/',
    API_BASE_BACKEND_SERVER: 'https://cadastromembrosibbback.herokuapp.com/',
    PERFIL_SUPER_USER: 777,
    APP_SECRET_KEY : process.env.APP_SECRET_KEY || '930dca47b14ba687cdcb62469a3c95b5'
    // MEMBRO_ATIVO: 1,
    // PERFIL_SUPER_USER: process.env.SUPER_USER || 'vandoaraujo',
    // PERFIL_CONSULTA_USER: 1,
    // SALTOS_HASH: 10
});