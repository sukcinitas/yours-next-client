<template>
  <div>
    <button
      class="main-playlist__button"
      v-if="isModerator"
      @click="() => $router.push({ path: `/mainplaylist/${$route.params.id}` })"
    >
      Make this playlist main
    </button>
    <div class="main-playlist__youtube--ordinary">
      <youtube
        :video-id="videoId"
        :player-vars="playerVars"
        ref="youtube"
        @ended="ended"
        fitParent
        resize
      >
      </youtube>
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
        v-if="index !== playlist.length - 1"
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

const groupStore = useGroupStore()
const mainplaylistStore = useMainPlaylistStore()

const playerVars = reactive({
  autoplay: 1,
  color: 'red',
  controls: 1,
})
// const message = ref('')

const isModerator = computed(() => {
  return groupStore.isModerator
})

const index = computed(() => {
  return mainplaylistStore.nowPlayingVideoIndex
})

const playlist = computed(() => {
  return mainplaylistStore.playlist
})

const videoId = computed(() => {
  return playlist[index.value]
})

function ended() {
  end()
}

function end() {
  if (index.value === playlist.value.length - 1) {
    return;
  }
  mainplaylistStore.changeNowPlayingVideoIndex(index.value + 1);
}

function prevVideo() {
  mainplaylistStore.changeNowPlayingVideoIndex(this.index - 1);
}

function nextVideo() {
  mainplaylistStore.changeNowPlayingVideoIndex(this.index + 1);
}

</script>

<style lang="scss" scoped>
@import '../scss/main-playlist.scss';
</style>
