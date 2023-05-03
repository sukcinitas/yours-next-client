<template>
  <div>
    <button class="playlist__button" @click="confirm" title="Confirm">
      <font-awesome-icon :icon="['fas', 'check']" />
    </button>
    <button class="playlist__button" @click="cancel" title="Cancel">
      <font-awesome-icon :icon="['fas', 'window-close']" />
    </button>
  </div>
</template>

<script>
export default {
  data() {
    return {};
  },
  methods: {
    confirm() {
      this.$emit('delete');
    },
    cancel() {
      this.$emit('cancelDeletion');
    }
  },
};
</script>

<style lang="scss" scoped>
@import '../scss/playlist-item.scss';
</style>
