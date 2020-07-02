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
        :title="member.name"
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
      playlists: this.$store.state.group.playlists,
    };
  },
  created() {
    return this.getPlaylists();
  },
  computed: {
    activeMembers() {
      return this.$store.state.group.activeMembers;
    },
    // playlists() {
    //   return this.$store.state.group.playlists;
    // },
    isModerator() {
      return this.$store.getters['group/isModerator'];
    },
  },
  methods: {
    toggleExtended() {
      this.isExtended = !this.isExtended;
    },
    async addPlaylist() {
      this.$store.dispatch('playlist/addPlaylist', { title: this.title })
        .then(() => {
          if (this.$store.state.playlist.successMsg) {
            this.successMsg = this.$store.state.playlist.successMsg;
            this.$socket.emit('updatePlaylists');
            const id = this.$store.state.playlist.id;
            this.$store.dispatch('mainplaylist/getPlaylist', { id });
            setTimeout(() => this.$router.push({ name: 'MainPlaylist' }), 250);
          } else {
            this.errMsg = this.$store.state.group.errMsg;
          }
        });
      this.isExtended = false;
    },
    async goToPlaylist(id) {
      this.$store.dispatch('mainplaylist/getPlaylist', { id })
        .then(() => {
          if (this.$store.state.mainplaylist.errMsg) {
            this.errMsg = this.$store.state.group.errMsg;
            return;
          }
          this.$router.push({ name: 'MainPlaylist' });
        });
    },
    async getPlaylists() {
      this.$store.dispatch('group/getPlaylists')
        .then(() => {
          if (this.$store.state.group.playlists.length !== 0) {
            this.playlists = this.$store.state.group.playlists;
          } else {
            this.errMsg = this.$store.state.group.errMsg;
          }
        });
    },
    async deletePlaylist(id) {
      this.$store.dispatch('group/deletePlaylist', { id })
        .then(() => {
          if (this.$store.state.group.errMsg === 'Could not delete playlist!') {
            this.errMsg = 'Could not delete playlist!';
          } else {
            this.successMsg = this.$store.state.group.successMsg;
            setTimeout(() => {
              this.successMsg = '';
            }, 500);
            this.$socket.emit('updatePlaylists');
          }
        });
    },
    makeModerator(name) {
      if (this.isModerator) {
        this.$socket.emit('setModerator', name);
      }
    },
  },
};
</script>
