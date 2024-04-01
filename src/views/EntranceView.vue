<template>
  <div v-if="!isGroupAuthenticated">
    <header class="header">
      <h1 class="header__heading">
        yours next
      </h1>
    </header>
    <div class="entry-forms">
      <redirection-comp v-if="isProtocolHttp" />
      <template v-else>
        <authenticate-member
          v-bind="{ type: 'authenticate', name: 'Join a group' }"
          @authenticate="authenticateGroup"
        />
        <authenticate-member
          v-bind="{ type: 'create', name: 'Create a group' }"
          @authenticate="authenticateGroup"
        />
      </template>
    </div>
  </div>
  <member-create v-else />
</template>

<script setup>
import { ref } from 'vue'
import AuthenticateMember from '../components/AuthenticateMember.vue';
import MemberCreate from '../components/MemberCreate.vue';
import RedirectionComp from '../components/RedirectionComp.vue';

const isGroupAuthenticated = ref(false);
const loc = new URL(location?.href);
const isProtocolHttp = loc?.isProtocolHttp && process.env.NODE_ENV === 'production';

function authenticateGroup() {
  isGroupAuthenticated.value = true
}
</script>

<style lang="scss" scoped>
@import '../scss/entrance-page.scss';
</style>
