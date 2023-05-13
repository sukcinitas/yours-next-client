<template>
  <div>
    <button
      class="main-playlist__button"
      v-if="isModerator"
      @click="() => router.push({ path: `/mainplaylist/${$route.params.id}` })"
    >
    Make this playlist main
    </button>
    <div class="main-playlist__youtube--ordinary" ref="youtubeParent">
      <Youtube
        :src="videoId"
        :vars="playerVars"
        ref="youtube"
        @stateChange="(state) => handleStateChange(state)"
        width="inherit"
        >
      </Youtube>
    </div>
    <div class="main-playlist__controls">
      <button
        v-if="index !== 0"
        @click="prevVideo"
        class="main-playlist__button--controls"
      >
        <font-awesome-icon :icon="['fas', 'step-backward']"></font-awesome-icon>
      </button>
      <button
        v-if="index !== mainplaylistStore.playlist.length - 1"
        @click="nextVideo"
        class="main-playlist__button--controls"
      >
        <font-awesome-icon :icon="['fas', 'step-forward']"></font-awesome-icon>
      </button>
    </div>
  </div>
</template>
<script setup>
import { reactive, computed } from 'vue'
import { useMainPlaylistStore } from '../stores/mainplaylist';
import { useGroupStore } from '../stores/group';
import { useRouter } from 'vue-router';

const router = useRouter();
const groupStore = useGroupStore();
const mainplaylistStore = useMainPlaylistStore();

const playerVars = reactive({
  autoplay: 1,
  color: 'red',
  controls: 1,
})

const isModerator = computed(() => {
  return groupStore.isModerator
})

const index = computed(() => {
  return mainplaylistStore.nowPlayingVideoIndex
})

const videoId = computed(() => {
  return mainplaylistStore.playlist[index.value]
})

function handleStateChange(state) {
  if (state.data === 0) {
    end()
  }
}

function end() {
  if (index.value === mainplaylistStore.playlist.length - 1) {
    return;
  }
  nextVideo()
}

function prevVideo() {
  mainplaylistStore.changeNowPlayingVideoIndex(index.value - 1);
}

function nextVideo() {
  mainplaylistStore.changeNowPlayingVideoIndex(index.value + 1);
}

</script>

<style lang="scss" scoped>
@import '../scss/main-playlist.scss';
</style>
