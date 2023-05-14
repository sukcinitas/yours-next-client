<template>
  <div>
    <button
      v-if="isModerator"
      class="main-playlist__button"
      @click="() => router.push({ path: `/mainplaylist/${$route.params.id}` })"
    >
      Make this playlist main
    </button>
    <div
      ref="youtubeParent"
      class="main-playlist__youtube--ordinary"
    >
      <youtube-player
        ref="youtube"
        :src="videoId"
        :vars="playerVars"
        width="inherit"
        @state-change="(state) => handleStateChange(state)"
      />
    </div>
    <div class="main-playlist__controls">
      <button
        v-if="index !== 0"
        class="main-playlist__button--controls"
        @click="prevVideo"
      >
        <font-awesome-icon :icon="['fas', 'step-backward']" />
      </button>
      <button
        v-if="index !== mainplaylistStore.playlist.length - 1"
        class="main-playlist__button--controls"
        @click="nextVideo"
      >
        <font-awesome-icon :icon="['fas', 'step-forward']" />
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
