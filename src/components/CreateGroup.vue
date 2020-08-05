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
        >
        Create a group
      </button>
      <input
        ref="input"
        v-model="name"
        type="text"
        placeholder="Enter a group name"
        :class="[isExtended ? 'entry-form__input-1--extended' : 'entry-form__input-1',
        err.type === 'name' ? 'input--error' : '']"
        @click="deleteErr('name')"
      >
      <input
        v-model="passcode"
        type="password"
        placeholder="Enter a passcode"
        :class="[isExtended ? 'entry-form__input-2--extended' : 'entry-form__input-2',
        err.type === 'passcode' ? 'input--error' : '']"
        @click="deleteErr('passcode')"
      >
      <button
        type="submit"
        :class="[{'entry-form__button--small--extended': isExtended},
        {'entry-form__button--small':!isExtended}]"
      >
      >
      </button>
    </form>
    <p v-if="err.message && isExtended" class="entry-form__message--error">{{err.message}}</p>
  </div>
</template>

<script>
export default {
  name: 'CreateGroup',
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
      if (this.passcode.length < 8) {
        this.err = {
          message: 'Passcode must be at least 8 characters long!',
          type: 'passcode',
        };
        return;
      }
      this.$store.dispatch('group/createGroup', { name: this.name, passcode: this.passcode })
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
    deleteErr(type) {
      if (this.err.type === type) {
        this.err = {
          message: '',
          type: '',
        };
      }
    },
  },
};
</script>

<style lang="scss" scoped>
  @import '@/scss/shared-styles-forms.scss';
</style>
