<template>
<div>
  <button
    class="main-playlist__button"
    v-if="isModerator"
    @click="makePlaylistMain"
  >Make this playlist main
  </button>
  <youtube
    class="main-playlist__youtube"
    :video-id="videoId"
    :player-vars="playerVars"
    ref="youtube"
    @ended="ended"
    fitParent
  >
  </youtube>
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
    isOngoingPlaylistPlaying() {
      return this.$store.getters['mainplaylist/isOngoingPlaylistPlaying'];
    },
  },
  methods: {
    async ended() {
      this.end();
    },
    pause() {
      if (this.isModerator && this.isMainAnOngoingPlaylist) {
        this.$socket.emit('pauseOngoingPlaylist');
      }
    },
    play() {
      if (this.isModerator && this.isMainAnOngoingPlaylist) {
        this.$socket.emit('playOngoingPlaylist');
      }
    },
    end() {
      // this.$store.dispatch('mainplaylist/removeItemsFromPlaylist');
      if (this.index === this.playlist.length - 1) {
        return;
      }
      if (this.isModerator && this.isMainAnOngoingPlaylist) {
        this.$socket.emit('changeOngoingPlaylistVideoIndex', { videoIndex: this.index + 1 });
      }
      this.$store.commit('mainplaylist/changeNowPlayingVideoIndex', this.index + 1);
    },
    fixateState(state) {
      if (state.data === 2) {
        this.pause();
      } else if (state.data === 1) {
        this.play();
      }
    },
    async makePlaylistMain() {
      this.$socket.emit('setOngoingPlaylist', {
        id: this.$store.state.mainplaylist.id,
        videoIndex: this.$store.state.mainplaylist.nowPlayingVideoIndex,
        time: await this.$refs.youtube.player.getCurrentTime(),
      });
    },
  },
  mounted() {
    if (!this.isModerator && this.isMainAnOngoingPlaylist) {
      this.$refs.youtube.player.mute();
      // this.$refs.youtube.player.seekTo(time, true);
    }
    this.$refs.youtube.player.addEventListener('onStateChange', this.fixateState);
  },
  updated() {
    if (!this.isModerator && this.isMainAnOngoingPlaylist) {
      const time = this.time;
      this.$refs.youtube.player.mute();
      this.$refs.youtube.player.seekTo(time, false);
    }
    if (this.isOngoingPlaylistPaused) {
      this.$refs.youtube.player.pauseVideo();
    }
    if (this.isOngoingPlaylistPlaying) {
      this.$refs.youtube.player.playVideo();
    }
  },
  beforeDestroy() {
    this.$refs.youtube.player.removeEventListener('onStateChange', this.fixateState);
  },
};
</script>

<style lang="scss" scoped>
  @import '@/scss/main-playlist.scss';
</style>
