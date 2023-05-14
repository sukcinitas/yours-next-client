<template>
  <div class="create-playlist">
    <button
      v-if="!isExtended"
      class="create-playlist-form__button--small"
      type="button"
      @click="toggleExtended"
    >
      <font-awesome-icon :icon="['fas', 'plus']" />
    </button>
    <form
      v-show="isExtended"
      class="create-playlist-form"
      @submit.prevent="addPlaylist"
    >
      <input
        v-model="title"
        type="text"
        :class="['create-playlist-form__input',
                 errMsg ? 'input--error' : '',
        ]"
        @input="() => errMsg = ''"
      >
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
        <font-awesome-icon :icon="['fas', 'minus']" />
      </button>
    </form>
    <p
      v-if="errMsg && isExtended && title"
      class="playlists__message--error"
    >
      {{ errMsg }}
    </p>
    <p
      v-if="successMsg && isExtended"
      class="playlists__message--success"
    >
      {{ successMsg }}
    </p>
  </div>
</template>

<script setup>
import {ref} from 'vue'
import { useRouter } from 'vue-router';
import { usePlaylistStore } from '../stores/playlist';
const title = ref('')
const isExtended = ref('')
const errMsg = ref('')
const successMsg = ref('')
const playlistStore = usePlaylistStore()
const router = useRouter()

function toggleExtended() {
  errMsg.value = '';
  successMsg.value = '';
  if (!title.value) {
    isExtended.value = !isExtended.value;
  }
}
async function addPlaylist() {
  try {
    const result = await playlistStore.addPlaylist({ title: title.value });
    if (result.success) {
      errMsg.value = '';
      successMsg.value = result.successMsg;
      setTimeout(() => router.push({ path: `/playlist/${result.id}` }), 250);
    }
  } catch (err) {
    successMsg.value = '';
    errMsg.value = err.response.data.message;
  }
}

</script>

<style lang="scss" scoped>
@import '../scss/main-page.scss';
</style>
