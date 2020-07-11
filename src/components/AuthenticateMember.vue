<template>
  <section>
     <form @submit.prevent="handleSubmit" class="form">
      <button
        @click="toggleExtended"
        type="button"
        :class="['btn--form', 'elem-1']"
      >Join a group
      </button>
      <input
        v-model="name"
        type="text"
        placeholder="Enter the group name"
        :class="[{'elem-2--extended': isExtended}, {'elem-2':!isExtended}]"
      >
      <input
        v-model="passcode"
        type="password"
        placeholder="Enter the passcode"
        :class="[{'elem-3--extended': isExtended}, {'elem-3':!isExtended}]"
      >
      <button
        type="submit"
        :disabled="!name || !passcode"
        :class="['btn--form', {'elem-4--extended': isExtended}, {'elem-4':!isExtended}]"
      >>
      </button>
    </form>
    <p v-if="errMsg" class="error">{{errMsg}}</p>
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

<style lang="scss" scoped>
  @import '@/scss/shared-styles-forms.scss';
</style>
