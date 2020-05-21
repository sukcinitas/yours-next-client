<template>
  <section>
    <div>
      <button
        @click="goToPlaylist(playlist._id)"
        v-for="playlist in playlists"
        :key="playlist.title">{{playlist.title}}
      </button>
    </div>
    <input type="text" v-model="title">
    <button @click="addPlaylist">+</button>
  </section>
</template>

<script>
import PlaylistApi from '../services/playlist.api';

export default {
  name: 'MainPage',
  data() {
    return {
      playlists: [],
      title: '',
    };
  },
  methods: {
    async getPlaylists() {
      const playlists = await PlaylistApi.getPlaylists(this.$store.state.group.name);
      this.playlists = playlists.data.playlists;
    },
    async addPlaylist() {
      await PlaylistApi.addPlaylist(this.title, this.$store.state.group.name);
      this.getPlaylists();
    },
    async goToPlaylist(id) {
      const result = await PlaylistApi.getPlaylist(id);
      await this.$store.commit('mainplaylist/setPlaylist', result.data.playlist.items);
      this.$router.push({ name: 'MainPlaylist' });
    },
  },
  mounted() {
    this.getPlaylists();
  },
};
</script>
