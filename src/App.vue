<script setup>
import { RouterView } from 'vue-router'
</script>

<template>
  <RouterView />
</template>

<style>
html {
  -webkit-box-sizing: border-box;
  -moz-box-sizing: border-box;
  box-sizing: border-box;
}
*,
*:before,
*:after {
  -webkit-box-sizing: inherit;
  -moz-box-sizing: inherit;
  box-sizing: inherit;
  padding: 0;
  margin: 0;
}
html,
body {
  margin: 0;
  padding: 0;
  scroll-behavior: smooth;
  background-color: #80808000;
}
</style>