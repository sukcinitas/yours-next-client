<template>
  <div class="create-playlist">
    <button
      v-if="!isExtended"
      class="create-playlist-form__button--small"
      @click="toggleExtended"
      type="button"
    >
      <font-awesome-icon :icon="['fas', 'plus']"> </font-awesome-icon>
    </button>
    <form
      class="create-playlist-form"
      @submit.prevent="addPlaylist"
      v-show="isExtended"
    >
      <input
        type="text"
        v-model="title"
        :class="['create-playlist-form__input',
          errMsg ? 'input--error' : '',
        ]"
        @input="() => errMsg = ''"
      />
      <button
        v-if="title"
        class="create-playlist-form__button"
        type="submit"
        @click="toggleExtended"
      >
        Add
      </button>
      <button
        v-else
        class="create-playlist-form__button"
        type="button"
        @click="toggleExtended"
      >
        <font-awesome-icon :icon="['fas', 'minus']"> </font-awesome-icon>
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
      try {
        const result = await this.$store
          .dispatch('playlist/addPlaylist', { title: this.title });
        if (result.success) {
          this.errMsg = '';
          this.successMsg = result.successMsg;
          setTimeout(() => this.$router.push({ path: `/playlist/${result.id}` }), 250);
        }
      } catch (err) {
        this.successMsg = '';
        this.errMsg = err.response.data.message;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
@import '../scss/main-page.scss';
</style>
