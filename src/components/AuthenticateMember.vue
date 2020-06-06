<template>
    <section>
      <button
        @click="toggleExtended"
        type="text">Join a group
      </button>
      <input
        v-if="isExtended"
        v-model="name"
        type="text"
        placeholder="Enter the group name"
      >
      <input
        v-if="isExtended"
        v-model="passcode"
        type="password"
        placeholder="Enter the passcode"
      >
      <button @click="authenticate" v-if="isExtended" :disabled="!name || !passcode">></button>
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
    },
    async authenticate() {
      this.$store.dispatch('group/authenticate', { name: this.name, passcode: this.passcode })
        .then(() => {
          if (this.$store.state.group.name) {
            this.$socket.emit('authenticate', { name: this.name });
            this.$router.push({ name: 'MemberCreate' });
          } else {
            this.errMsg = this.$store.state.group.errMsg;
          }
        });
    },
  },
};
</script>
