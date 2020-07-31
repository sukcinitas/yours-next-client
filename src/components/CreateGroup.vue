<template>
  <div>
      <form
    @submit.prevent="handleSubmit"
    :class="[{'entry-form--extended': isExtended}, {'entry-form':!isExtended}]"
    >
      <button
        @click="extend"
        type="button"
        class="entry-form__button"
        >
        Create a group
      </button>
      <input
        v-model="name"
        type="text"
        placeholder="Enter a group name"
        :class="[{'entry-form__input-1--extended': isExtended},
         {'entry-form__input-1':!isExtended}]"
      >
      <input
        v-model="passcode"
        type="password"
        placeholder="Enter a passcode"
        :class="[{'entry-form__input-2--extended': isExtended},
         {'entry-form__input-2':!isExtended}]"
      >
      <button
        type="submit"
        :class="[{'entry-form__button--small--extended': isExtended},
        {'entry-form__button--small':!isExtended}]"
      >
      >
      </button>
    </form>
    <p v-if="errMsg && isExtended" class="entry-form__message--error">{{errMsg}}</p>
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

<style lang="scss" scoped>
  @import '@/scss/shared-styles-forms.scss';
</style>
