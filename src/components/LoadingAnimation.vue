<template>
  <div class="loader">
      <font-awesome-icon :icon="['fas', 'square']" class="loader__item" />
      <font-awesome-icon :icon="['fas', 'square']" class="loader__item" />
      <font-awesome-icon :icon="['fas', 'square']" class="loader__item" />
  </div>
</template>

<script>
export default {
  name: 'LoadingAnimation',
  data() {
    return {};
  },
};
</script>

<style lang="scss" scoped>
@import '@/scss/loading-animation.scss';
</style>
