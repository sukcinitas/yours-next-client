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
      @click="() => $router.push({ path: `/search/${$route.params.id}` })"
    >
      Add some videos!
    </button>
    <template v-if="initialPlaylistLength !== 0">
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
      return this.$store.getters['mainplaylist/length'];
    },
    title() {
      return this.$store.getters['mainplaylist/title'];
    },
  },
  async mounted() {
    try {
      const { id } = this.$route.params;
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
    }
  },
};
</script>

<style lang="scss" scoped>
@import '@/scss/main-playlist.scss';
</style>
