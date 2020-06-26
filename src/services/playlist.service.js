import axios from 'axios';

export default {
  getAll(name) {
    return axios.get(`/api/playlists?group=${name}`);
  },
  get(id) {
    return axios.get(`/api/playlists/${id}`);
  },
  post({ title, createdBy }) {
    return axios.post('/api/playlists', { title, createdBy });
  },
  add({ id, item }) {
    return axios.put(`/api/playlists/${id}`, { item });
  },
  delete(id) {
    return axios.delete(`/api/playlists/${id}`);
  },
  removeItem({ id, items }) {
    return axios.put(`/api/playlists/${id}/removeItem`, { items });
  },
};
