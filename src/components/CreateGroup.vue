<template>
    <section>
      <button
        @click="extend"
        type="text">Create a group
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
      <button @click="create" v-if="isExtended">></button>
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
    },
    async create() {
      this.$store.dispatch('group/createGroup', { name: this.name, passcode: this.passcode })
        .then(() => {
          if (this.$store.state.group.name) {
            this.$router.push({ name: 'MainPage' });
          } else {
            this.errMsg = this.$store.state.group.errMsg;
          }
        });
    },
  },
};
</script>
