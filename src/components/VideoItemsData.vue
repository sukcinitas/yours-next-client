<template>
  <div>
    <p>{{errMsg}}</p>
    <div
      :class="{active: item.id === playlist[activeIndex]}"
      v-for="(item, index) in items"
      :key="playlist[index]"
      :index="index"
    >
      <h3 @click="changeIndex(index)">{{item.snippet.title}}</h3>
      <img :src="item.snippet.thumbnails.medium.url" :alt="item.snippet.title">
      <hr>
      <button
        v-if="isModerator"
        @click="removeItemFromPlaylist(item.id)"
      >
        Remove
        </button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'VideoItemsData',
  data() {
    return {
      errMsg: '',
    };
  },
  computed: {
    activeIndex() {
      if (this.$store.getters['mainplaylist/isMainAnOngoingPlaylist']) {
        return this.$store.state.mainplaylist.ongoingPlaylist.videoIndex;
      }
      return this.$store.state.mainplaylist.nowPlayingVideoIndex;
    },
    playlist() {
      return this.$store.state.mainplaylist.idsArray;
    },
    items() {
      return this.$store.state.mainplaylist.items;
    },
    isModerator() {
      return this.$store.getters['group/isModerator'];
    },
  },
  methods: {
    changeIndex(index) {
      if (!this.isModerator && this.$store.getters['mainplaylist/isMainAnOngoingPlaylist']) {
        return;
      }
      if (this.isModerator && this.$store.getters['mainplaylist/isMainAnOngoingPlaylist']) {
        this.$socket.emit('changeOngoingPlaylistVideoIndex', { videoIndex: index });
        return;
      }
      this.$store.commit('mainplaylist/changeNowPlayingVideoIndex', index);
    },
    removeItemFromPlaylist(videoId) {
      // this.$socket.emit('addItemToPendingRemovalList', { item: videoId });
      this.$store.dispatch('mainplaylist/removeItemFromPlaylist', { videoId })
        .then((result) => {
          if (!result.success) {
            this.errMsg = result.errMsg;
            return;
          }
          this.$socket.emit('updatePlaylist', {
            idsArray: result.items,
            items: result.itemsData,
          });
        });
    },
  },
  mounted() {
    this.$store.dispatch('mainplaylist/getPlaylistData')
      .then((result) => {
        if (!result.success) {
          this.errMsg = result.errMsg;
        }
      });
  },
};
</script>

<style scoped>
  .active {
    background-color: lightblue;
  }
</style>
