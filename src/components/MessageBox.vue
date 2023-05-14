<template>
  <div :class="['message-box', { 'message-box--off': !isMessagesTurnedOn }]">
    <members-list :is-messages="true" />
    <div
      ref="messagesBox"
      class="message-box__messages"
    >
      <div
        v-for="(mes, index) in messages"
        :key="index"
        :class="[
          'message-box__message',
          {
            'message-box__message--right': groupStore.member.name === mes.member.name,
          },
        ]"
      >
        <div
          :class="[groupStore.member.name === mes.member.name ?
            'message-box__message-member--right' : 'message-box__message-member']"
        >
          <p class="message-box__message-name">
            {{ mes.member.name }}
          </p>
          <p
            class="message-box__message-emoji"
            :title="mes.member.name"
          >
            {{ mes.member.emoji }}
          </p>
        </div>
        <p
          v-for="(n, messageIndex) in mes.message"
          :key="messageIndex"
          :class="[groupStore.member.name === mes.member.name ?
            'message-box__message-content--right' : 'message-box__message-content']"
        >
          {{ n }}
        </p>
      </div>
    </div>
    <form
      class="message-box__message-form"
      @submit.prevent="handleSubmit"
    >
      <div class="message-box__input">
        <textarea
          ref="textarea"
          v-model="message"
          type="text"
          class="message-box__textarea"
          rows="2"
        />
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
      <button
        class="message-box__button"
        type="submit"
        :disabled="!message"
      >
        <span>Submit</span>
      </button>
    </form>
    <button
      :class="[isMessagesTurnedOn ? 'btn--turn-off' : 'btn--hidden']"
      type="button"
      @click="toggleChat"
    >
      <span class="icon--off"><font-awesome-icon :icon="['fas', 'chevron-right']" /></span>
    </button>
    <button
      :class="[!isMessagesTurnedOn ? 'btn--turn-on' : 'btn--hidden']"
      type="submit"
      @click="toggleChat"
    >
      <span class="icon--on"><font-awesome-icon :icon="['fas', 'chevron-left']" /></span>
    </button>
  </div>
</template>

<script setup>
import { onMounted, onUpdated, ref, watch, computed } from 'vue';
import MembersList from './MembersList.vue';
import { useMessagesStore } from '../stores/messages';
import { useGroupStore } from '../stores/group';
import { socket } from "@/socket";

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

const isMessagesTurnedOn = computed(() => {
  return messagesStore.chatState
})

function handleSubmit() {
  socket.emit('sendMessage', {
    message: message.value,
    member: groupStore.member,
  });
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
