<template>
  <div id="app">
    <div :class="{active: !isMessagesTurnedOff, hidden: isMessagesTurnedOff}">
      <p v-for="(message, index) in messages" :key="index">
        {{`${message.name}: ${message.message}`}}
      </p>
    </div>
    <button @click="turnOffMessages">
      {{isMessagesTurnedOff ? 'Turn on messages' : 'Turn off messaages'}}
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
