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
import DataService from '../services/data.service';

export default {
  name: 'VideoItemsData',
  data() {
    return {
      items: [],
      errMsg: '',
    };
  },
  props: {
    initialPlaylist: Array,
    nowPlayingVideoIndex: Number,
  },
  computed: {
    activeIndex() {
      return this.nowPlayingVideoIndex;
    },
    playlist() {
      return this.initialPlaylist;
    },
    isModerator() {
      return this.$store.getters['group/isModerator'];
    },
  },
  methods: {
    async getData(list) {
      const data = await DataService.getVideos(list);
      this.items = data.data.data.items;
    },
    changeIndex(index) {
      this.$store.commit('mainplaylist/changeNowPlayingVideoIndex', index);
    },
    removeItemFromPlaylist(videoId) {
      this.$store.commit('mainplaylist/addItemToPendingRemovalList', { item: videoId });
      this.items = this.items.filter(item => item.id !== videoId);
      this.$store.commit('mainplaylist/setPlaylist', { items: this.playlist.filter(item => item !== videoId) });
    },
  },
  mounted() {
    this.getData(this.playlist.join(','));
  },
};
</script>

<style scoped>
  .active {
    background-color: lightblue;
  }
</style>
