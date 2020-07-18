<template>
  <div>
    <header class="header"><h1 class="header__heading">yours next</h1></header>
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
    text-align: center;
    font-size: 32px;
    margin: 36px 0;
    margin-bottom: 150px;
  }
</style>
