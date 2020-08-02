<template>
  <div>
    <form
      @submit.prevent="handleSubmit"
      :class="[isExtended ? 'entry-form--extended' : 'entry-form']"
    >
      <button
        @click="toggleExtended"
        type="button"
        class="entry-form__button"
      >Join a group
      </button>
      <input
        ref="input"
        v-model="name"
        type="text"
        placeholder="Enter the group name"
        :class="[isExtended ? 'entry-form__input-1--extended' : 'entry-form__input-1',
        err.type === 'name' ? 'input--error' : '']"
      >
      <input
        v-model="passcode"
        type="password"
        placeholder="Enter the passcode"
        :class="[isExtended ? 'entry-form__input-2--extended' : 'entry-form__input-2',
        err.type === 'passcode' ? 'input--error' : '']"
      >
      <button
        type="submit"
        :disabled="!name || !passcode"
        :class="[isExtended ? 'entry-form__button--small--extended' : 'entry-form__button--small']"
      >>
      </button>
    </form>
    <p v-if="err.message && isExtended" class="entry-form__message--error">{{err.message}}</p>
  </div>
</template>

<script>
export default {
  name: 'AuthenticateMember',
  data() {
    return {
      isExtended: false,
      name: '',
      passcode: '',
      err: {
        message: '',
        type: '',
      },
    };
  },
  methods: {
    toggleExtended() {
      this.isExtended = !this.isExtended;
      this.err = {
        message: '',
        type: '',
      };
      this.name = '';
      this.passcode = '';
      if (this.isExtended) {
        this.$refs.input.focus();
      }
    },
    async handleSubmit() {
      this.$store.dispatch('group/authenticate', { name: this.name, passcode: this.passcode })
        .then((result) => {
          if (result.success) {
            this.$socket.emit('getInitialState', { name: this.name });
            this.$router.push({ name: 'MemberCreate' });
          } else {
            this.err = {
              message: result.errMsg,
              type: result.errType,
            };
          }
        });
    },
  },
};
</script>

<style lang="scss" scoped>
  @import '@/scss/shared-styles-forms.scss';
</style>
