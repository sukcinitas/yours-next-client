<template>
  <section>
    <p v-if="errMsg">{{errMsg}}</p>
    <p v-if="successMsg">{{successMsg}}</p>
    <div>
      <button
        @click="goToPlaylist(playlist._id)"
        v-for="playlist in playlists"
        :key="playlist.title">{{playlist.title}}
      </button>
    </div>
    <input type="text" v-model="title" v-if="isExtended">
    <button
      @click="isExtended ? addPlaylist() : toggleExtended()">{{isExtended ? 'Add' : '+'}}
    </button>
  </section>
</template>

<script>
export default {
  name: 'MainPage',
  data() {
    return {
      isExtended: false,
      title: '',
      playlists: [],
      errMsg: '',
      successMsg: '',
    };
  },
  created() {
    this.$store.dispatch('group/getPlaylists')
      .then(() => {
        if (this.$store.state.group.playlists.length !== 0) {
          this.playlists = this.$store.state.group.playlists;
        } else {
          this.errMsg = this.$store.state.group.errMsg;
        }
      });
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
            const id = this.$store.state.playlist.id;
            this.$store.dispatch('mainplaylist/getPlaylist', { id });
            setTimeout(() => this.$router.push({ name: 'MainPlaylist' }), 1000);
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
  },
};
</script>
