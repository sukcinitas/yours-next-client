<template>
  <div class="loader">
    <div class="loader__item">{{userEmoji}}</div>
    <div class="loader__item">{{userEmoji}}</div>
    <div class="loader__item">{{userEmoji}}</div>
  </div>
</template>

<script>
export default {
  name: 'LoadingAnimation',
  data() {
    return {};
  },
  computed: {
    userEmoji() {
      return this.$store.getters['group/member'].emoji;
    },
  },
};
</script>

<style lang="scss" scoped>
@import '@/scss/loading-animation.scss';
</style>
