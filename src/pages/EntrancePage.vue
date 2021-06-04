<template>
  <div v-if="!isGroupAuthenticated">
    <header class="header">
      <h1 class="header__heading">yours next</h1>
    </header>
    <div class="entry-forms">
      <authenticate-member @authenticate="authenticateGroup"></authenticate-member>
      <create-group @authenticate="authenticateGroup"></create-group>
    </div>
  </div>
  <member-create v-else></member-create>
</template>

<script>
import AuthenticateMember from '../components/AuthenticateMember';
import CreateGroup from '../components/CreateGroup';
import MemberCreate from '../components/MemberCreate';

export default {
  name: 'EntrancePage',
  data() {
    return {
      isGroupAuthenticated: false,
    };
  },
  components: { AuthenticateMember, CreateGroup, MemberCreate },
  methods: {
    authenticateGroup() {
      this.isGroupAuthenticated = true;
    },
  },
};
</script>

<style lang="scss" scoped>
@import '../scss/entrance-page.scss';
</style>
