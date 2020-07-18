<template>
  <div class="search">
    <p>Playlist id: PLcCyuE3mscVFQbqG4SbusOGJbrkaJoeY4</p>
    <p class="search__message--error" v-if="errorMessage && !chosenVideoId">{{errorMessage}}</p>
    <p class="search__message--success"
    v-if="successMessage && !chosenVideoId">{{successMessage}}</p>
    <div class="search__search-field">
      <input type="text" v-model="queryOrId" class=search__input>
      <button @click="search" class="search__button">Search</button>
    </div>

    <div class="search__search-options">
      <input type="radio" id="searchAll" value="searchAll" v-model="picked">
      <label for="searchAll" class="search__label">by phrase</label>
      <input type="radio" id="searchPlaylists" value="searchPlaylists" v-model="picked">
      <label for="searchPlaylists" class="search__label">by channel id</label>
      <input type="radio" id="searchPlaylistItems" value="searchPlaylistItems" v-model="picked">
      <label for="searchPlaylistItems" class="search__label">by playlist id</label>
    </div>

    <div v-show="nextPageToken !== '' || prevPageToken !== ''" class="search__pages">
      <button
        @click="getPrevPage" v-show="prevPageToken !== ''"
        class="search__button--small">Back
      </button>
      <button
        @click="getNextPage" v-show="nextPageToken !== ''"
        class="search__button--small">Next
      </button>
    </div>

    <div v-if="picked === 'searchAll'" class="search__search-results">
      <div v-for="item in items" :key="item.id.videoId"
      @click="add(item.id.videoId)" class="search__search-result">
        <p class="search__message--error"
v-if="errorMessage && chosenVideoId === item.id.videoId">{{errorMessage}}</p>
        <p class="search__message--success"
v-if="successMessage && chosenVideoId === item.id.videoId">{{successMessage}}</p>
        <h1 class="search__heading">{{item.snippet.title}}</h1>
        <img class="search__img" :src="item.snippet.thumbnails.medium.url"
        :alt="item.snippet.title">
      </div>
    </div>

    <div v-else-if="picked === 'searchPlaylists'" class="search__search-results">
      <div v-for="item in playlists" :key="item.id" class="search__search-result">
        <h1 class="search__heading" @click="explorePlaylist(item.id)">{{item.snippet.title}}</h1>
        <img class="search__img" :src="item.snippet.thumbnails.medium.url"
        :alt="item.snippet.title">
      </div>
    </div>

    <div v-else-if="picked === 'searchPlaylistItems'" class="search__search-results">
      <div
        class="search__search-result"
        v-for="item in items"
        :key="item.snippet.resourceId.videoId"
        @click="add(item.snippet.resourceId.videoId)"
      >
        <p class="search__message--error"
v-if="errorMessage && chosenVideoId === item.snippet.resourceId.videoId">{{errorMessage}}</p>
        <p class="search__message--success"
v-if="successMessage && chosenVideoId === item.snippet.resourceId.videoId">{{successMessage}}</p>
        <h1  class="search__heading">{{item.snippet.title}}</h1>
        <img class="search__img" :src="item.snippet.thumbnails.medium.url"
        :alt="item.snippet.title">
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
      errorMessage: '',
      successMessage: '',
      chosenVideoId: '',
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
      await this.$store.dispatch('mainplaylist/addItemToPlaylist', { item: videoId })
        .then((result) => {
          if (!result.success) {
            this.errorMessage = result.errMsg;
            this.chosenVideoId = videoId;
          } else {
            this.$socket.emit('updatePlaylist', { idsArray: result.items, items: result.itemsData });
            this.successMessage = 'Successfully added!';
            this.chosenVideoId = videoId;
            setTimeout(() => {
              this.errorMessage = '';
              this.successMessage = '';
              this.chosenVideoId = '';
            }, 500);
          }
        });
    },
    async explorePlaylist(id) {
      const data = await DataService.getPlaylistItems(id);
      this.items = data.data.data.items;
      this.prevPageToken = data.data.data.prevPageToken || '';
      this.nextPageToken = data.data.data.nextPageToken || '';
      this.picked = 'searchPlaylistItems';
      this.queryOrId = id;
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


<style lang="scss" scoped>
  @import '@/scss/search-field.scss';
</style>
