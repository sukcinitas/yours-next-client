<template>
  <div class="main-playlist">
    <headerPanel
      :leaveBtn="false"
      :homeBtn="true"
      :backBtn="true"
    >
    </headerPanel>
    <h4 class="main-playlist__title"
    >
      {{ title }}
    </h4>
    <button class="main-playlist__button"
      @click="() => router.push({ path: `/search/${$route.params.id}` })"
    >
      Add some videos!
    </button>
    <template v-if="initialPlaylistLength !== 0 && !loading">
      <ordinary-video-player
        class="main-playlist__video-player"
      >
      </ordinary-video-player>
      <video-items-data
        :isOngoing="false"
        class="main-playlist__video-items"
      >
      </video-items-data>
    </template>
    <loading-animation v-if="loading" />
    <members-list :isBottom="false"></members-list>
    <message-box></message-box>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router';
import { useMainPlaylistStore } from '../stores/mainplaylist';
import OrdinaryVideoPlayer from '../components/OrdinaryVideoPlayer.vue';
import VideoItemsData from '../components/VideoItemsData.vue';
import MembersList from '../components/MembersList.vue';
import MessageBox from '../components/MessageBox.vue';
import HeaderPanel from '../components/HeaderPanel.vue';
import LoadingAnimation from '../components/LoadingAnimation.vue';

const route = useRoute()
const router = useRouter()
const mainplaylistStore = useMainPlaylistStore()
const loading = ref(false)
const errMsg = ref('')

const initialPlaylistLength = computed(() => {
  return mainplaylistStore.length
})
const title = computed(() => {
  return mainplaylistStore.title
})

onMounted(async () => {
try {
  loading.value = true;
  const { id } = route.params;
  mainplaylistStore.setId({ id });
  await mainplaylistStore.getPlaylist({ id });
  if (mainplaylistStore.setCount >= 1) {
    // because only one set of items is loaded
    return;
  }
  const { increaseSetCount } = await mainplaylistStore.getPlaylistData()
  if (increaseSetCount) {
    mainplaylistStore.setSetCount();
  }
  } catch (err) {
    console.log(err, 'err')
    errMsg.value = err.response.data.message;
  } finally {
    loading.value = false;
  }
})
</script>

<style lang="scss" scoped>
@import '../scss/main-playlist.scss';
</style>
