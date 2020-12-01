/* eslint-disable no-console */
<template>
  <div class="search">
    <headerPanel :leaveBtn="false" :homeBtn="true" :backBtn="true"></headerPanel>
    <p class="search__message--error" v-if="errorMessage && !chosenVideoId">{{errorMessage}}</p>
    <p class="search__message--success"
    v-if="successMessage && !chosenVideoId">{{successMessage}}</p>
    <div class="search__search-field">
      <input type="text" v-model="queryOrId" @input="typing" class=search__input>
      <button @click="search" class="search__button">Search</button>
    </div>

    <div class="search__search-options">
      <input type="radio" id="searchAll" name="searchParameters" value="searchAll" v-model="picked"
      @change="empty">
      <label for="searchAll" class="search__label">by phrase</label>
      <input type="radio" id="searchPlaylists" value="searchPlaylists"
      v-model="picked" name="searchParameters"  @change="empty">
      <label for="searchPlaylists" class="search__label">by channel id</label>
      <input type="radio" id="searchPlaylistItems" value="searchPlaylistItems"
      v-model="picked" name="searchParameters"  @change="empty">
      <label for="searchPlaylistItems" class="search__label">by playlist id</label>
    </div>

    <div v-if="picked === 'searchAll'" class="search__search-results">
      <div v-for="item in items" :key="item.id.videoId" class="search__search-result">
        <p class="search__message--error"
v-if="errorMessage && chosenVideoId === item.id.videoId">{{errorMessage}}</p>
        <p class="search__message--success"
v-if="successMessage && chosenVideoId === item.id.videoId">{{successMessage}}</p>
        <h1 class="search__heading">{{item.snippet.title}}</h1>
        <img class="search-img"
        :src="item.snippet.thumbnails.medium.url"
        :alt="item.snippet.title">
        <button class="search__button--add"
        @click="add(item.id.videoId)">Add</button>
      </div>
    </div>

    <div v-else-if="picked === 'searchPlaylists'" class="search__search-results">
      <h6 class="search__subheading" v-if="playlists.length > 0">Playlists</h6>
      <div v-for="item in playlists" :key="item.id"
      class="search__search-result search__search-result--playlist">
        <h1 class="search__heading search__heading--playlist">{{item.snippet.title}}</h1>
        <!-- <img class="search__img search__img--playlist"
        :src="item.snippet.thumbnails.medium.url"
        :alt="item.snippet.title"> -->
        <button class="search__button--playlist"
        @click="explorePlaylist(item.id, item.snippet.title)">
          <font-awesome-icon :icon="['fas', 'chevron-right']"></font-awesome-icon>
        </button>
      </div>
    </div>

    <div v-else-if="picked === 'searchPlaylistItems'" class="search__search-results">
      <template v-if="isExploring">
        <h6 class="search__subheading">{{playlistName}}</h6>
        <button
          v-if="isExploring"
          class="search__button--centered"
          @click="backToList"
        >
          Back to playlist list
        </button>
      </template>
      <div
        class="search__search-result"
        v-for="item in items"
        :key="item.snippet.resourceId.videoId"
      >
        <p class="search__message--error"
v-if="errorMessage && chosenVideoId === item.snippet.resourceId.videoId">{{errorMessage}}</p>
        <p class="search__message--success"
v-if="successMessage && chosenVideoId === item.snippet.resourceId.videoId">{{successMessage}}</p>
        <h1  class="search__heading">{{item.snippet.title}}</h1>
        <img class="search__img" :src="item.snippet.thumbnails.medium.url"
        :alt="item.snippet.title">
        <button class="search__button--add"
        @click="add(item.snippet.resourceId.videoId)">Add</button>
      </div>
    </div>

    <div v-show="nextPageToken !== '' || prevPageToken !== ''" class="search__pages">
      <button
        @click="getPage('prev')" v-show="prevPageToken !== ''"
        class="search__button--small search__button--left">Previous
      </button>
      <button
        @click="getPage('next')" v-show="nextPageToken !== '' && items.length !== 0"
        class="search__button--small search__button--right">Next
      </button>
    </div>
    <members-list :isBottom="false"></members-list>
    <message-box></message-box>
  </div>
