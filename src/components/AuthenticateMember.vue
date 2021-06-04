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
      >
        Join a group
      </button>
      <input
        ref="name"
        v-model="name"
        type="text"
        placeholder="Enter the group name"
        :class="[
          isExtended ? 'entry-form--extended__input' : 'entry-form__input',
          err.type === 'name' ? 'input--error' : '',
        ]"
        @input="checkIfEmpty('name')"
      />
      <input
        ref="passcode"
        v-model="passcode"
        type="password"
        placeholder="Enter the passcode"
        :class="[
          isExtended ? 'entry-form--extended__input' : 'entry-form__input',
          err.type === 'passcode' ? 'input--error' : '',
        ]"
        @input="checkIfEmpty('passcode')"
      />
      <button
        type="submit"
        :disabled="!name || !passcode"
        :class="[
          isExtended
            ? 'entry-form--extended__button--narrow'
            : 'entry-form__button--narrow',
        ]"
      >
        >
      </button>
    </form>
    <p v-if="err.message && isExtended" class="entry-form__message--error">
      {{ err.message }}
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
      try {
        const result = await this.$store
          .dispatch('group/authenticate', {
            name: this.name,
            passcode: this.passcode,
          });
        if (result.success) {
          this.$emit('authenticate');
        }
      } catch (err) {
        const { message, type } = err.response.data;
        this.err = {
          message,
          type,
        };
        if (type === 'name') {
          this.$refs.name.focus();
        } else {
          this.$refs.passcode.focus();
        }
      }
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
@import '../scss/shared-styles-forms.scss';
</style>
