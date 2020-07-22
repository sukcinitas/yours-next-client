<template>
    <form submit.prevent="addMember" class="create-member-form">
      <h4 class="create-member-form__heading">Welcome to group <b>{{group}}</b></h4>
      <h6 v-if="!isShowingEmojiSelection"
      class="create-member-form__subheading">What will you name yourself, fellow?</h6>
      <div class="wrapper">
        <input
            v-if="!isShowingEmojiSelection"
          v-model="name"
          type="text"
          placeholder=""
          class="create-member-form__input"
        >
        <button
          v-if="!isShowingEmojiSelection"
          class="create-member-form__button--small"
          @click="checkIfMemberNameExists"
          :disabled="!name"
          type="button"
        >>
        </button>
      </div>


      <h6 class="create-member-form__subheading" v-if="isShowingEmojiSelection">Choose an icon</h6>
      <div class="create-member-form__emoji-box" v-if="isShowingEmojiSelection">
        <button
        v-for="(emoji, index) in emojisFreeToSet"
        :key="index"
        @click="addMember(emoji)"
        type="submit"
          class="create-member-form__button--emoji"
        >
        {{emoji}}
        </button>
      </div>
      <p v-if="errMsg && !isShowingEmojiSelection" class="message--error">{{errMsg}}</p>
    </form>
</template>

<script>
export default {
  name: 'MemberCreate',
  data() {
    return {
      name: '',
      errMsg: '',
      isShowingEmojiSelection: false,
    };
  },
  computed: {
    group() {
      return this.$store.state.group.name;
    },
    emojisFreeToSet() {
      return this.$store.getters['group/emojisFreeToSet'];
    },
    memberNameExists() {
      return this.$store.getters['group/activeMembersNames'].indexOf(this.name) >= 0;
    },
  },
  methods: {
    checkIfMemberNameExists() {
      if (this.memberNameExists) {
        this.errMsg = 'Name is already in use!';
      } else {
        this.isShowingEmojiSelection = true;
      }
    },
    async addMember(emoji) {
      if (this.memberNameExists) { // extra if names are being created in parallel
        this.errMsg = 'Name is already in use!';
        this.isShowingEmojiSelection = false;
        return;
      }
      this.$socket.emit('setMember', { name: this.name, emoji }); // only this socket
      this.$socket.emit('addMember', { name: this.name, emoji });
      this.$router.push({ name: 'MainPage' });
    },
  },
};
</script>

<style lang="scss" scoped>
  @import '@/scss/shared-styles-forms.scss';
  @import '@/scss/shared-styles-buttons.scss';
  .wrapper {
    display: flex;
  }
</style>
