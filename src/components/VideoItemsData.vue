<template>
  <div v-on:scroll.passive="handleScroll">
    <div
      :class="[
        {
          'main-playlist__video-item--active':
            item.id === playlist[activeIndex],
        },
        'main-playlist__video-item',
      ]"
      v-for="(item, index) in items"
      :key="playlist[index]"
      :index="index"
    >
      <h3
        @click="changeIndex(index)"
        :class="[
          {
            'main-playlist__heading--active': item.id === playlist[activeIndex],
          },
          'main-playlist__heading',
          {
            'main-playlist__heading--active--ongoing':
              isOngoing && !isModerator,
          },
        ]"
      >
        {{ item.snippet.title }}
      </h3>
      <img
        :class="[
          { 'main-playlist__img--active': item.id === playlist[activeIndex] },
          'main-playlist__img',
        ]"
        :src="item.snippet.thumbnails.medium.url"
        :alt="item.snippet.title"
      />
      <button
        :class="[
          {
            'main-playlist__button--remove--active':
              item.id === playlist[activeIndex],
          },
          'main-playlist__button--remove',
        ]"
        v-if="isModerator"
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
    <loading-animation v-if="loading"/>
  </div>
</template>

<script>
import LoadingAnimation from './LoadingAnimation';

export default {
  name: 'VideoItemsData',
  data() {
    return {
      errMsg: '',
      chosenVideoId: '',
      loading: false,
    };
  },
  components: {
    LoadingAnimation,
  },
  props: ['isOngoing'],
  computed: {
    activeIndex() {
      if (this.isOngoing) {
        return this.$store.getters['mainplaylist/ongoingPlaylist'].videoIndex;
      }
      return this.$store.getters['mainplaylist/nowPlayingVideoIndex'];
    },
    playlist() {
      return this.$store.getters['mainplaylist/playlist'];
    },
    items() {
      return this.$store.getters['mainplaylist/items'];
    },
    isModerator() {
      return this.$store.getters['group/isModerator'];
    },
    isThereMoreToLoad() {
      return this.playlist.length > this.items.length;
    },
    isIndexAheadOfData() {
      return this.$store.getters['mainplaylist/isIndexAheadOfData'];
    },
  },
  watch: {
    activeIndex(newValue, oldValue) {
      if (newValue > oldValue) {
        if (this.isIndexAheadOfData) {
          this.loadMore();
        }
      }
    },
  },
  methods: {
    changeIndex(index) {
      if (this.isOngoing) {
        if (this.isModerator) {
          this.$socket.emit('changeOngoingPlaylistVideoIndex', {
            videoIndex: index,
          });
        }
      } else {
        this.$store.commit('mainplaylist/changeNowPlayingVideoIndex', index);
      }
    },

    async removeItemFromPlaylist(videoId) {
      try {
        const { items } = await this.$store
          .dispatch('mainplaylist/removeItemFromPlaylist', { videoId, id: this.$route.params.id });
        this.$socket.emit('updatePlaylist', {
          idsArray: items,
          itemData: videoId,
          type: 'deletion',
          alreadyIn: false,
          id: this.$route.params.id,
        });
        this.$nextTick(() => {
          const isRemovedBefore =
              this.playlist.indexOf(videoId) < this.activeIndex;
          if (isRemovedBefore) {
            this.changeIndex(this.activeIndex - 1);
          }
        });
      } catch (err) {
        this.errMsg = err.message;
        this.chosenVideoId = videoId;
        setTimeout(() => {
          this.errorMsg = '';
          this.chosenVideoId = '';
        }, 500);
      }
    },

    async loadMore() {
      try {
        this.loading = true;
        const { increaseSetCount } = await this.$store.dispatch('mainplaylist/getPlaylistData');
        if (increaseSetCount) {
          this.$store.commit('mainplaylist/setSetCount');
        }
      } catch (err) {
        this.errorMsg = err.response.data.message;
      } finally {
        this.loading = false;
      }
    },

    async handleScroll(e) {
      if (this.loading) {
        return;
      }
      if (e.target.scrollHeight - e.target.offsetHeight < e.target.scrollTop
      && this.isThereMoreToLoad) {
        await this.loadMore();
      }
    },
  },
};
</script>

<style lang="scss" scoped>
@import '@/scss/main-playlist.scss';
</style>
