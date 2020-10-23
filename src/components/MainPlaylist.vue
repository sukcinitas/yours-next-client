<template>
  <div class="main-playlist">
    <headerPanel :leaveBtn="false" :homeBtn="true" :backBtn="true"></headerPanel>
    <h4 class="main-playlist__title--ongoing">{{title}}</h4>
    <button
      v-if="isModerator"
      class="main-playlist__button"
      @click="gotToSearch"
    >Add some videos!
    </button>
    <template v-if="initialPlaylistLength !== 0">
      <ongoing-video-player
        class="main-playlist__video-player"
      >
      </ongoing-video-player>
      <video-items-data
        :isOngoing="true"
        class="main-playlist__video-items"
      ></video-items-data>
    </template>
    <members-list :isBottom="false"></members-list>
    <message-box></message-box>
  </div>
</template>

<script>
import OngoingVideoPlayer from './OngoingVideoPlayer';
import VideoItemsData from './VideoItemsData';
import MembersList from './MembersList';
import MessageBox from './MessageBox';
import HeaderPanel from './HeaderPanel';

export default {
  name: 'MainPlaylist',
  components: { OngoingVideoPlayer, VideoItemsData, MembersList, MessageBox, HeaderPanel },
  data() {
    return {
    };
  },
  computed: {
    initialPlaylistLength() {
      return this.$store.state.mainplaylist.idsArray.length;
    },
    title() {
      return this.$store.state.mainplaylist.title;
    },
  },
  methods: {
    gotToSearch() {
      this.$router.push({ name: 'SearchField' });
    },
  },
};
</script>

<style lang="scss" scoped>
  @import '@/scss/main-playlist.scss';
</style>
