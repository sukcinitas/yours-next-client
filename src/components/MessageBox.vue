<template>
  <div :class="['message-box', { 'message-box--off': !isMessagesTurnedOn }]">
    <members-list :isMessages="true"></members-list>
    <div class="message-box__messages" ref="messagesBox">
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

<script setup>
import { onMounted, onUpdated, ref, watch, computed } from 'vue';
import MembersList from './MembersList.vue';
import { useMessagesStore } from '../stores/messages';
import { useGroupStore } from '../stores/group';

const messagesStore = useMessagesStore()
const groupStore = useGroupStore()

const message = ref('')
const messagesWillBeUpdated = ref(false)
const textarea = ref(null)
const messagesBox = ref(null)

const messages = computed(() => {
  return messagesStore.messages
})
const emojis = computed(() => {
  return messagesStore.messageEmojis
})
const member = computed(() => {
  return groupStore.member
})
const isMessagesTurnedOn = computed(() => {
  return messagesStore.chatState
})

function handleSubmit() {
  // $socket.emit('sendMessage', {
  //   message,
  //   member,
  // });
  message.value = '';
}

function addEmoji(emoji) {
  message.value = `${message.value} ${emoji}`;
  textarea.value.focus();
}

function scrollTop() {
  messagesBox.value.scrollTop = messagesBox.value.scrollHeight + messagesBox.value.clientHeight;
}

function toggleChat() {
  messagesStore.setChatState()
}

onUpdated(() => {
  if (messagesWillBeUpdated.value) {
    scrollTop();
    messagesWillBeUpdated.value = false;
  }
})

onMounted(() => {
  scrollTop();
})

watch(messages, () => {
  messagesWillBeUpdated.value = true
})

</script>

<style lang="scss">
@import '../scss/shared-styles-buttons.scss';
@import '../scss/message-box';
</style>
