import axios from 'axios';

const api = axios.create({
    baseURL: 'http://192.168.1.3:3333' /* Ver o ip acima do QR na EXPO no browser */
});

export default api;