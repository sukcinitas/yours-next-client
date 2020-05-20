import axios from 'axios';

const GroupApi = {
  async authenticate(name, passcode) {
    return axios.post('/api/group/authenticate', { name, passcode });
  },
  async createGroup(name, passcode) {
    return axios.post('/api/group/create', { name, passcode });
  },
};

export default GroupApi;
