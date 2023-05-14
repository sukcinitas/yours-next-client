<template>
  <h1 class="redirect">
    Please visit here
    <a 
      :href="location.href.replace('http', 'https')" 
      class="redirect__link" 
      target="_blank" 
      rel="noreferrer noopener"
    >
      {{ location.href.replace('http', 'https') }}
    </a>
  </h1>
</template>

<script setup>
</script>

<style lang="scss" scoped>
@import '../scss/shared-styles-forms.scss';
</style>
