<template>
  <main class="main">
    <header-panel
      :leave-btn="true"
      :home-btn="false"
      :back-btn="false"
    />
    <div class="playlists">
      <create-playlist />
      <div class="playlists__list">
        <loading-animation v-if="loading" />
        <template v-else>
          <div
            v-if="ongoingPlaylistId"
            class="playlists__playlist--ongoing"
          >
            <button
              class="playlists__name--ongoing"
              @click="goToOngoingPlaylist(ongoingPlaylistId)"
            >
              Ongoing playlist
            </button>
          </div>
          <playlist-item
            v-for="playlist in playlistStore.playlists"
            :key="playlist.title"
            :playlist="playlist"
          />
          <p
            v-if="errMsg"
            class="playlists__message--error"
          >
            {{ errMsg }}
          </p>
        </template>
      </div>
    </div>
    <members-list :is-bottom="true" />
    <message-box />
  </main>
</template>

<script setup>
import { onMounted } from 'vue';
import { usePlaylistStore } from '@/stores/playlist.js'
import { useMainPlaylistStore } from '../stores/mainplaylist';
import { useRouter } from 'vue-router'
import { ref, computed } from 'vue'
import MessageBox from '../components/MessageBox.vue';
import MembersList from '../components/MembersList.vue';
import HeaderPanel from '../components/HeaderPanel.vue';
import PlaylistItem from '../components/PlaylistItem.vue';
import CreatePlaylist from '../components/CreatePlaylist.vue';
import LoadingAnimation from '../components/LoadingAnimation.vue';
const playlistStore = usePlaylistStore()
const mainplaylistStore = useMainPlaylistStore()
const router = useRouter()
const errMsg = ref('')
const loading = ref(false)

onMounted(() => {
  return getPlaylists()
})

const ongoingPlaylistId= computed(() => {
  return mainplaylistStore.ongoingPlaylist?.id;
})

async function getPlaylists() {
  try {
    loading.value = true
    await playlistStore.getPlaylists()
  } catch (err) {
    errMsg.value = err.message || err.response.data.message;
  } finally {
    loading.value = false;
  }
}

async function goToOngoingPlaylist() {
  router.push({ path: `/mainplaylist/${ongoingPlaylistId.value}` });
}

</script>

<style lang="scss" scoped>
@import '../scss/shared-styles-forms.scss';
@import '../scss/shared-styles-buttons.scss';
@import '../scss/main-page.scss';
@import '../scss/header-panel.scss';
</style>
