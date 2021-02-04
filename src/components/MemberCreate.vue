<template>
  <form @submit.prevent="addMember" class="create-member-form">
    <h4 class="create-member-form__heading">
      Welcome to group
      <b class="create-member-form__heading--bold">{{ group }}</b>
    </h4>
    <h6
      v-show="!isShowingEmojiSelection"
      class="create-member-form__subheading"
    >
      What will you name yourself, fellow?
    </h6>
    <div class="wrapper" v-show="!isShowingEmojiSelection">
      <input
        v-model="name"
        type="text"
        placeholder=""
        :class="['create-member-form__input', errMsg ? 'input--error' : '']"
        @input="() => {if(!name) this.errMsg = '' }"
      />
      <button
        class="create-member-form__button--small"
        @click="checkIfMemberNameExists"
        @keyup.enter="checkIfMemberNameExists"
        :disabled="!name"
        type="button"
      >
        >
      </button>
    </div>

    <h6 class="create-member-form__subheading" v-show="isShowingEmojiSelection">
      Choose an emoji
    </h6>
    <div class="create-member-form__emoji-box" v-show="isShowingEmojiSelection">
      <button
        v-for="(emoji, index) in emojisFreeToSet"
        :key="index"
        @click="chooseEmoji(emoji)"
        type="button"
        :class="[
          selectedEmoji === emoji
            ? 'create-member-form__button--selected-emoji'
            : 'create-member-form__button--emoji',
        ]"
      >
        {{ emoji }}
      </button>
    </div>
    <button
      v-show="isShowingEmojiSelection"
      type="submit"
      class="create-member-form__button--small"
      :disabled="!selectedEmoji || !name"
      ref="submitButton"
    >
      >
    </button>
    <p
      v-if="errMsg && !isShowingEmojiSelection && name"
      class="create-member-form__message--error"
    >
      {{ errMsg }}
    </p>
  </form>
</template>

<script>
export default {
  name: 'MemberCreate',
  data() {
    return {
      name: '',
      selectedEmoji: '',
      errMsg: '',
      isShowingEmojiSelection: false,
    };
  },
  computed: {
    group() {
      return this.$store.getters['group/name'];
    },
    emojisFreeToSet() {
      return this.$store.getters['group/emojisFreeToSet'];
    },
    memberNameExists() {
      const name = this.name.toLowerCase();
      const activeMembersNames = this.$store.getters[
        'group/activeMembersNames'
      ].map(memberName => memberName.toLowerCase());
      return activeMembersNames.indexOf(name) >= 0;
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

    chooseEmoji(emoji) {
      this.selectedEmoji = emoji;
      this.$refs.submitButton.focus();
    },

    addMember() {
      if (this.memberNameExists) {
        // extra if names are being created in parallel
        this.errMsg = 'Another member at this very moment used this name! Please try another one!';
        this.isShowingEmojiSelection = false;
        return;
      }
      this.$store.dispatch('group/addMember', {
        name: this.name,
        emoji: this.selectedEmoji,
      });
      this.$router.push({ name: 'MainPage' });
    },

    // checkIfEmptyAndDeleteErr() {
    //   if (this.name === '') {
    //     this.errMsg = '';
    //   }
    // },
  },
};
</script>

<style lang="scss" scoped>
@import '@/scss/member-create.scss';
</style>
