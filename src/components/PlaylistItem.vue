<template>
  <div class="playlist">
    <div class="playlist__details">
      <h3 class="playlist__name">
        {{ props.playlist.title }}
      </h3>
      <p>{{ props.playlist.items.length }} items</p>
      <p>{{ dateString(props.playlist.updatedAt) }}</p>
    </div>
    <p
      v-if="errMsg"
      class="playlist__message--error"
    >
      {{ errMsg }}
    </p>
    <div class="playlist__buttons">
      <button
        class="playlist__button"
        @click="() => router.push({ path: `/playlist/${playlist._id}` })"
      >
        <font-awesome-icon :icon="['fas', 'chevron-right']" />
      </button>
      <button
        v-if="groupStore.isModerator"
        class="playlist__button"
        title="Delete?"
        @click="toggleDeletionBox"
      >
        <font-awesome-icon :icon="['fas', 'trash']" />
        <deletion-box
          class="deletion-box"
          :class="{ 'deletion-box--hidden': !isDeletionBoxShown}"
          @confirm="deletePlaylist(props.playlist._id)" 
          @cancel="cancelDeletion"
        />
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useGroupStore } from '../stores/group';
import { usePlaylistStore } from '../stores/playlist';
import { useRouter } from 'vue-router';
import DeletionBox from './DeletionBox.vue';
import formatDate from '../util/formatDate';

const router = useRouter()
const props = defineProps({
  playlist: {
    type: Object,
  },
})
const groupStore = useGroupStore()
const playlistStore = usePlaylistStore()
const isDeletionBoxShown = ref(false)
const errMsg = ref('')

async function deletePlaylist(id) {
  try {
    await playlistStore.deletePlaylist({ id });
  } catch (err) {
    errMsg.value = err?.response?.data?.message || 'Oops...';
    setTimeout(() => {
      errMsg.value = ''
    }, 2000);
  }
}

function toggleDeletionBox() {
  isDeletionBoxShown.value = !isDeletionBoxShown.value;
}

function cancelDeletion() {
  isDeletionBoxShown.value = false;
}

function dateString(date) {
  if (!date) {
    return '';
  }
  return `last updated on ${formatDate(date)}`;
}

</script>

<style lang="scss" scoped>
@import '../scss/playlist-item.scss';
</style>
