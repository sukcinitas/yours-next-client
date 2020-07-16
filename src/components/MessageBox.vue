<template>
  <div>
    <div>
      <p v-for="(message, index) in messages" :key="index">
        {{`${message.name}: ${message.message}`}}
      </p>
    </div>
    <form @submit.prevent="handleSubmit">
      <input type="text" v-model="message">
      <div>
        <p v-for="emoji in emojis" :key="emoji" @click="addEmoji(emoji)">
          {{emoji}}
        </p>
      </div>
      <button type="submit">Submit</button>
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
