<template>
<div>
  <button
    class="main-playlist__button"
    v-if="isModerator"
    @click="makePlaylistMain"
  >Make this playlist main
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
    ><font-awesome-icon :icon="['fas', 'step-backward']"></font-awesome-icon>
    </button>
    <button
      v-if="index !== playlist.length - 1"
      @click="nextVideo"
      class="main-playlist__button--controls"
    ><font-awesome-icon :icon="['fas', 'step-forward']"></font-awesome-icon>
    </button>
  </div>
</div>

</template>
<script>
export default {
  name: 'OrdinaryVideoPlayer',
  data() {
    return {
      playerVars: {
        autoplay: 1,
        color: 'red',
        controls: 1,
      },
      message: '',
    };
  },
  computed: {
    isModerator() {
      return this.$store.getters['group/isModerator'];
    },
    index() {
      return this.$store.state.mainplaylist.nowPlayingVideoIndex;
    },
    videoId() {
      return this.playlist[this.index];
    },
    playlist() {
      return this.$store.state.mainplaylist.idsArray;
    },
  },
  methods: {
    async ended() {
      this.end();
    },
    end() {
      if (this.index === this.playlist.length - 1) {
        return;
      }
      this.$store.commit('mainplaylist/changeNowPlayingVideoIndex', this.index + 1);
    },
    async makePlaylistMain() {
      this.$socket.emit('setOngoingPlaylist', {
        id: this.$store.state.mainplaylist.id,
        videoIndex: 0,
        time: 0,
        paused: false,
      });
      this.$router.push({ path: '/mainplaylist' });
    },
    prevVideo() {
      this.$store.commit('mainplaylist/changeNowPlayingVideoIndex', this.index - 1);
    },
    nextVideo() {
      this.$store.commit('mainplaylist/changeNowPlayingVideoIndex', this.index + 1);
    },
  },
};
</script>

<style lang="scss" scoped>
  @import '@/scss/main-playlist.scss';
</style>
