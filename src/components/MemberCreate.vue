<template>
  <form
    class="create-member-form"
    @submit.prevent="addMember"
  >
    <h4 class="create-member-form__heading">
      Welcome to group
      <b class="create-member-form__heading--bold">{{ groupStore.name }}</b>
    </h4>
    <template v-if="step === 0">
      <h6
        class="create-member-form__subheading"
      >
        What will you name yourself, fellow?
      </h6>
      <div class="wrapper">
        <input
          v-model="name"
          type="text"
          placeholder=""
          :class="['create-member-form__input', errors.name ? 'input--error' : '']"
          @input="() => {if(!name) errors.name = '' }"
          @keydown.enter.prevent="handleMemberName"
        >
        <button
          class="create-member-form__button--narrow"
          :disabled="!name"
          type="button"
          @click="handleMemberName"
          @keyup.enter="handleMemberName"
        >
          >
        </button>
      </div>
    </template>

    <template v-else-if="step === 1">
      <h6 class="create-member-form__subheading">
        Choose an emoji
      </h6>
      <div class="create-member-form__emoji-box">
        <button
          v-for="(emoji, index) in groupStore.emojisFreeToSet"
          :key="emoji"
          type="button"
          :class="[
            selectedEmoji === emoji
              ? 'create-member-form__button--selected-emoji'
              : 'create-member-form__button--emoji',
          ]"
          @click="handleEmoji(emoji)"
        >
          {{ emoji }}
        </button>
      </div>
      <button
        ref="submitButton"
        type="submit"
        class="create-member-form__button--narrow"
        :disabled="!selectedEmoji || !name"
      >
        >
      </button>
    </template>

    <p
      v-if="errors.name && step === 0"
      class="create-member-form__message--error"
    >
      {{ errors.name }}
    </p>
    <p
      v-if="errors.emoji && step === 1"
      class="create-member-form__message--error"
    >
      {{ errors.emoji }}
    </p>
  </form>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useGroupStore } from '../stores/group';

const groupStore = useGroupStore()
const router = useRouter()

const name = ref('')
const selectedEmoji = ref(undefined)
const errors = reactive({
  name: '',
  emoji: '',
})
const step = ref(0)
const submitButton = ref(null)

const memberNameExists = computed(() => {
  const activeMembersNames = groupStore.activeMembersNames.map(memberName => memberName.toLowerCase());
  return activeMembersNames.indexOf(name.value.toLowerCase()) > -1;
})

function handleMemberName() {
  if (memberNameExists.value) {
    errors.name = 'Name is already in use!';
  } else {
    errors.name = '';
    step.value++;
  }
}

function handleEmoji(emoji) {
  selectedEmoji.value = emoji;
  submitButton.value.focus();
}

function addMember() {
  if (memberNameExists.value) {
    // extra if names are being created in parallel
    errors.name = 'Another member at this very moment used this name! Please try another one!';
    step.value = 0 
    return;
  }
  if (!selectedEmoji.value) {
    errors.emoji = 'Emoji must be selected!'
    return;
  }
  groupStore.addMember({ name: name.value, emoji: selectedEmoji.value });
  router.push({ name: 'MainView' });
}

</script>

<style lang="scss" scoped>
@import '../scss/member-create.scss';
</style>
