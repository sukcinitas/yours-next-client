<template>
<div>
  <button
    class="main-playlist__button"
    v-if="isModerator && !isMainAnOngoingPlaylist"
    @click="makePlaylistMain"
  >Make this playlist main
  </button>
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
    >
    </youtube>
  </div>
  <div class="main-playlist__controls">
    <button
      @click="paused ? play() : pause()"
      class="main-playlist__button--controls"
    >{{paused ? "Play" : "Pause"}}
    </button>
    <button
      v-if="index !== 0 && isNextAndPrevButtonDisplayed"
      @click="prevVideo"
      class="main-playlist__button--controls"
    >Previous video
    </button>
    <button
      v-if="index !== playlist.length - 1 && isNextAndPrevButtonDisplayed"
      @click="nextVideo"
      class="main-playlist__button--controls"
    >Next video
    </button>
  </div>
</div>

</template>
<script>
export default {
  name: 'VideoPlayer',
  data() {
    return {
      playerVars: {
        autoplay: 1,
        color: 'white',
        controls: 0,
      },
      message: '',
      paused: false,
    };
  },
  computed: {
    time() {
      return this.$store.state.mainplaylist.ongoingPlaylist.time;
    },
    isMainAnOngoingPlaylist() {
      return this.$store.getters['mainplaylist/isMainAnOngoingPlaylist'];
    },
    isModerator() {
      return this.$store.getters['group/isModerator'];
    },
    index() {
      if (this.isMainAnOngoingPlaylist) {
        return this.$store.state.mainplaylist.ongoingPlaylist.videoIndex;
      }
      return this.$store.state.mainplaylist.nowPlayingVideoIndex;
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
    // isOngoingPlaylistPlaying() {
    //   return this.$store.getters['mainplaylist/isOngoingPlaylistPlaying'];
    // },
    isNextAndPrevButtonDisplayed() {
      return (this.isMainAnOngoingPlaylist && this.isModerator) ||
      !this.isMainAnOngoingPlaylist;
    },
  },
  methods: {
    async ended() {
      this.end();
    },
    pause() {
      if (this.isMainAnOngoingPlaylist) {
        this.$socket.emit('toggleOngoingPlaylist', { paused: true });
      } else {
        this.$refs.youtube.player.pauseVideo();
      }
    },
    play() {
      if (this.isMainAnOngoingPlaylist) {
        this.$socket.emit('toggleOngoingPlaylist', { paused: false });
      } else {
        // eslint-disable-next-line no-console
        console.log('hey I play');
        this.$refs.youtube.player.playVideo();
      }
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
      if (this.isModerator && this.isMainAnOngoingPlaylist) {
        this.$socket.emit('changeOngoingPlaylistVideoIndex', { videoIndex: this.index + 1 });
      }
      this.$store.commit('mainplaylist/changeNowPlayingVideoIndex', this.index + 1);
      this.play();
    },
    // fixateState(state) {
    //   if (state.data === 2) {
    //     return true;
    //   } else if (state.data === 1) {
    //     return false;
    //   }
    //   return false;
    // },
    async makePlaylistMain() { // main - first video from the start
      this.$socket.emit('setOngoingPlaylist', {
        id: this.$store.state.mainplaylist.id,
        videoIndex: 0,
        time: 0,
        paused: false,
      });
    },
    prevVideo() {
      if (!this.isModerator && this.$store.getters['mainplaylist/isMainAnOngoingPlaylist']) {
        return;
      }
      if (this.isModerator && this.$store.getters['mainplaylist/isMainAnOngoingPlaylist']) {
        this.$socket.emit('changeOngoingPlaylistVideoIndex', { videoIndex: this.index - 1 });
        return;
      }
      this.$store.commit('mainplaylist/changeNowPlayingVideoIndex', this.index - 1);
      this.play();
    },
    nextVideo() {
      if (!this.isModerator && this.$store.getters['mainplaylist/isMainAnOngoingPlaylist']) {
        return;
      }
      if (this.isModerator && this.$store.getters['mainplaylist/isMainAnOngoingPlaylist']) {
        this.$socket.emit('changeOngoingPlaylistVideoIndex', { videoIndex: this.index + 1 });
        return;
      }
      this.$store.commit('mainplaylist/changeNowPlayingVideoIndex', this.index + 1);
      this.play();
    },
    // async seekTo() {
    //   const time = await this.$refs.youtube.player.getCurrentTime();
    //   // eslint-disable-next-line no-console
    //   console.log(time);
    //   this.$refs.youtube.player.seekTo(time, true);
    //   // this.play();
    // },
  },
  mounted() {
    if (!this.isModerator && this.isMainAnOngoingPlaylist) {
      this.$refs.youtube.player.mute();
      this.$refs.youtube.player.seekTo(this.time, true);
    }
    // this.$refs.youtube.player.addEventListener('onStateChange', this.fixateState);
  },
  updated() {
    if (!this.isModerator && this.isMainAnOngoingPlaylist) {
      // eslint-disable-next-line no-console
      console.log('updated!');
      // const time = this.$refs.youtube.player.getCurrentTime();
      // this.$refs.youtube.player.seekTo(time, false);
      this.$refs.youtube.player.mute();
    } else {
      this.$refs.youtube.player.unMute();
    }
    if (this.isMainAnOngoingPlaylist) {
      if (this.isOngoingPlaylistPaused) {
        this.$refs.youtube.player.pauseVideo();
      } else {
        this.$refs.youtube.player.playVideo();
      }
    }
  },
  beforeDestroy() {
    // this.$refs.youtube.player.removeEventListener('onStateChange', this.fixateState);
    if (this.isModerator && this.isMainAnOngoingPlaylist) {
      this.$socket.emit('setOngoingPlaylist', {
        id: '',
        videoIndex: 0,
        time: 0,
        paused: false,
      });
    }
  },
};
</script>

<style lang="scss" scoped>
  @import '@/scss/main-playlist.scss';
</style>
