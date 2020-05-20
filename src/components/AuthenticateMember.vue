<template>
    <section>
      <button
        @click="extend"
        type="text">Join a group
      </button>
      <input
        v-if="isExtended"
        v-model="name"
        type="text"
        placeholder="Enter group name"
      >
      <input
        v-if="isExtended"
        v-model="passcode"
        type="password"
        placeholder="Enter passcode"
      >
      <button @click="authenticate" v-if="isExtended">></button>
      <p v-if="errMsg">{{errMsg}}</p>
    </section>
</template>

<script>
import GroupApi from '../services/group.api';

export default {
  name: 'AuthenticateMember',
  data() {
    return {
      isExtended: false,
      name: '',
      passcode: '',
      errMsg: '',
    };
  },
  methods: {
    extend() {
      this.isExtended = !this.isExtended;
    },
    async authenticate() {
      const result = await GroupApi.authenticate(this.name, this.passcode);
      if (result.data.success) {
        this.$store.commit('group/setName', this.name);
        this.$router.push({ name: 'MainPage' });
      }
      this.errMsg = result.data.message;
    },
  },
};
</script>
