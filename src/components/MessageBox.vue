<template>
  <div :class="['message-box', {'message-box--off': !isMessagesTurnedOn}]">
    <members-list :isMessages="true"></members-list>
    <div class="message-box__messages" ref="messages">
      <div :class="['message-box__message',
       {'message-box__message--right': member.name === message.member.name}]"
           v-for="(message, index) in messages" :key="index">
        <div class="message-box__message-member">
          <p class="message-box__message-name">{{message.member.name}}</p>
          <p class="message-box__message-emoji" :title="message.member.name">
            {{message.member.emoji}}
          </p>
        </div>
        <p class="message-box__message-content">{{message.message}}</p>
      </div>
    </div>
    <form @submit.prevent="handleSubmit" class="message-box__message-form">
      <div class="message-box__input">
        <textarea
          type="text"
          v-model="message"
          class="message-box__textarea"
          rows=2
          ref="textarea"
        >
        </textarea>
        <div class="message-box__emojies">
          <span v-for="emoji in emojis" :key="emoji" @click="addEmoji(emoji)">
            {{emoji}}
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
      @click="turnOffMessages"
    >
      <font-awesome-icon :icon="['fas', 'chevron-right']"></font-awesome-icon>
    </button>
    <button
    :class="[!isMessagesTurnedOn ? 'btn--turn-on' : 'btn--hidden']"
    type="button"
    @click="turnOnMessages"
    >
      <font-awesome-icon :icon="['fas', 'chevron-left']"></font-awesome-icon>
    </button>
</div>

</template>

<script>
import MembersList from './MembersList';

export default {
  name: 'MemberCreate',
  components: { MembersList },
  data() {
    return {
      message: '',
      messagesWillBeUpdated: false,
    };
  },
  computed: {
    messages() {
      return this.$store.state.group.messages;
    },
    emojis() {
      return this.$store.state.group.messageEmojis;
    },
    member() {
      return this.$store.state.group.member;
    },
    isMessagesTurnedOn() {
      return this.$store.getters['group/chatState'];
    },
  },
  watch: {
    messages() {
      this.messagesWillBeUpdated = true;
    },
  },
  methods: {
    handleSubmit() {
      this.$socket.emit('sendMessage', { message: this.message, member: this.member });
      this.message = '';
    },
    addEmoji(emoji) {
      this.message = `${this.message} ${emoji}`;
      this.$refs.textarea.focus();
    },
    scrollTop() {
      this.$refs.messages.scrollTop = this.$refs.messages.scrollHeight
       + this.$refs.messages.clientHeight;
    },
    turnOffMessages() {
      this.$store.commit('group/setChatState', { state: false });
    },
    turnOnMessages() {
      this.$store.commit('group/setChatState', { state: true });
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

  @import '@/scss/shared-styles-buttons.scss';
  @import '@/scss/message-box';
</style>
