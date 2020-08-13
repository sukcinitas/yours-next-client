<template>
  <main :class="{main: !isMessagesTurnedOff, 'main--chat-off': isMessagesTurnedOff}">
    <div class=header>
      <h1 class="header__heading">yours next</h1>
      <div class="header__buttons">
        <button class="header__button" @click="leave">
          Leave
        </button>
        <button class="header__button" @click="toggleMessages">
        {{isMessagesTurnedOff ? 'Turn on chat' : 'Turn off chat'}}
        </button>
      </div>
    </div>
    <div class="playlists">
      <h2 class="playlists__heading">Playlists of group {{group}}</h2>
      <div class="playlists__list">
          <div class="playlists__playlist--ongoing" v-if="ongoingPlaylistId">
            <button
            class="playlists__name--ongoing"
            @click="goToOngoingPlaylist(ongoingPlaylistId)">Ongoing playlist
            </button>
        </div>
        <div v-for="playlist in playlists" :key="playlist.title" class="playlists__playlist">
            <button
            class="playlists__name"
            @click="goToPlaylist(playlist._id)">{{playlist.title}}
              <!-- <span class="playlists__date">
                {{formatDate(playlist.updatedAt)}}
              </span> -->
            </button>
            <button
              class="playlists__remove-button"
              v-if="isModerator"
              @click="deletePlaylist(playlist._id)"
            >X
            </button>
        </div>
      </div>
      <p v-if="errMsg" class="playlists__message--error">{{errMsg}}</p>
      <p v-if="successMsg" class="playlists__message--success">{{successMsg}}</p>
      <button
          v-if="!isExtended"
          class="create-playlist-form__button--small"
          @click="toggleExtended"
          type="button"
        >+
      </button>
      <form
        class="create-playlist-form"
        @submit.prevent="addPlaylist" v-show="isExtended"
      >
        <input
          type="text"
          v-model="title"
          class="create-playlist-form__input"
        >
        <button
          class="create-playlist-form__button"
          type="submit"
        >
          Add
        </button>
      </form>
    </div>
    <message-box :class="{'message-box': !isMessagesTurnedOff,
     'message-box--off': isMessagesTurnedOff}">
    </message-box>
    <members-list :isBottom="true"></members-list>
  </main>
</template>

<script>
import MessageBox from './MessageBox';
import MembersList from './MembersList';
import formatDate from '../util/formatDate';

export default {
  name: 'MainPage',
  components: {
    'message-box': MessageBox,
    'members-list': MembersList,
  },
  data() {
    return {
      isExtended: false,
      title: '',
      errMsg: '',
      successMsg: '',
    };
  },
  created() {
    return this.getPlaylists();
  },
  computed: {
    playlists() {
      return this.$store.state.playlist.playlists;
    },
    isModerator() {
      return this.$store.getters['group/isModerator'];
    },
    moderator() {
      return this.$store.state.group.moderator;
    },
    isMessagesTurnedOff() {
      return this.$store.getters['group/chatState'];
    },
    isMainAnOngoingPlaylist() {
      return this.$store.getters['mainplaylist/isMainAnOngoingPlaylist'];
    },
    ongoingPlaylistId() {
      return this.$store.state.mainplaylist.ongoingPlaylist.id;
    },
    group() {
      return this.$store.state.group.name;
    },
  },
  methods: {
    toggleExtended() {
      this.isExtended = !this.isExtended;
    },
    async getPlaylists() {
      this.$store.dispatch('playlist/getPlaylists')
        .then((result) => {
          if (!result.success) {
            this.errMsg = result.errMsg;
          }
        });
    },
    async addPlaylist() {
      if (this.$store.getters['playlist/playlistsTitles'].indexOf(this.title) > -1) {
        this.errMsg = 'Playlist with this title already exists!';
        return;
      }
      this.$store.dispatch('playlist/addPlaylist', { title: this.title })
        .then((result) => {
          if (result.success) {
            this.errMsg = '';
            this.successMsg = result.successMsg;
            this.$socket.emit('updatePlaylists', { playlists: result.playlists });
            this.$store.dispatch('mainplaylist/getPlaylist', { id: result.id });
            setTimeout(() => this.$router.push({ path: '/mainplaylist' }), 250);
          } else {
            this.successMsg = '';
            this.errMsg = result.errMsg;
          }
        });
      this.isExtended = false;
    },
    async goToPlaylist(id) {
      this.$store.commit('mainplaylist/setId', { id });
      this.$store.dispatch('mainplaylist/getPlaylist', { id })
        .then((result) => {
          if (!result.success) {
            this.errMsg = result.errMsg;
            return;
          }
          this.$router.push({ path: '/playlist' });
        });
    },
    async goToOngoingPlaylist(id) {
      this.$store.commit('mainplaylist/setId', { id });
      this.$store.dispatch('mainplaylist/getPlaylist', { id })
        .then((result) => {
          if (!result.success) {
            this.errMsg = result.errMsg;
            return;
          }
          this.$router.push({ path: '/playlist' });
        });
    },
    async deletePlaylist(id) {
      this.$store.dispatch('playlist/deletePlaylist', { id })
        .then((result) => {
          if (!result.success) {
            this.errMsg = result.errMsg;
          } else {
            this.successMsg = result.successMsg;
            setTimeout(() => {
              this.successMsg = '';
            }, 750);
            this.$socket.emit('updatePlaylists', { playlists: result.playlists });
          }
        });
    },
    toggleMessages() {
      this.$store.commit('group/setChatState', { state: !this.isMessagesTurnedOff });
    },
    leave() {
      this.$store.dispatch('group/resetState'); // for backup if reload does not work
      this.$router.go(); // when no arguments are provided, it refreshes the page
    },
    formatDate(date) {
      if (!date) {
        return '';
      }
      return `last updated on ${formatDate(date)}`;
    },
  },
};
</script>

<style lang="scss" scoped>
  @import '@/scss/shared-styles-forms.scss';
  @import '@/scss/shared-styles-buttons.scss';
  @import '@/scss/main-page.scss';
</style>
