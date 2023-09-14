import axios from 'axios';

const instance = axios.create({
    baseURL: 'http://localhost:3000/api/v1',  // substitua pela URL base da sua API
    timeout: 10000,  // tempo em milissegundos
    headers: {'Content-Type': 'application/json'}
});

export default instance;
