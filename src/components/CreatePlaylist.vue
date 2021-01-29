<template>
  <div class="create-playlist">
    <button
      v-if="!isExtended"
      class="create-playlist-form__button--small"
      @click="toggleExtended"
      type="button"
    >
      +
    </button>
    <form
      class="create-playlist-form"
      @submit.prevent="addPlaylist"
      v-show="isExtended"
    >
      <input type="text" v-model="title" class="create-playlist-form__input" />
      <button
        class="create-playlist-form__button"
        :type="title ? 'submit' : 'button'"
        @click="toggleExtended"
      >
        {{ title ? 'Add' : '-' }}
      </button>
    </form>
    <p v-if="errMsg && isExtended && title" class="playlists__message--error">
      {{ errMsg }}
    </p>
    <p v-if="successMsg && isExtended" class="playlists__message--success">
      {{ successMsg }}
    </p>
  </div>
</template>

<script>
export default {
  name: 'CreatePlaylist',
  data() {
    return {
      title: '',
      isExtended: false,
      errMsg: '',
      successMsg: '',
    };
  },
  methods: {
    toggleExtended() {
      this.errMsg = '';
      this.successMsg = '';
      if (!this.title) {
        this.isExtended = !this.isExtended;
      }
    },
    async addPlaylist() {
      this.$store
        .dispatch('playlist/addPlaylist', { title: this.title })
        .then((result) => {
          if (result.success) {
            this.errMsg = '';
            this.successMsg = result.successMsg;
            this.$store.dispatch('mainplaylist/getPlaylist', { id: result.id });
            setTimeout(() => this.$router.push({ path: '/playlist' }), 250);
            this.isExtended = false;
          } else {
            this.successMsg = '';
            this.errMsg = result.errMsg;
          }
        });
    },
  },
};
</script>

<style lang="scss" scoped>
@import '@/scss/main-page.scss';
</style>
