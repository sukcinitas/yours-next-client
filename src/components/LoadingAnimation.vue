<template>
  <div class="loader">
    <div class="loader__item">
      {{ userEmoji }}
    </div>
    <div class="loader__item">
      {{ userEmoji }}
    </div>
    <div class="loader__item">
      {{ userEmoji }}
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useGroupStore } from '../stores/group'

const groupStore = useGroupStore()

const userEmoji = computed(() => {
  return groupStore.member.emoji
})

</script>

<style lang="scss" scoped>
@import '../scss/loading-animation.scss';
</style>
