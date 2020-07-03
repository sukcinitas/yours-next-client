<template>
    <form @submit.prevent="handleSubmit">
      <input type="text" v-model="message">
      <div>
        <p v-for="emoji in emojis" :key="emoji" @click="addEmoji(emoji)">
          {{emoji}}
        </p>
      </div>
      <button type="submit">Submit</button>
    </form>
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
