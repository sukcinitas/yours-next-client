<template>
  <div class="main-playlist">
    <headerPanel
      :leaveBtn="false"
      :homeBtn="true"
      :backBtn="true"
    ></headerPanel>
    <h4 class="main-playlist__title">{{ title }}</h4>
    <button class="main-playlist__button" @click="gotToSearch">
      Add some videos!
    </button>
    <template v-if="initialPlaylistLength !== 0">
      <ordinary-video-player class="main-playlist__video-player">
      </ordinary-video-player>
      <video-items-data
        :isOngoing="false"
        class="main-playlist__video-items"
      ></video-items-data>
    </template>
    <members-list :isBottom="false"></members-list>
    <message-box></message-box>
  </div>
</template>

<script>
import OrdinaryVideoPlayer from './OrdinaryVideoPlayer';
import VideoItemsData from './VideoItemsData';
import MembersList from './MembersList';
import MessageBox from './MessageBox';
import HeaderPanel from './HeaderPanel';

export default {
  name: 'OrdinaryPlaylist',
  components: {
    OrdinaryVideoPlayer,
    VideoItemsData,
    MembersList,
    MessageBox,
    HeaderPanel,
  },
  data() {
    return {};
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
