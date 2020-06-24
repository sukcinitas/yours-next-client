<template>
  <section>
    <button
      @click="extend"
      type="text">Create a group
    </button>
    <form @submit.prevent="handleSubmit">
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
      <button type="submit" v-if="isExtended">></button>
    </form>
    <p v-if="errMsg">{{errMsg}}</p>
  </section>
</template>

<script>
export default {
  name: 'CreateGroup',
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
      this.errMsg = '';
      this.name = '';
      this.passcode = '';
    },
    async handleSubmit() {
      if (this.passcode.length < 8) {
        this.errMsg = 'Passcode must be at least 8 characters long';
        return;
      }
      this.$store.dispatch('group/createGroup', { name: this.name, passcode: this.passcode })
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
