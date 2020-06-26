<template>
  <div id="app">
    <div :class="{active: !isMessagesTurnedOff,
    hidden: isMessagesTurnedOff || !this.$store.state.group.member}">
      <p v-for="(message, index) in messages" :key="index">
        {{`${message.name}: ${message.message}`}}
      </p>
    </div>
    <p :class="{hidden: !this.$store.state.group.member}">
      <span title="Can delete playlists, videos, set other moderator">Moderator:</span>
       {{moderator}}
    </p>
    <button v-if="this.$store.state.group.member" @click="turnOffMessages">
      {{isMessagesTurnedOff ? 'Turn on chat' : 'Turn off chat'}}
    </button>
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App',
  data() {
    return {
      isMessagesTurnedOff: false,
    };
  },
  computed: {
    messages() {
      return this.$store.state.group.messages;
    },
    moderator() {
      return this.$store.getters['group/moderatorEmoji'];
    },
  },
  methods: {
    turnOffMessages() {
      this.isMessagesTurnedOff = !this.isMessagesTurnedOff;
    },
  },
};
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
.active {
  position: absolute;
  left: 0;
  z-index: 100;
}
.hidden {
  display: none;
}
</style>
