<template>
  <div class="main-playlist">
    <header-panel
      :leave-btn="false"
      :home-btn="true"
      :back-btn="true"
    />
    <h4 class="main-playlist__title--ongoing">
      {{ mainplaylistStore.title }}
    </h4>
    <template v-if="mainplaylistStore.length !== 0 && !loading">
      <ongoing-video-player class="main-playlist__video-player" />
      <video-items-data
        :is-ongoing="true"
        class="main-playlist__video-items"
      />
    </template>
    <loading-animation v-if="loading" />
    <members-list :is-bottom="false" />
    <message-box />
  </div>
</template>

<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import { useGroupStore } from '../stores/group';
import { useMainPlaylistStore } from '../stores/mainplaylist';
import OngoingVideoPlayer from '../components/OngoingVideoPlayer.vue';
import VideoItemsData from '../components/VideoItemsData.vue';
import MembersList from '../components/MembersList.vue';
import MessageBox from '../components/MessageBox.vue';
import HeaderPanel from '../components/HeaderPanel.vue';
import LoadingAnimation from '../components/LoadingAnimation.vue';
import { socket } from "@/socket";

const loading = ref(false);
const errMsg = ref('');
const route = useRoute()
const groupStore = useGroupStore();
const mainplaylistStore = useMainPlaylistStore();

onMounted(async () => {
  const { id } = route.params;
    setOngoingPlaylist(id);
    try {
      loading.value = true;
      mainplaylistStore.setId({ id });
      await mainplaylistStore.getPlaylist({ id });
      if (mainplaylistStore.setCount >= 1) {
        // because only one set of items is loaded
        return;
      }
      const { increaseSetCount } = await mainplaylistStore.getPlaylistData();
      if (increaseSetCount) {
        mainplaylistStore.setSetCount();
      }
    } catch (err) {
      errMsg.value = err.response.data.message;
    } finally {
      loading.value = false;
    }
})

onBeforeUnmount(() => {
  setOngoingPlaylist('')
})

function setOngoingPlaylist(id) {
  if (groupStore.isModerator) {
      socket.emit('setOngoingPlaylist', {
        id,
        videoIndex: 0,
        time: 0,
        paused: false,
      });
    }
}
</script>

<style lang="scss" scoped>
@import '../scss/main-playlist.scss';
</style>
