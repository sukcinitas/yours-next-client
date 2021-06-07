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
<script>
export default {
  name: 'OngoingVideoPlayer',
  data() {
    return {
      playerVars: {
        autoplay: 1,
        color: 'white',
        controls: 1,
        iv_load_policy: 3,
      },
      message: '',
      paused: false,
      timeWillBeUpdated: false,
    };
  },
  computed: {
    time() {
      return this.$store.state.mainplaylist.ongoingPlaylist.time;
    },
    isModerator() {
      return this.$store.getters['group/isModerator'];
    },
    index() {
      return this.$store.state.mainplaylist.ongoingPlaylist.videoIndex;
    },
    videoId() {
      return this.playlist[this.index];
    },
    playlist() {
      return this.$store.state.mainplaylist.idsArray;
    },
    isOngoingPlaylistPaused() {
      return this.$store.getters['mainplaylist/isOngoingPlaylistPaused'];
    },
    isNextAndPrevButtonDisplayed() {
      return this.isModerator;
    },
    userJoined() {
      return this.$store.state.mainplaylist.userJoined;
    },
  },
  watch: {
    time() {
      this.timeWillBeUpdated = true;
    },
    async userJoined() {
      const time = await this.$refs.youtube.player.getCurrentTime();
      this.$socket.emit('setOngoingPlaylist', {
        id: this.$route.params.id,
        videoIndex: this.index,
        time,
        paused: false,
      });
      this.$store.commit('mainplaylist/setUserJoined', { state: false });
    },
  },
  methods: {
    async ended() {
      this.end();
    },

    pause() {
      this.$socket.emit('toggleOngoingPlaylist', { paused: true });
    },

    play() {
      this.$socket.emit('toggleOngoingPlaylist', { paused: false });
    },

    fixatePause() {
      this.paused = true;
    },

    fixatePlay() {
      this.paused = false;
    },

    fixateReady() {
      this.$refs.youtube.player.playVideo();
      // always start page from playing; substitute if autoplay does not work
    },

    end() {
      if (this.index === this.playlist.length - 1) {
        return;
      }
      if (this.isModerator) {
        this.$socket.emit('changeOngoingPlaylistVideoIndex', {
          videoIndex: this.index + 1,
        });
      }
    },

    prevVideo() {
      if (this.isModerator) {
        this.$socket.emit('changeOngoingPlaylistVideoIndex', {
          videoIndex: this.index - 1,
        });
      }
    },

    nextVideo() {
      if (this.isModerator) {
        this.$socket.emit('changeOngoingPlaylistVideoIndex', {
          videoIndex: this.index + 1,
        });
      }
    },

    async seekTo(time) {
      this.$refs.youtube.player.seekTo(time, true);
    },
  },
  async mounted() {
    // to keep seekTo in syncronization, I wait 5secs till propability that video is loaded is high
    // and then I seekTo a certain time
    setTimeout(() => {
      if (!this.isModerator) {
        this.$socket.emit('userJoinsOngoingPlaylist');
      }
    }, 5000);
  },
  async updated() {
    if (this.isOngoingPlaylistPaused) {
      this.$refs.youtube.player.pauseVideo();
    } else {
      this.$refs.youtube.player.playVideo();
    }
    if (this.timeWillBeUpdated) {
      this.seekTo(this.time);
      this.timeWillBeUpdated = false;
    }
  },
};
</script>

<style lang="scss" scoped>
@import '../scss/main-playlist.scss';
</style>