</template>

<script>
import DataService from '../services/data.service';
import MembersList from './MembersList';
import MessageBox from './MessageBox';
import HeaderPanel from './HeaderPanel';

export default {
  name: 'SearchField',
  components: { MembersList, MessageBox, HeaderPanel },
  data() {
    return {
      picked: 'searchPlaylistItems', // searchAll, searchPlaylists, searchPlaylistItems
      queryOrId: 'PLcCyuE3mscVFQbqG4SbusOGJbrkaJoeY4',
      channelId: '',
      playlistName: '',
      items: [],
      playlists: [],
      prevPageToken: '',
      nextPageToken: '',
      errorMessage: '',
      successMessage: '',
      chosenVideoId: '',
      isExploring: false,
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
        this.channelId = this.queryOrId;
      } else if (this.picked === 'searchPlaylistItems') {
        data = await DataService.getPlaylistItems(this.queryOrId);
        this.items = data.data.data.items;
      }
      // eslint-disable-next-line no-console
      console.log(data);
      this.prevPageToken = data.data.data.prevPageToken || '';
      this.nextPageToken = data.data.data.nextPageToken || '';
    },
    async add(videoId) {
      this.chosenVideoId = videoId;
      await this.$store.dispatch('mainplaylist/addItemToPlaylist', { item: videoId })
        .then((result) => {
          if (!result.success) {
            this.errorMessage = result.errMsg;
          } else {
            this.successMessage = result.successMsg;
          }
          setTimeout(() => {
            this.errorMessage = '';
            this.successMessage = '';
            this.chosenVideoId = '';
          }, 550);
        });
    },
    async explorePlaylist(id, playlistName) {
      const data = await DataService.getPlaylistItems(id);
      this.items = data.data.data.items;
      this.prevPageToken = data.data.data.prevPageToken || '';
      this.nextPageToken = data.data.data.nextPageToken || '';
      this.picked = 'searchPlaylistItems';
      this.queryOrId = id;
      this.playlistName = playlistName;
      this.isExploring = true;
    },
    async getPage(direction) {
      let data;
      if (this.picked === 'searchAll') {
        data = await DataService.search(this.queryOrId, direction === 'next' ? this.nextPageToken : this.prevPageToken);
        this.items = data.data.data.items;
      } else if (this.picked === 'searchPlaylists') {
        data = await DataService.getPlaylists(this.queryOrId, direction === 'next' ? this.nextPageToken : this.prevPageToken);
        this.playlists = data.data.data.items;
      } else if (this.picked === 'searchPlaylistItems') {
        data = await DataService.getPlaylistItems(this.queryOrId, direction === 'next' ? this.nextPageToken : this.prevPageToken);
        this.items = data.data.data.items;
      }
      this.prevPageToken = data.data.data.prevPageToken || '';
      this.nextPageToken = data.data.data.nextPageToken || '';
      document.body.scrollTop = 0; // For Safari
      document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
    },
    typing() {
      this.playlists = [];
      this.items = [];
      if (this.queryOrId.substring(0, 2) === 'PL') {
        this.picked = 'searchPlaylistItems';
      } else if (this.queryOrId.substring(0, 2) === 'UC') {
        this.picked = 'searchPlaylists';
      } else {
        this.picked = 'searchAll';
      }
    },
    empty() {
      this.playlists = [];
      this.items = [];
      this.queryOrId = '';
      this.channelId = '';
      this.prevPageToken = '';
      this.nextPageToken = '';
    },
    backToList() {
      this.picked = 'searchPlaylists';
      this.queryOrId = this.channelId;
      this.playlistName = '';
      this.isExploring = false;
      this.prevPageToken = '';
      this.nextPageToken = '';
    },
  },
};
</script>


<style lang="scss" scoped>
  @import '@/scss/search-field.scss';
</style>
