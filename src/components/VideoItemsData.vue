<template>
  <div>
    <p v-if="errMsg && !chosenVideoId" class="main-playlist__message--error">{{errMsg}}</p>
    <div
      :class="[{'main-playlist__video-item--active': item.id === playlist[activeIndex]},
       'main-playlist__video-item']"
      v-for="(item, index) in items"
      :key="playlist[index]"
      :index="index"
    >
      <h3
        @click="changeIndex(index)"
        :class="[{'main-playlist__heading--active': item.id === playlist[activeIndex]},
       'main-playlist__heading']"
      >{{item.snippet.title}}
      </h3>
      <img
        :class="[{'main-playlist__img--active': item.id === playlist[activeIndex]},
       'main-playlist__img']"
        :src="item.snippet.thumbnails.medium.url"
        :alt="item.snippet.title"
      >
      <button
        :class="[{'main-playlist__button--remove--active': item.id === playlist[activeIndex]},
       'main-playlist__button--remove']"
        v-if="isModerator"
        @click="removeItemFromPlaylist(item.id)"
      >
        Remove
      </button>
      <p v-if="errMsg && chosenVideoId === item.id"
      class="main-playlist__message--error">{{errMsg}}</p>
    </div>
    <!-- <button
      type="button"
      class="main-playlist__button"
      @click="loadMore"
    >Load more
    </button> -->
  </div>
</template>

<script>
export default {
  name: 'VideoItemsData',
  data() {
    return {
      errMsg: '',
      chosenVideoId: '',
    };
  },
  computed: {
    activeIndex() {
      if (this.$store.getters['mainplaylist/isMainAnOngoingPlaylist']) {
        return this.$store.state.mainplaylist.ongoingPlaylist.videoIndex;
      }
      return this.$store.state.mainplaylist.nowPlayingVideoIndex;
    },
    playlist() {
      return this.$store.state.mainplaylist.idsArray;
    },
    items() {
      return this.$store.state.mainplaylist.items;
    },
    isModerator() {
      return this.$store.getters['group/isModerator'];
    },
  },
  methods: {
    changeIndex(index) {
      if (!this.isModerator && this.$store.getters['mainplaylist/isMainAnOngoingPlaylist']) {
        return;
      }
      if (this.isModerator && this.$store.getters['mainplaylist/isMainAnOngoingPlaylist']) {
        this.$socket.emit('changeOngoingPlaylistVideoIndex', { videoIndex: index });
        return;
      }
      this.$store.commit('mainplaylist/changeNowPlayingVideoIndex', index);
    },
    removeItemFromPlaylist(videoId) {
      this.$store.dispatch('mainplaylist/removeItemFromPlaylist', { videoId })
        .then((result) => {
          if (!result.success) {
            this.chosenVideoId = videoId;
            this.errMsg = result.errMsg;
            setTimeout(() => {
              this.errorMsg = '';
              this.chosenVideoId = '';
            }, 500);
            return;
          }
          this.$socket.emit('updatePlaylist', {
            idsArray: result.items,
            items: result.itemsData,
          });
          this.$nextTick(() => {
            const isRemovedBefore = this.playlist.indexOf(videoId) < this.activeIndex;
            if (isRemovedBefore) {
              this.changeIndex(this.activeIndex - 1);
            }
          });
        });
    },
    loadMore() {
      this.$store.dispatch('mainplaylist/getPlaylistData')
        .then((result) => {
          if (!result.success) {
            this.errMsg = result.errMsg;
          }
        });
    },
  },
  mounted() {
    this.$store.dispatch('mainplaylist/getPlaylistData')
      .then((result) => {
        if (!result.success) {
          this.errMsg = result.errMsg;
        }
      });
  },
};
</script>

<style lang="scss" scoped>
  @import '@/scss/main-playlist.scss';
</style>

