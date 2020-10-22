<template>
  <div>
    <form
      @submit.prevent="handleSubmit"
      :class="['entry-form', isExtended ? 'entry-form--extended' : '']"
    >
      <button
        @click="toggleExtended"
        type="button"
        class="entry-form__button"
      >Join a group
      </button>
      <input
        ref="name"
        v-model="name"
        type="text"
        placeholder="Enter the group name"
        :class="[isExtended ? 'entry-form__input-1--extended' : 'entry-form__input-1',
        err.type === 'name' ? 'input--error' : '']"
        @input="checkIfEmpty('name')"
      >
      <input
        ref="passcode"
        v-model="passcode"
        type="password"
        placeholder="Enter the passcode"
        :class="[isExtended ? 'entry-form__input-2--extended' : 'entry-form__input-2',
        err.type === 'passcode' ? 'input--error' : '']"
        @input="checkIfEmpty('passcode')"
      >
      <button
        type="submit"
        :disabled="!name || !passcode"
        :class="[isExtended ? 'entry-form__button--small--extended' : 'entry-form__button--small']"
      >>
      </button>
    </form>
    <p
      v-if="err.type === 'name' && isExtended"
      class="entry-form__message--error"
    >{{err.message}}
    </p>
    <p
      v-if="err.type === 'passcode' && isExtended"
      class="entry-form__message--error"
    >{{err.message}}
    </p>
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
        this.$refs.name.focus();
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
            if (result.errType === 'name') {
              this.$refs.name.focus();
            } else {
              this.$refs.passcode.focus();
            }
          }
        });
    },
    checkIfEmpty(type) {
      if (this[type] === '') {
        this.deleteErr(type);
      }
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
