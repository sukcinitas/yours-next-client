<template>
  <div>
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
      this.$store.commit('mainplaylist/changeNowPlayingVideoIndex', index);
    },
    removeItemFromPlaylist(videoId) {
      this.$socket.emit('addItemToPendingRemovalList', { item: videoId });
      this.$socket.emit('updatePlaylist', {
        idsArray: this.playlist.filter(item => item !== videoId),
        items: this.items.filter(item => item.id !== videoId),
      });
    },
  },
  mounted() {
    this.$store.dispatch('mainplaylist/getPlaylistData');
  },
};
</script>

<style scoped>
  .active {
    background-color: lightblue;
  }
</style>
