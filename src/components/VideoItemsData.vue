<template>
  <div>
      <div
        :class="{active: item.id === playlist[activeIndex]}"
        v-for="(item, index) in items"
        @click="changeIndex(index)"
        :key="index"
        :index="index"
      >
        <h3>{{item.snippet.title}}</h3>
        <img :src="item.snippet.thumbnails.medium.url" :alt="item.snippet.title">
        <hr>
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
  },
  methods: {
    async getData(list) {
      const data = await DataService.getVideos(list);
      this.items = data.data.data.items;
    },
    changeIndex(index) {
      this.$store.commit('mainplaylist/changeNowPlayingVideoIndex', index);
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
