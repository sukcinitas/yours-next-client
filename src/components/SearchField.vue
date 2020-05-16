<template>
  <div>
    <div>
      <input type="text" v-model="queryOrId">
      <button @click="search">Search</button>
      <input type="radio" id="searchAll" value="searchAll" v-model="picked">
      <label for="searchAll">search all</label>
      <input type="radio" id="searchPlaylists" value="searchPlaylists" v-model="picked">
      <label for="searchPlaylists">channel id</label>
      <input type="radio" id="searchPlaylistItems" value="searchPlaylistItems" v-model="picked">
      <label for="searchPlaylistItems">playlist id</label>
    </div>

    <div v-show="nextPageToken !== '' || prevPageToken !== ''">
      <button @click="getPrevPage" v-show="prevPageToken !== ''">Back</button>
      <button @click="getNextPage" v-show="nextPageToken !== ''">Next</button>
    </div>


    <div v-if="picked === 'searchAll'">
      <div v-for="item in items" :key="item.id.videoId" @click="add(item.id.videoId)">
        <h1>{{item.snippet.title}}</h1>
        <img :src="item.snippet.thumbnails.medium.url" :alt="item.snippet.title">
        <hr>
      </div>
    </div>

    <div v-else-if="picked === 'searchPlaylists'">
      <div v-for="item in playlists" :key="item.id" >
        <h1 @click="explorePlaylist(item.id)">{{item.snippet.title}}</h1>
        <img :src="item.snippet.thumbnails.medium.url" :alt="item.snippet.title">
        <hr>
      </div>
    </div>

    <div v-else-if="picked === 'searchPlaylistItems'">
      <div  v-for="item in items" :key="item.id" @click="add(item.id.videoId)">
        <h1>{{item.snippet.title}}</h1>
        <img :src="item.snippet.thumbnails.medium.url" :alt="item.snippet.title">
        <hr>
      </div>
    </div>

  </div>
</template>

<script>
import DataService from '../services/data.service';

export default {
  name: 'SearchField',
  data() {
    return {
      picked: 'searchAll', // searchAll, searchPlaylists, searchPlaylistItems
      queryOrId: '',
      items: [],
      playlists: [],
      prevPageToken: '',
      nextPageToken: '',
    };
  },
  methods: {
    async search() {
      let data;
      if (this.picked === 'searchAll') {
        data = await DataService.search(this.queryOrId);
        this.items = data.data.items;
      } else if (this.picked === 'searchPlaylists') {
        data = await DataService.getPlaylists(this.queryOrId);
        this.playlists = data.data.items;
      } else if (this.picked === 'searchPlaylistItems') {
        data = await DataService.getPlaylistItems(this.queryOrId);
        this.items = data.data.items;
      }
      this.prevPageToken = data.data.prevPageToken || '';
      this.nextPageToken = data.data.nextPageToken || '';
    },
    add(videoId) {
      this.$store.commit('mainplaylist/addId', videoId);
    },
    async explorePlaylist(id) {
      this.picked = 'searchPlaylistItems';
      const data = await DataService.getPlaylistItems(id);
      this.items = data.data.items;
    },
    async getNextPage() {
      let data;
      if (this.picked === 'searchAll') {
        data = await DataService.search(this.queryOrId, this.nextPageToken);
        this.items = data.data.items;
      } else if (this.picked === 'searchPlaylists') {
        data = await DataService.getPlaylists(this.queryOrId, this.nextPageToken);
        this.playlists = data.data.items;
      } else if (this.picked === 'searchPlaylistItems') {
        data = await DataService.getPlaylistItems(this.queryOrId, this.nextPageToken);
        this.items = data.data.items;
      }
      this.prevPageToken = data.data.prevPageToken || '';
      this.nextPageToken = data.data.nextPageToken || '';
    },
    async getPrevPage() {
      let data;
      if (this.picked === 'searchAll') {
        data = await DataService.search(this.queryOrId, this.prevPageToken);
        this.items = data.data.items;
      } else if (this.picked === 'searchPlaylists') {
        data = await DataService.getPlaylists(this.queryOrId, this.prevPageToken);
        this.playlists = data.data.items;
      } else if (this.picked === 'searchPlaylistItems') {
        data = await DataService.getPlaylistItems(this.queryOrId, this.prevPageToken);
        this.items = data.data.items;
      }
      this.prevPageToken = data.data.prevPageToken || '';
      this.nextPageToken = data.data.nextPageToken || '';
    },
  },
};
</script>
