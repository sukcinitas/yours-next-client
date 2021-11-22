<template>
  <div v-if="!isGroupAuthenticated">
    <header class="header">
      <h1 class="header__heading">yours next</h1>
    </header>
    <div class="entry-forms">
      <redirection-comp v-if="isProtocolHttp"></redirection-comp>
      <template v-else>
        <authenticate-member @authenticate="authenticateGroup"></authenticate-member>
        <create-group @authenticate="authenticateGroup"></create-group>
      </template>
    </div>
  </div>
  <member-create v-else></member-create>
</template>

<script>
import AuthenticateMember from '../components/AuthenticateMember';
import CreateGroup from '../components/CreateGroup';
import MemberCreate from '../components/MemberCreate';
import RedirectionComp from '../components/RedirectionComp';

export default {
  name: 'EntrancePage',
  data() {
    return {
      isGroupAuthenticated: false,
      isProtocolHttp: location.protocol === 'http:',
    };
  },
  components: { AuthenticateMember, CreateGroup, MemberCreate, RedirectionComp },
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
