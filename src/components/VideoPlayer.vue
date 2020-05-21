<template>
<div>
  <youtube
    :video-id="videoId"
    :player-vars="playerVars"
    ref="youtube"
    @ended="ended"
  >
  </youtube>
</div>

</template>
<script>
export default {
  name: 'VideoPlayer',
  data() {
    return {
      playlist: this.initialPlaylist,
      playerVars: {
        autoplay: 1,
        color: 'white',
      },
      items: [],
    };
  },
  props: {
    initialPlaylist: Array,
    nowPlayingVideoIndex: Number,
  },
  computed: {
    index() {
      return this.nowPlayingVideoIndex;
    },
    videoId() {
      return this.playlist[this.index];
    },
  },
  methods: {
    async ended() {
      // const data = await axios.get('/api/data/playlists?channelId=UCazpYHBPTXKy9t9E78yuWnQ');
      // this.items = data.items;
      this.end();
    },
    end() {
      this.$store.commit('mainplaylist/changeNowPlayingVideoIndex', this.index + 1);
    },
  },
};
</script>
