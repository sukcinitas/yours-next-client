<template>
  <div>
    <div class="main-playlist__youtube">
      <Youtube
        :src="videoId"
        :vars="playerVars"
        ref="youtube"
        @ready="fixateReady"
        @stateChange="(state) => handleStateChange(state)"
        width="inherit"
      >
      </Youtube>
    </div>
    <div class="main-playlist__controls">
      <button
        :icon="['fas', 'step-backward']"
        v-if="index !== 0 && groupStore.isModerator"
        @click="prevVideo"
        class="main-playlist__button--controls"
      >
        <font-awesome-icon :icon="['fas', 'step-backward']"></font-awesome-icon>
      </button>
      <button
        v-if="paused"
        @click="play()"
        class="main-playlist__button--controls"
      >
        <font-awesome-icon :icon="['fas', 'play']"></font-awesome-icon>
      </button>
      <button
        v-if="!paused"
        @click="pause()"
        class="main-playlist__button--controls"
      >
        <font-awesome-icon :icon="['fas', 'pause']"></font-awesome-icon>
      </button>
      <button
        v-if="index !== playlist.length - 1 && groupStore.isModerator"
        @click="nextVideo"
        class="main-playlist__button--controls"
      >
        <font-awesome-icon :icon="['fas', 'step-forward']"></font-awesome-icon>
      </button>
    </div>
  </div>
</template>
<script setup>
import { ref, reactive, onUpdated, watch, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useMainPlaylistStore } from '../stores/mainplaylist';
import { useGroupStore } from '../stores/group';
import { socket } from "@/socket";

const mainplaylistStore = useMainPlaylistStore()
const groupStore = useGroupStore()
const route = useRoute()

const playerVars = reactive({
    autoplay: 1,
    color: 'white',
    controls: 1,
    iv_load_policy: 3,
  }
)
const paused = ref(false)
const youtube = ref(null)


const index = computed(() => {
  return mainplaylistStore.ongoingPlaylist.videoIndex
})
const playlist = computed(() => {
  return mainplaylistStore.idsArray
})
const videoId = computed(() => {
  return  mainplaylistStore.idsArray[mainplaylistStore.ongoingPlaylist.videoIndex]
})
const isOngoingPlaylistPaused = computed(() => {
  return mainplaylistStore.isOngoingPlaylistPaused
})

async function ended() {
  end();
}

function pause() {
  socket.emit('toggleOngoingPlaylist', { paused: true });
}

function play() {
  socket.emit('toggleOngoingPlaylist', { paused: false });
}

function handleStateChange(state) {
  if (state.data === 0) {
    ended()
  } else if (state.data === 2) {
    paused.value = true
  } else if (state.data === 1) {
    paused.value = false
  }
}

function fixateReady() {
  if (!groupStore.isModerator) {
    socket.emit('userJoinsOngoingPlaylist');
  }
  youtube.value.player.playVideo();
  // always start page from playing; substitute if autoplay does not work
}

function end() {
  if (index.value === playlist.length - 1) {
    return;
  }
  if (groupStore.isModerator) {
    nextVideo()
  }
}

function prevVideo() {
  if (groupStore.isModerator) {
    socket.emit('changeOngoingPlaylistVideoIndex', {
      videoIndex: index.value - 1,
    });
  }
}

function nextVideo() {
  if (groupStore.isModerator) {
    socket.emit('changeOngoingPlaylistVideoIndex', {
      videoIndex: index.value + 1,
    });
  }
}

watch(() => mainplaylistStore.ongoingPlaylist.time, (nVal) => {
  seekTo(nVal);
})

async function seekTo(time) {
  youtube.value.player.seekTo(time, true);
}

onUpdated(() => {
  if (isOngoingPlaylistPaused.value) {
    youtube.value.player.pauseVideo();
  } else {
    youtube.value.player.playVideo();
  }
})

watch(() => mainplaylistStore.userJoined, async () => {
  if (groupStore.isModerator) {
    const time = await youtube.value.player.getCurrentTime();
    socket.emit('setOngoingPlaylist', {
      id: route.params.id,
      videoIndex: index.value,
      time,
      paused: false,
    });
  }
  mainplaylistStore.setUserJoined({ state: false });
})

</script>

<style lang="scss" scoped>
@import '../scss/main-playlist.scss';
</style>
