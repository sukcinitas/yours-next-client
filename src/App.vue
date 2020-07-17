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
html {
  -webkit-box-sizing: border-box;
  -moz-box-sizing: border-box;
  box-sizing: border-box;
}
*, *:before, *:after {
  -webkit-box-sizing: inherit;
  -moz-box-sizing: inherit;
  box-sizing: inherit;
  padding: 0;
  margin: 0;
}
html, body {
  margin: 0;
  padding: 0;
  height: 100%;
  min-height: 100%;
}
#app {
  padding-top: 60px;
  height: 100vh;
  min-height: 100vh;
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
