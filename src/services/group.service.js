import axios from 'axios';

export default {
  authenticate({ name, passcode }) {
    return axios.post('/api/group/authenticate', { name, passcode });
  },
  create({ name, passcode }) {
    return axios.post('/api/group/create', { name, passcode });
  },
  isLoggedIn() {
    return axios.get('/api/group/isLoggedIn');
  },
  logout() {
    return axios.get('/api/group/logout');
  },
};
