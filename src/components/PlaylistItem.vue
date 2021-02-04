<template>
  <div class="playlist">
    <div class="playlist__details">
      <h3 class="playlist__name">{{ playlist.title }}</h3>
      <p>{{ playlist.items.length }} items</p>
      <p>{{ formatDate(playlist.updatedAt) }}</p>
    </div>
    <p v-if="errMsg" class="playlist__message--error">{{ errMsg }}</p>
    <div class="playlist__buttons">
      <button class="playlist__button"
        @click="() => $router.push({ path: `/playlist/${playlist._id}` })"
      >
        <font-awesome-icon :icon="['fas', 'chevron-right']" />
      </button>
      <button
        v-if="isModerator"
        class="playlist__button"
        @click.stop="deletePlaylist(playlist._id)"
      >
        <font-awesome-icon :icon="['fas', 'window-close']" />
      </button>
    </div>
  </div>
</template>

<script>
import formatDate from '../util/formatDate';

export default {
  name: 'PlaylistItem',
  data() {
    return {
      errMsg: '',
    };
  },
  props: ['playlist'],
  computed: {
    isModerator() {
      return this.$store.getters['group/isModerator'];
    },
  },
  methods: {
    async deletePlaylist(id) {
      try {
        const { playlists } = await this.$store.dispatch('playlist/deletePlaylist', { id });
        this.$socket.emit('updatePlaylists', { playlists });
      } catch (err) {
        this.errMsg = err.response.data.message;
      }
    },

    formatDate(date) {
      if (!date) {
        return '';
      }
      return `last updated on ${formatDate(date)}`;
    },
  },
};
</script>

<style lang="scss" scoped>
@import '@/scss/playlist-item.scss';
</style>
