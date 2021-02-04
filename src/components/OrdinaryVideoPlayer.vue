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
      return this.$store.getters['mainplaylist/nowPlayingVideoIndex'];
    },
    videoId() {
      return this.playlist[this.index];
    },
    playlist() {
      return this.$store.getters['mainplaylist/playlist'];
    },
  },
  methods: {
    ended() {
      this.end();
    },

    end() {
      if (this.index === this.playlist.length - 1) {
        return;
      }
      this.$store.commit(
        'mainplaylist/changeNowPlayingVideoIndex',
        this.index + 1,
      );
    },

    prevVideo() {
      this.$store.commit(
        'mainplaylist/changeNowPlayingVideoIndex',
        this.index - 1,
      );
    },

    nextVideo() {
      this.$store.commit(
        'mainplaylist/changeNowPlayingVideoIndex',
        this.index + 1,
      );
    },
  },
};
</script>

<style lang="scss" scoped>
@import '@/scss/main-playlist.scss';
</style>
