<template>
  <div class="search">
    <p v-if="message">{{message}}</p>
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

    <div v-if="picked === 'searchAll'" class="search__search-result">
      <div v-for="item in items" :key="item.id.videoId" @click="add(item.id.videoId)">
        <h1 class="search__heading">{{item.snippet.title}}</h1>
        <img class="search__img" :src="item.snippet.thumbnails.medium.url"
        :alt="item.snippet.title">
      </div>
    </div>

    <div v-else-if="picked === 'searchPlaylists'" class="search__search-result">
      <div v-for="item in playlists" :key="item.id" >
        <h1 class="search__heading" @click="explorePlaylist(item.id)">{{item.snippet.title}}</h1>
        <img class="search__img" :src="item.snippet.thumbnails.medium.url"
        :alt="item.snippet.title">
        <hr>
      </div>
    </div>

    <div v-else-if="picked === 'searchPlaylistItems'">
      <div
       class="search__search-result"
        v-for="item in items"
        :key="item.snippet.resourceId.videoId"
        @click="add(item.snippet.resourceId.videoId)"
      >
        <h1  class="search__heading">{{item.snippet.title}}</h1>
        <img class="search__img" :src="item.snippet.thumbnails.high.url"
        :alt="item.snippet.title">
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
      await this.$store.dispatch('mainplaylist/addItemToPlaylist', { item: videoId })
        .then((result) => {
          if (!result.success) {
            this.message = result.errMsg;
          } else {
            this.$socket.emit('updatePlaylist', { idsArray: result.items, items: result.itemsData });
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


<style lang="scss" scoped>
  @import '@/scss/shared-styles-forms.scss';
  @import '@/scss/shared-styles-buttons.scss';
</style>
