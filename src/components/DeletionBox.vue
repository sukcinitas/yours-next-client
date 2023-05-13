<template>
  <div>
    <button class="playlist__button" @click="emit('confirm')" title="Confirm">
      <font-awesome-icon :icon="['fas', 'check']" />
    </button>
    <button class="playlist__button" @click="emit('cancel')" title="Cancel">
      <font-awesome-icon :icon="['fas', 'window-close']" />
    </button>
  </div>
</template>

<script setup>
</script>

<style lang="scss" scoped>
@import '../scss/playlist-item.scss';
</style>
