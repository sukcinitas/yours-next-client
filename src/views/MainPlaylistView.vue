<template>
  <div class="main-playlist">
    <headerPanel
      :leaveBtn="false"
      :homeBtn="true"
      :backBtn="true"
    >
    </headerPanel>
    <h4 class="main-playlist__title--ongoing">{{ title }}</h4>
    <template v-if="initialPlaylistLength !== 0 && !loading">
      <ongoing-video-player class="main-playlist__video-player">
      </ongoing-video-player>
      <video-items-data
        :isOngoing="true"
        class="main-playlist__video-items"
      ></video-items-data>
    </template>
    <loading-animation v-if="loading" />
    <members-list :isBottom="false"></members-list>
    <message-box></message-box>
  </div>
</template>

<script>
// import OngoingVideoPlayer from '../components/OngoingVideoPlayer.vue';
// import VideoItemsData from '../components/VideoItemsData.vue';
// import MembersList from '../components/MembersList.vue';
// import MessageBox from '../components/MessageBox.vue';
// import HeaderPanel from '../components/HeaderPanel.vue';
// import LoadingAnimation from '../components/LoadingAnimation.vue';
import { socket } from "@/socket";

export default {
  // name: 'MainPlaylist',
  // components: {
  //   OngoingVideoPlayer,
  //   VideoItemsData,
  //   MembersList,
  //   MessageBox,
  //   HeaderPanel,
  //   LoadingAnimation,
  // },
  data() {
    return {
      loading: false,
    };
  },
  computed: {
    initialPlaylistLength() {
      return this.$store.getters['mainplaylist/length'];
    },
    title() {
      return this.$store.getters['mainplaylist/title'];
    },
    isModerator() {
      return this.$store.getters['group/isModerator'];
    },
  },

  async mounted() {
    const { id } = this.$route.params;
    if (this.isModerator) {
      socket.emit('setOngoingPlaylist', {
        id,
        videoIndex: 0,
        time: 0,
        paused: false,
      });
    }
    try {
      this.loading = true;
      this.$store.commit('mainplaylist/setId', { id });
      await this.$store
        .dispatch('mainplaylist/getPlaylist', { id });
      if (this.$store.state.mainplaylist.setCount >= 1) {
        // because only one set of items is loaded
        return;
      }
      const { increaseSetCount } = await this.$store.dispatch('mainplaylist/getPlaylistData');
      if (increaseSetCount) {
        this.$store.commit('mainplaylist/setSetCount');
      }
    } catch (err) {
      this.errMsg = err.response.data.message;
    } finally {
      this.loading = false;
    }
  },

  beforeUnmount() {
    if (this.isModerator) {
      socket.emit('setOngoingPlaylist', {
        id: '',
        videoIndex: 0,
        time: 0,
        paused: false,
      });
    }
  },
};
</script>

<style lang="scss" scoped>
@import '../scss/main-playlist.scss';
</style>
