<template>
  <section>
    <p v-if="errMsg">{{errMsg}}</p>
    <p v-if="successMsg">{{successMsg}}</p>
    <div v-for="playlist in playlists" :key="playlist.title">
      <button
        @click="goToPlaylist(playlist._id)">{{playlist.title}}
      </button>
      <button
        v-if="isModerator"
        @click="deletePlaylist(playlist._id)"
      >X
      </button>
    </div>
    <input type="text" v-model="title" v-if="isExtended">
    <button
      @click="isExtended ? addPlaylist() : toggleExtended()">{{isExtended ? 'Add' : '+'}}
    </button>
    <div>
      <span @click="makeModerator(member.name)"
        v-for="member in activeMembers"
        :key="member.emoji"
        :title="`${member.name}
${isModerator && moderator !== member.name ? `doubleclick to make ${member.name} moderator` : ''}`"
      >
      {{member.emoji}}
      </span>
    </div>
    <message-box></message-box>
  </section>
</template>

<script>
import MessageBox from './MessageBox';

export default {
  name: 'MainPage',
  components: {
    'message-box': MessageBox,
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
    activeMembers() {
      return this.$store.state.group.activeMembers;
    },
    playlists() {
      return this.$store.state.playlist.playlists;
    },
    isModerator() {
      return this.$store.getters['group/isModerator'];
    },
    moderator() {
      return this.$store.state.group.moderator;
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
            }, 500);
            this.$socket.emit('updatePlaylists', { playlists: result.playlists });
          }
        });
    },
    makeModerator(name) {
      if (this.isModerator) {
        if (this.moderator === name) {
          return;
        }
        this.$socket.emit('setModerator', name);
      }
    },
  },
};
</script>
