<template>
  <div>
    <div class="message-box__messages">
      <p v-for="(message, index) in messages" :key="index">
        {{`${message.name}: ${message.message}`}}
      </p>
    </div>
    <form @submit.prevent="handleSubmit" class="message-box__message-form">
      <div class="message-box__input">
        <textarea type="text" v-model="message" class="message-box__textarea" rows=2></textarea>
        <div class="message-box__emojies">
          <span v-for="emoji in emojis" :key="emoji" @click="addEmoji(emoji)">
            {{emoji}}
          </span>
        </div>
      </div>
      <button class="message-box__button" type="submit">Submit</button>
    </form>
</div>

</template>

<script>
export default {
  name: 'MemberCreate',
  data() {
    return {
      message: '',
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
  methods: {
    handleSubmit() {
      this.$socket.emit('sendMessage', { message: this.message, member: this.memberName });
      this.message = '';
    },
    addEmoji(emoji) {
      this.message = `${this.message}${emoji}`;
    },
  },
};
</script>

<style lang="scss">
  @import '@/scss/message-box';
</style>
