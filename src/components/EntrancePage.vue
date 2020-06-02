<template>
  <div>
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
