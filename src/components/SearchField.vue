<template>
  <div>
    <p v-if="message">{{message}}</p>
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
      <div
        v-for="item in items"
        :key="item.snippet.resourceId.videoId"
        @click="add(item.snippet.resourceId.videoId)"
      >
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
      message: '',
    };
  },
  methods: {
    async search() {
      let data;
      if (this.picked === 'searchAll') {
        data = await DataService.search(this.queryOrId);
        this.items = data.data.data.items;
      } else if (this.picked === 'searchPlaylists') {
        data = await DataService.getPlaylists(this.queryOrId);
        this.playlists = data.data.data.items;
      } else if (this.picked === 'searchPlaylistItems') {
        data = await DataService.getPlaylistItems(this.queryOrId);
        this.items = data.data.data.items;
      }
      this.prevPageToken = data.data.data.prevPageToken || '';
      this.nextPageToken = data.data.data.nextPageToken || '';
    },
    async add(videoId) {
      this.$store.dispatch('mainplaylist/addItemToPlaylist', { item: videoId })
        .then(() => {
          if (this.$store.state.mainplaylist.errMsg) {
            this.message = this.$store.state.group.errMsg;
          } else {
            this.message = 'Successfully added!';
            setTimeout(() => {
              this.message = '';
            }, 500);
          }
        });
    },
    async explorePlaylist(id) {
      const data = await DataService.getPlaylistItems(id);
      this.items = data.data.data.items;
      this.picked = 'searchPlaylistItems';
    },
    async getNextPage() {
      let data;
      if (this.picked === 'searchAll') {
        data = await DataService.search(this.queryOrId, this.nextPageToken);
        this.items = data.data.data.items;
      } else if (this.picked === 'searchPlaylists') {
        data = await DataService.getPlaylists(this.queryOrId, this.nextPageToken);
        this.playlists = data.data.data.items;
      } else if (this.picked === 'searchPlaylistItems') {
        data = await DataService.getPlaylistItems(this.queryOrId, this.nextPageToken);
        this.items = data.data.data.items;
      }
      this.prevPageToken = data.data.data.prevPageToken || '';
      this.nextPageToken = data.data.data.nextPageToken || '';
    },
    async getPrevPage() {
      let data;
      if (this.picked === 'searchAll') {
        data = await DataService.search(this.queryOrId, this.prevPageToken);
        this.items = data.data.data.items;
      } else if (this.picked === 'searchPlaylists') {
        data = await DataService.getPlaylists(this.queryOrId, this.prevPageToken);
        this.playlists = data.data.data.items;
      } else if (this.picked === 'searchPlaylistItems') {
        data = await DataService.getPlaylistItems(this.queryOrId, this.prevPageToken);
        this.items = data.data.data.items;
      }
      this.prevPageToken = data.data.data.prevPageToken || '';
      this.nextPageToken = data.data.data.nextPageToken || '';
    },
  },
};
</script>
