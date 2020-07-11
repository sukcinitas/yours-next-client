<template>
  <div>
    <h1 class="header">yours next</h1>
    <authenticate-member></authenticate-member>
    <create-group></create-group>
  </div>
</template>

<script>
import AuthenticateMember from './AuthenticateMember';
import CreateGroup from './CreateGroup';

export default {
  name: 'EntrancePage',
  data() {
    return {
    };
  },
  components: { AuthenticateMember, CreateGroup },
};
</script>

<style lang="scss" scoped>
  .header {
    font-size: 2rem;
    margin-bottom: 2em;
  }
</style>
