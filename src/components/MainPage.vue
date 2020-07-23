<template>
  <main :class="{main: !isMessagesTurnedOff, 'main--chat-off': isMessagesTurnedOff}">
    <div class=header>
      <button class="header__button" @click="toggleMessages">
      {{isMessagesTurnedOff ? 'Turn on chat' : 'Turn off chat'}}
      </button>
    </div>

    <div class="playlists">
      <div class="playlists__list">
        <div v-for="playlist in playlists" :key="playlist.title" class="playlists__playlist">
            <button
            class="playlists__name"
            @click="goToPlaylist(playlist._id)">{{playlist.title}}
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
      <form class="create-playlist-form" submit.prevent="addPlaylist" v-if="isExtended">
        <input type="text" v-model="title" class="create-playlist-form__input">
        <button
          class="create-playlist-form__button"
          @click="addPlaylist"
          type="submit"
        >
          Add
        </button>
      </form>
    </div>
    <message-box :class="{'message-box': !isMessagesTurnedOff,
     'message-box--off': isMessagesTurnedOff}">
    </message-box>
    <members-list></members-list>
  </main>
</template>

<script>
import MessageBox from './MessageBox';
import MembersList from './MembersList';

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
            this.successMsg = result.successMsg;
            this.$socket.emit('updatePlaylists', { playlists: result.playlists });
            this.$store.dispatch('mainplaylist/getPlaylist', { id: result.id });
            setTimeout(() => this.$router.push({ name: 'MainPlaylist' }), 250);
          } else {
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
          this.$router.push({ name: 'MainPlaylist' });
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
  },
};
</script>

<style lang="scss" scoped>
  @import '@/scss/shared-styles-forms.scss';
  @import '@/scss/shared-styles-buttons.scss';
  @import '@/scss/main-page.scss';
</style>
