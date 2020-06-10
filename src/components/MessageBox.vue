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
      emojis: ['😃', '😍'],
    };
  },
  methods: {
    handleSubmit() {
      this.$socket.emit('sendMessage', { message: this.message });
      this.message = '';
    },
    addEmoji(emoji) {
      this.message = `${this.message}${emoji}`;
    },
  },
};
</script>
