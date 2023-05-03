<template>
  <div>
    <div class="main-playlist__youtube">
      <youtube
        :video-id="videoId"
        :player-vars="playerVars"
        ref="youtube"
        @ended="ended"
        @paused="fixatePause"
        @playing="fixatePlay"
        @ready="fixateReady"
        fitParent
        resize
      >
      </youtube>
    </div>
    <div class="main-playlist__controls">
      <button
        :icon="['fas', 'step-backward']"
        v-if="index !== 0 && isNextAndPrevButtonDisplayed"
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
        v-if="index !== playlist.length - 1 && isNextAndPrevButtonDisplayed"
        @click="nextVideo"
        class="main-playlist__button--controls"
      >
        <font-awesome-icon :icon="['fas', 'step-forward']"></font-awesome-icon>
      </button>
    </div>
  </div>
</template>
<script setup>
import { ref, reactive, onMounted, onUpdated, watch, computed } from 'vue'
import { useMainPlaylistStore } from '../stores/mainplaylist';
import { useGroupStore } from '../stores/group';
const mainplaylistStore = useMainPlaylistStore()
const groupStore = useGroupStore()

const playerVars = reactive({
    autoplay: 1,
    color: 'white',
    controls: 1,
    iv_load_policy: 3,
  }
)
// const message = ref('')
const paused = ref(false)
const timeWillBeUpdated = ref(false)
const youtube = ref(null)
const time = computed(() => {
  return mainplaylistStore.ongoingPlaylist.time
})
const isModerator = computed(() => {
  return groupStore.isModerator
})
const index = computed(() => {
  return mainplaylistStore.ongoingPlaylist.videoIndex
})
const videoId = computed(() => {
  return playlist[index]
})
const playlist = computed(() => {
  return mainplaylistStore.idsArray
})
const isOngoingPlaylistPaused = computed(() => {
  return mainplaylistStore.isOngoingPlaylistPaused
})
const isNextAndPrevButtonDisplayed = computed(() => {
  return isModerator
})
// const userJoined = computed(() => {
//   return mainplaylistStore.userJoined
// })

async function ended() {
  end();
}

function pause() {
  // this.$socket.emit('toggleOngoingPlaylist', { paused: true });
}

function play() {
  // $socket.emit('toggleOngoingPlaylist', { paused: false });
}

function fixatePause() {
  paused.value = true;
}

function fixatePlay() {
  paused.value = false;
}

function fixateReady() {
  youtube.value.player.playVideo();
  // always start page from playing; substitute if autoplay does not work
}

function end() {
  if (index.value === playlist.length - 1) {
    return;
  }
  if (isModerator) {
    $socket.emit('changeOngoingPlaylistVideoIndex', {
      videoIndex: this.index + 1,
    });
  }
}

function prevVideo() {
  if (this.isModerator) {
    // this.$socket.emit('changeOngoingPlaylistVideoIndex', {
    //   videoIndex: this.index - 1,
    // });
  }
}

function nextVideo() {
  if (this.isModerator) {
    // this.$socket.emit('changeOngoingPlaylistVideoIndex', {
    //   videoIndex: this.index + 1,
    // });
  }
}

async function seekTo(time) {
  youtube.value.player.seekTo(time, true);
}

onMounted(async () => {
  // to keep seekTo in syncronization, I wait 5secs till propability that video is loaded is high
  // and then I seekTo a certain time
  setTimeout(() => {
    if (!isModerator) {
      // $socket.emit('userJoinsOngoingPlaylist');
    }
  }, 5000);
})

onUpdated(() => {
  if (isOngoingPlaylistPaused.value) {
    youtube.value.player.pauseVideo();
  } else {
    youtube.value.player.playVideo();
  }
  if (timeWillBeUpdated.value) {
    seekTo(time.value);
    timeWillBeUpdated.value = false;
  }
})

watch('time', () => {
  timeWillBeUpdated.value = true
})

watch('userJoined', async () => {
  const time = await youtube.value.player.getCurrentTime();
  // $socket.emit('setOngoingPlaylist', {
  //   id: $route.params.id,
  //   videoIndex: index,
  //   time,
  //   paused: false,
  // });
  mainplaylist.setUserJoined({ state: false });
})

</script>

<style lang="scss" scoped>
@import '../scss/main-playlist.scss';
</style>
