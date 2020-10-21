<template>
  <div class="message-box">
    <div class="message-box__messages" ref="messages">
      <div class="message-box__message" v-for="(message, index) in messages" :key="index">
        <p class="message-box__message-name">{{message.name}}</p>
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
      <button class="message-box__button" type="submit" :disabled="!message">Submit</button>
    </form>
</div>

</template>

<script>
export default {
  name: 'MemberCreate',
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
    memberName() {
      return this.$store.state.group.member.name;
    },
  },
  watch: {
    messages() {
      this.messagesWillBeUpdated = true;
    },
  },
  methods: {
    handleSubmit() {
      this.$socket.emit('sendMessage', { message: this.message, member: this.memberName });
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
  @import '@/scss/message-box';
</style>
