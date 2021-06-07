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
        @click="toggleDeletionBox"
        title="Delete?"
      >
        <font-awesome-icon :icon="['fas', 'trash']" />
        <deletion-box 
          :class="isDeletionBoxShown ? 'deletion-box' : 'deletion-box deletion-box--hidden'"
          @delete="deletePlaylist(playlist._id)" 
          @cancel="cancelDeletion">
        </deletion-box>
      </button>
    </div>
  </div>
</template>

<script>
import DeletionBox from './DeletionBox';
import formatDate from '../util/formatDate';

export default {
  name: 'PlaylistItem',
  data() {
    return {
      isDeletionBoxShown: false,
      errMsg: '',
    };
  },
  components: { DeletionBox },
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

    toggleDeletionBox() {
      this.isDeletionBoxShown = !this.isDeletionBoxShown;
    },

    cancelDeletion() {
      this.isDeletionBoxShown = false;
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
@import '../scss/playlist-item.scss';
</style>
