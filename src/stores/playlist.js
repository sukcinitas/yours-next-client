import { defineStore } from 'pinia'
import PlaylistService from '../services/playlist.service';
import GroupService from '../services/group.service';
import checkIfAuthorizationError from '../util/checkIfAuthorizationError';
import { useGroupStore } from './group';

export const usePlaylistStore = defineStore('playlist', {
  state: () => ({
    playlists: [],
  }),
  actions: {
    SOCKET_updatePlaylists({ playlists }) {
      this.playlists = playlists;
    },

    async getPlaylists() {
      try {
        const { data: { group } } = await GroupService.isLoggedIn();
        const { data: { playlists } } = await PlaylistService.getAll(group);
        this.playlists = playlists;
      } catch (err) {
        checkIfAuthorizationError(err);
        throw err;
      }
    },

    async addPlaylist({ title }) {
      const groupState = useGroupStore()
      try {
        const { data } = await PlaylistService.post({
          title,
          createdBy: groupState.name,
        });
        if (data.success) {
          const playlists = [...this.playlists, data.playlist];
          // this._vm.$socket.emit('updatePlaylists', { playlists });
          return {
            success: true,
            successMsg: data.message,
            playlists,
            id: data.playlist._id,
          };
        }
        return { success: false };
      } catch (err) {
        checkIfAuthorizationError(err);
        throw err;
      }
    },

    async deletePlaylist(payload) {
      try {
        await PlaylistService.delete(payload.id);
        const playlists = this.playlists.filter(playlist => playlist._id !== payload.id);
        return { playlists };
      } catch (err) {
        checkIfAuthorizationError(err);
        throw err;
      }
    },
  },
  getters: {
    playlistsTitles() {
      return this.playlists.map(playlist => playlist.title.toLowerCase());
    }
  }
})