<template>
  <div @scroll.passive="handleScroll">
    <div
      v-for="(item, index) in items"
      :key="item.id"
      :index="index"
      :class="[{'video-item--active': item.id === playlist[activeIndex]}]"
      class="video-item"
    >
      <h3
        class="video-item__heading"
        :class="{
          'video-item__heading--active': item.id === playlist[activeIndex],
          'video-item__heading--active--ongoing': isOngoing && !isModerator,
        }"
        @click="changeIndex(index)"
      >
        {{ item.snippet.title }}
      </h3>
      <img
        class="video-item__img"
        :class="{ 'video-item__img--active': item.id === playlist[activeIndex] }"
        :src="item.snippet.thumbnails.medium.url"
        :alt="item.snippet.title"
      >
      <button
        v-if="isModerator"
        class="video-item__button--remove"
        :class="{
          'video-item__button--remove--active': item.id === playlist[activeIndex],
        }"
        @click="removeItemFromPlaylist(item.id)"
      >
        Remove
      </button>
      <p
        v-if="errMsg && chosenVideoId === item.id"
        class="main-playlist__message--error"
      >
        {{ errMsg }}
      </p>
    </div>
    <loading-animation v-if="loading" />
  </div>
</template>

<script setup>
import { ref, watch, computed } from 'vue'
import { useGroupStore } from '../stores/group';
import { useMainPlaylistStore } from '../stores/mainplaylist';
import { useRoute } from 'vue-router';
import LoadingAnimation from './LoadingAnimation.vue';
import { socket } from "@/socket";

const route = useRoute()
const groupStore = useGroupStore()
const mainplaylistStore = useMainPlaylistStore()
const props = defineProps({
  isOngoing: Boolean,
})
const errMsg = ref('')
const chosenVideoId = ref('')
const loading = ref(false)

const activeIndex = computed(() => {
  if (props.isOngoing) {
    return mainplaylistStore.ongoingPlaylist.videoIndex;
  }
  return mainplaylistStore.nowPlayingVideoIndex;
})
const playlist = computed(() => {
  return mainplaylistStore.playlist;
})
const items = computed(() => {
  return mainplaylistStore.items;
})
const isModerator = computed(() => {
  return groupStore.isModerator;
})
const isThereMoreToLoad = computed(() => {
  return playlist.value.length > items.value.length;
})
const isIndexAheadOfData = computed(() => {
  return mainplaylistStore.isIndexAheadOfData;
})
watch(activeIndex, (newValue, oldValue) => {
  if (newValue > oldValue) {
    if (isIndexAheadOfData.value) {
      loadMore();
    }
  }
})

function changeIndex(index) {
  if (props.isOngoing) {
    if (isModerator.value) {
      socket.emit('changeOngoingPlaylistVideoIndex', {
        videoIndex: index,
      });
    }
  } else {
    mainplaylistStore.changeNowPlayingVideoIndex(index);
  }
}

async function removeItemFromPlaylist(videoId) {
  try {
    const { items } = await mainplaylistStore.removeItemFromPlaylist({ videoId, id: route.params.id });
    socket.emit('updatePlaylist', {
      idsArray: items,
      itemData: videoId,
      type: 'deletion',
      alreadyIn: false,
      id: route.params.id,
    });
    nextTick(() => {
      const isRemovedBefore = playlist.value.indexOf(videoId) < activeIndex.value;
      if (isRemovedBefore) {
        changeIndex(activeIndex.value - 1);
      }
    });
  } catch (err) {
    errMsg.value = err.message;
    chosenVideoId.value = videoId;
    setTimeout(() => {
      errorMsg.value = '';
      chosenVideoId.value = '';
    }, 500);
  }
}

async function loadMore() {
  try {
    loading.value = true;
    const { increaseSetCount } = await mainplaylistStore.getPlaylistData();
    if (increaseSetCount) {
      mainplaylistStore.setSetCount();
    }
  } catch (err) {
    errorMsg.value = err.response.data.message;
  } finally {
    loading.value = false;
  }
}

async function handleScroll(e) {
  if (loading.value) {
    return;
  }
  if (e.target.scrollHeight - e.target.offsetHeight < e.target.scrollTop
  && isThereMoreToLoad.value) {
    await loadMore();
  }
}
</script>

<style lang="scss" scoped>
@import '../scss/main-playlist.scss';
@import '../scss/video-item.scss';
</style>
