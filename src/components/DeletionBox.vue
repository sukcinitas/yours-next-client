<template>
  <div>
    <button
      class="playlist__button"
      title="Confirm"
      @click="emit('confirm')"
    >
      <font-awesome-icon :icon="['fas', 'check']" />
    </button>
    <button
      class="playlist__button"
      title="Cancel"
      @click="emit('cancel')"
    >
      <font-awesome-icon :icon="['fas', 'window-close']" />
    </button>
  </div>
</template>

<script setup>
const emit = defineEmits(['confirm', 'cancel'])
</script>

<style lang="scss" scoped>
@import '../scss/playlist-item.scss';
</style>
