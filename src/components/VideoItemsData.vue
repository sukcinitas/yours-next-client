<template>
  <div>
      <div
        :class="{active: item.id === playlist[activeIndex]}"
        v-for="item in items"
        :key="item.id"
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
      // eslint-disable-next-line no-console
      console.log(data);
      this.items = data.data.data.items;
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
