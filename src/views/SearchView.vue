/* eslint-disable no-console */
<template>
  <div class="search">
    <header-panel
      :leaveBtn="false"
      :homeBtn="true"
      :backBtn="true"
    ></header-panel>
    <div class="search__search-field">
      <input
        type="text"
        v-model="queryOrId"
        @input="typing"
        class="search__input"
      />
      <button @click="search" class="search__button">Search</button>
    </div>

    <div class="search__search-options">
      <input
        type="radio"
        id="searchAll"
        name="searchParameters"
        value="searchAll"
        v-model="picked"
        @change="empty"
      />
      <label for="searchAll" class="search__label">by phrase</label>
      <input
        type="radio"
        id="searchPlaylists"
        value="searchPlaylists"
        v-model="picked"
        name="searchParameters"
        @change="empty"
      />
      <label for="searchPlaylists" class="search__label">by channel id</label>
      <input
        type="radio"
        id="searchPlaylistItems"
        value="searchPlaylistItems"
        v-model="picked"
        name="searchParameters"
        @change="empty"
      />
      <label for="searchPlaylistItems" class="search__label"
        >by playlist id</label
      >
    </div>

    <loading-animation v-if="loading" />
    <template v-else>
      <div v-if="picked === 'searchAll'" class="search__search-results">
        <div
          v-for="item in items"
          :key="item.id.videoId"
          class="video-item"
        >
          <p
            class="search__message--error"
            v-if="errorMessage && chosenVideoId === item.id.videoId"
          >
            {{ errorMessage }}
          </p>
          <p
            class="search__message--success"
            v-if="successMessage && chosenVideoId === item.id.videoId"
          >
            {{ successMessage }}
          </p>
          <h1 class="video-item__heading">{{ item.snippet.title }}</h1>
          <img
            class="video-item__img"
            :src="item.snippet.thumbnails.medium.url"
            :alt="item.snippet.title"
          />
          <button
            v-if="item.id.videoId !== chosenVideoId"
            :disabled="isProcessing"
            class="video-item__button--add" @click="add(item.id.videoId)"
          >
            Add
          </button>
        </div>
      </div>

      <div
        v-else-if="picked === 'searchPlaylists'"
        class="search__search-results"
      >
        <h6 class="search__subheading" v-if="playlists.length > 0">Playlists</h6>
        <div
          v-for="item in playlists"
          :key="item.id"
          class="search__search-result search__search-result--playlist"
        >
          <h1 class="search__heading search__heading--playlist">
            {{ item.snippet.title }}
          </h1>
          <button
            class="search__button--playlist"
            @click="explorePlaylist(item.id, item.snippet.title)"
          >
            <font-awesome-icon
              :icon="['fas', 'chevron-right']"
            ></font-awesome-icon>
          </button>
        </div>
      </div>

      <div
        v-else-if="picked === 'searchPlaylistItems'"
        class="search__search-results"
      >
        <template v-if="isExploring">
          <h6 class="search__subheading">{{ playlistName }}</h6>
          <button
            v-if="isExploring"
            class="search__button--centered"
            @click="backToList"
          >
            Back to playlist list
          </button>
        </template>
        <div
          class="video-item"
          v-for="item in items"
          :key="item.snippet.resourceId.videoId"
        >
          <p
            class="search__message--error"
            v-if="
              errorMessage && chosenVideoId === item.snippet.resourceId.videoId
            "
          >
            {{ errorMessage }}
          </p>
          <p
            class="search__message--success"
            v-if="
              successMessage && chosenVideoId === item.snippet.resourceId.videoId
            "
          >
            {{ successMessage }}
          </p>
          <h1 class="video-item__heading">{{ item.snippet.title }}</h1>
          <img
            class="video-item__img"
            :src="item.snippet.thumbnails.medium.url"
            :alt="item.snippet.title"
          />
          <button
            v-if="item.snippet.resourceId.videoId !== chosenVideoId"
            :disabled="isProcessing"
            class="video-item__button--add"
            @click="add(item.snippet.resourceId.videoId)"
          >
            Add
          </button>
        </div>
      </div>

      <div
        v-show="nextPageToken !== '' || prevPageToken !== ''"
        class="search__pages"
      >
        <button
          @click="getPage('prev')"
          v-show="prevPageToken !== '' && !loading"
          class="search__button--small search__button--left"
        >
          Previous
        </button>
        <button
          @click="getPage('next')"
          v-show="nextPageToken !== '' && items.length !== 0 && !loading"
          class="search__button--small search__button--right"
        >
          Next
        </button>
      </div>
    </template>
    <members-list :isBottom="false"></members-list>
    <message-box></message-box>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import DataService from '../services/data.service';
