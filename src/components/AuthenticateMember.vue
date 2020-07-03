<template>
  <section>
      <button
        @click="toggleExtended"
        type="button">Join a group
      </button>
     <form @submit.prevent="handleSubmit" v-if="isExtended">
      <input
        v-model="name"
        type="text"
        placeholder="Enter the group name"
      >
      <input
        v-model="passcode"
        type="password"
        placeholder="Enter the passcode"
      >
      <button tyep="submit" :disabled="!name || !passcode">></button>
    </form>
    <p v-if="errMsg">{{errMsg}}</p>
  </section>
</template>

<script>
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
    toggleExtended() {
      this.isExtended = !this.isExtended;
      this.errMsg = '';
      this.name = '';
      this.passcode = '';
    },
    async handleSubmit() {
      this.$store.dispatch('group/authenticate', { name: this.name, passcode: this.passcode })
        .then((result) => {
          if (result.success) {
            this.$socket.emit('getInitialState', { name: this.name });
            this.$router.push({ name: 'MemberCreate' });
          } else {
            this.errMsg = result.errMsg;
          }
        });
    },
  },
};
</script>
