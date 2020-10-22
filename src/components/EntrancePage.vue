<template>
  <div>
    <header class="header">
      <h1 class="header__heading">yours next</h1>
    </header>
    <div class="entry-forms">
      <authenticate-member></authenticate-member>
      <create-group></create-group>
    </div>
  </div>
</template>

<script>
import AuthenticateMember from './AuthenticateMember';
import CreateGroup from './CreateGroup';

export default {
  name: 'EntrancePage',
  data() {
    return {};
  },
  components: { AuthenticateMember, CreateGroup },
};
</script>

<style lang="scss" scoped>
  @import '@/scss/entrance-page.scss';
</style>
