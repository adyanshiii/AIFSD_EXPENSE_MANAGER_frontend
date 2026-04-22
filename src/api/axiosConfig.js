import axios from 'axios';

const instance = axios.create({
    baseURL: 'https://aifsd-expense-manager.onrender.com/api', // Update with your deployed backend URL
});

export default instance;