import MembersList from '../components/MembersList.vue';
import MessageBox from '../components/MessageBox.vue';
import HeaderPanel from '../components/HeaderPanel.vue';
import LoadingAnimation from '../components/LoadingAnimation.vue';
import { useMainPlaylistStore } from '../stores/mainplaylist';
const route = useRoute()
const mainplaylistStore = useMainPlaylistStore()
const picked = ref('searchPlaylistItems') // searchAll, searchPlaylists, searchPlaylistItems
const queryOrId = ref('PLdKHthnnMgzfnju7k92PM5Gg4Y0FRssVw')
const channelId = ref('')
const playlistName = ref('')
const items = ref([])
const playlists = ref([])
const prevPageToken = ref('')
const nextPageToken = ref('')
const errorMessage = ref('')
const successMessage = ref('')
const chosenVideoId = ref('')
const isExploring = ref(false)
const loading = ref(false)
const isProcessing = ref(false)

onMounted(async () => {
  try {
    const { id } = route.params;
    mainplaylistStore.setId({ id });
    await mainplaylistStore.getPlaylist({ id });
    const { increaseSetCount } = await mainplaylistStore.getPlaylistData();
    if (increaseSetCount) {
      mainplaylistStore.setSetCount();
    }
  } catch (err) {
    errMsg.value = err.response.data.message;
  }
})

async function search() {
  try {
    loading.value = true;
    let data = null;
    if (picked.value === 'searchAll') {
      data = await DataService.search(queryOrId.value);
      items.value = data.data.data.items;
    } else if (picked.value === 'searchPlaylists') {
      data = await DataService.getPlaylists(queryOrId.value);
      playlists.value = data.data.data.items;
      channelId.value = queryOrId.value;
    } else if (picked.value === 'searchPlaylistItems') {
      data = await DataService.getPlaylistItems(queryOrId.value);
      items.value = data.data.data.items;
    }
    prevPageToken.value = data.data.data.prevPageToken || '';
    nextPageToken.value = data.data.data.nextPageToken || '';
  } catch (err) {
    errorMessage.value = 'Something went wrong!';
  } finally {
    loading.value = false;
  }
}

async function add(videoId) {
  try {
    isProcessing.value = true;
    chosenVideoId.value = videoId;
    const { successMsg } = await mainplaylistStore.addItemToPlaylist({ item: videoId, id: route.params.id });
    successMessage.value = successMsg;
  } catch (err) {
    errorMessage.value = err.response ? err.response.data.message : err.message;
  } finally {
    setTimeout(() => {
      errorMessage.value = '';
      successMessage.value = '';
      chosenVideoId.value = '';
      isProcessing.value = false;
    }, 500);
  }
}

async function explorePlaylist(id, playlistName) {
  const data = await DataService.getPlaylistItems(id);
  items.value = data.data.data.items;
  prevPageToken.value = data.data.data.prevPageToken || '';
  nextPageToken.value = data.data.data.nextPageToken || '';
  picked.value = 'searchPlaylistItems';
  queryOrId.value = id;
  playlistName.value = playlistName;
  isExploring.value = true;
}

async function getPage(direction) {
  try {
    loading.value = true;
    let data = null;
    if (picked.value === 'searchAll') {
      data = await DataService.search(
        queryOrId.value,
        direction === 'next' ? nextPageToken.value : prevPageToken.value,
      );
      items.value = data.data.data.items;
    } else if (picked.value === 'searchPlaylists') {
      data = await DataService.getPlaylists(
        queryOrId.value,
        direction === 'next' ? nextPageToken.value : prevPageToken.value,
      );
      playlists.value = data.data.data.items;
    } else if (picked.value === 'searchPlaylistItems') {
      data = await DataService.getPlaylistItems(
        queryOrId.value,
        direction === 'next' ? nextPageToken.value : prevPageToken.value,
      );
      items.value = data.data.data.items;
    }
    prevPageToken.value = data.data.data.prevPageToken || '';
    nextPageToken.value = data.data.data.nextPageToken || '';
  } catch (err) {
    errorMessage.value = 'Something went wrong!';
  } finally {
    loading.value = false;
    window.scrollTo(0, 0);
  }
}

function typing() {
  playlists.value = [];
  items.value = [];
  if (queryOrId.value.substring(0, 2) === 'PL') {
    picked.value = 'searchPlaylistItems';
  } else if (queryOrId.value.substring(0, 2) === 'UC') {
    picked.value = 'searchPlaylists';
  } else {
    picked.value = 'searchAll';
  }
}

function empty() {
  playlists.value = [];
  items.value = [];
  channelId.value = '';
  prevPageToken.value = '';
  nextPageToken.value = '';
}

function backToList() {
  picked.value = 'searchPlaylists';
  queryOrId.value = channelId;
  playlistName.value = '';
  isExploring.value = false;
  prevPageToken.value = '';
  nextPageToken.value = '';
}

</script>

<style lang="scss" scoped>
@import '../scss/search-field.scss';
@import '../scss/video-item.scss';
</style>
