<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App',
  data() {
    return {};
  },
};
</script>

<style>
html, body {
  margin: 0;
  padding: 0;
}
#app {
  /* font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center; */
  color: #3a3a39;
}
.active {
  position: absolute;
  left: 0;
  z-index: 100;
}
.hidden {
  display: none;
}
.moderator {
  position: fixed;
  top: 10px;
}
</style>
