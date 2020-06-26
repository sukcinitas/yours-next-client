<template>
    <section>
      <div v-if="!isShowingEmojiSelection">
        <h1>Welcome to group <b>{{group}}</b></h1>
        <p>What will you call yourself, fellow?</p>
        <input
          v-model="name"
          type="text"
          placeholder=""
        >
        <button @click="checkIfMemberNameExists" :disabled="!name">></button>
      </div>

      <div v-if="isShowingEmojiSelection">
        <h6>Choose an icon</h6>
        <button
          v-for="(emoji, index) in emojisFreeToSet"
          :key="index"
          @click="addMember(emoji)"
        >
        {{emoji}}
        </button>
      </div>
      <p v-if="errMsg">{{errMsg}}</p>
    </section>
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
      const initial = ['🦄', '🐧', '🐍', '🌞', '🍆', '👩🏻‍🦰'];
      const filtered = [];
      for (let i = 0; i < initial.length; i += 1) {
        if (!this.$store.state.group.chosenEmojis.includes(initial[i])) {
          filtered.push(initial[i]);
        }
      }
      return filtered;
    },
  },
  methods: {
    checkIfMemberNameExists() {
      if ((this.$store.state.group.activeMembers).indexOf(this.name) >= 0) {
        this.errMsg = 'Name is already in use!';
      } else {
        this.isShowingEmojiSelection = true;
      }
    },
    async addMember(emoji) {
      this.$socket.emit('setMember', { name: this.name, emoji });
      this.$socket.emit('addMember', { name: this.name, emoji });
      this.$router.push({ name: 'MainPage' });
    },
  },
};
</script>
