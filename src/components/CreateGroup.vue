<template>
  <section>
    <button
      @click="extend"
      type="button">Create a group
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
      <button type="submit">></button>
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
