<template>
  <div
   :class="['message-box', { 'message-box--off': !isMessagesTurnedOn }]"
  >
    <members-list :isMessages="true"></members-list>
    <div class="message-box__messages" ref="messages">
      <div
        :class="[
          'message-box__message',
          {
            'message-box__message--right': member.name === message.member.name,
          },
        ]"
        v-for="(message, index) in messages"
        :key="index"
      >
        <div
          :class="[member.name === message.member.name ?
           'message-box__message-member--right' : 'message-box__message-member']"
        >
          <p class="message-box__message-name">{{ message.member.name }}</p>
          <p class="message-box__message-emoji" :title="message.member.name">
            {{ message.member.emoji }}
          </p>
        </div>
          <p
            v-for="(n, index) in message.message"
            :key="index"
            :class="[member.name === message.member.name ?
           'message-box__message-content--right' : 'message-box__message-content']"
            >
            {{n}}
          </p>
      </div>
    </div>
    <form @submit.prevent="handleSubmit" class="message-box__message-form">
      <div class="message-box__input">
        <textarea
          type="text"
          v-model="message"
          class="message-box__textarea"
          rows="2"
          ref="textarea"
        >
        </textarea>
        <div class="message-box__emojies">
          <span
            v-for="emoji in emojis"
            :key="emoji"
            @click.prevent="addEmoji(emoji)"
          >
            {{ emoji }}
          </span>
        </div>
      </div>
      <button class="message-box__button" type="submit" :disabled="!message">
        <span>Submit</span>
      </button>
    </form>
    <button
      :class="[isMessagesTurnedOn ? 'btn--turn-off' : 'btn--hidden']"
      type="button"
      @click="toggleChat"
    >
      <span class="icon--off"><font-awesome-icon :icon="['fas', 'chevron-right']"></font-awesome-icon></span>
    </button>
    <button
      :class="[!isMessagesTurnedOn ? 'btn--turn-on' : 'btn--hidden']"
      type="submit"
      @click="toggleChat"
    >
      <span class="icon--on"><font-awesome-icon :icon="['fas', 'chevron-left']"> </font-awesome-icon></span>
    </button>
  </div>
</template>

<script>
import MembersList from './MembersList';

export default {
  name: 'MessageBox',
  components: { MembersList },
  data() {
    return {
      message: '',
      messagesWillBeUpdated: false,
    };
  },
  computed: {
    messages() {
      return this.$store.getters['messages/messages'];
    },
    emojis() {
      return this.$store.getters['messages/messageEmojis'];
    },
    member() {
      return this.$store.getters['group/member'];
    },
    isMessagesTurnedOn() {
      return this.$store.getters['messages/chatState'];
    },
  },
  watch: {
    messages() {
      this.messagesWillBeUpdated = true;
    },
  },
  methods: {
    handleSubmit() {
      this.$socket.emit('sendMessage', {
        message: this.message,
        member: this.member,
      });
      this.message = '';
    },

    addEmoji(emoji) {
      this.message = `${this.message} ${emoji}`;
      this.$refs.textarea.focus();
    },

    scrollTop() {
      this.$refs.messages.scrollTop =
        this.$refs.messages.scrollHeight + this.$refs.messages.clientHeight;
    },

    toggleChat() {
      this.$store.commit('messages/setChatState');
    },
  },
  updated() {
    if (this.messagesWillBeUpdated) {
      this.scrollTop();
      this.messagesWillBeUpdated = false;
    }
  },
  mounted() {
    this.scrollTop();
  },
};
</script>

<style lang="scss">
@import '../scss/shared-styles-buttons.scss';
@import '../scss/message-box';
</style>
