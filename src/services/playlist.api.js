import axios from 'axios';

const PlaylistApi = {
  getPlaylists(name) {
    return axios.get(`/api/playlists?group=${name}`);
  },
  getPlaylist(id) {
    return axios.get(`/api/playlists/${id}`);
  },
  addPlaylist(title, createdBy) {
    return axios.post('/api/playlists', { title, createdBy });
  },
};

export default PlaylistApi;
