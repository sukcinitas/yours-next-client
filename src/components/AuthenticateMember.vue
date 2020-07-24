<template>
  <form @submit.prevent="handleSubmit" class="entry-form">
    <button
      @click="toggleExtended"
      type="button"
      class="entry-form__button"
    >Join a group
    </button>
    <input
      v-model="name"
      type="text"
      placeholder="Enter the group name"
      :class="[{'entry-form__input-1--extended': isExtended}, {'entry-form__input-1':!isExtended}]"
    >
    <input
      v-model="passcode"
      type="password"
      placeholder="Enter the passcode"
      :class="[{'entry-form__input-2--extended': isExtended}, {'entry-form__input-2':!isExtended}]"
    >
    <button
      type="submit"
      :disabled="!name || !passcode"
      :class="[{'entry-form__button--small--extended': isExtended},
       {'entry-form__button--small':!isExtended}]"
    >>
    </button>
    <p v-if="errMsg && isExtended" class="message--error">{{errMsg}}</p>
  </form>
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
