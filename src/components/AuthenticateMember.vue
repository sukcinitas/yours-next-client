<template>
  <div>
    <form
      :class="['entry-form', isExtended ? 'entry-form--extended' : '']"
      @submit.prevent="handleSubmit"
    >
      <button
        type="button"
        class="entry-form__button"
        @click="toggleExtended"
      >
        {{ props.name }}
      </button>
      <input
        ref="name"
        v-model="formData.name"
        type="text"
        placeholder="Enter the group name"
        :class="[
          isExtended ? 'entry-form--extended__input' : 'entry-form__input',
          errors.name ? 'input--error' : '',
        ]"
        @input="resetError('name')"
      >
      <input
        ref="passcode"
        v-model="formData.passcode"
        type="password"
        placeholder="Enter the passcode"
        :class="[
          isExtended ? 'entry-form--extended__input' : 'entry-form__input',
          errors.passcode ? 'input--error' : '',
        ]"
        @input="resetError('passcode')"
      >
      <button
        type="submit"
        :disabled="!formData.name || !formData.passcode"
        :class="[
          isExtended
            ? 'entry-form--extended__button--narrow' : 'entry-form__button--narrow',
        ]"
      >
        >
      </button>
    </form>
    <p
      v-for="errorMessage, idx in errorMessages"
      :key="idx"
      class="entry-form__message--error"
    >
      {{ errorMessage }}
    </p>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { useGroupStore } from '@/stores/group.js'

const props = defineProps({
  type: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
})
const emit = defineEmits(['authenticate'])
const groupStore = useGroupStore()

const isExtended = ref(false)
const formData = reactive({
  name: 'bebriukai',
  passcode: 'bebriukai'
})
const errors = reactive({
  name: '',
  passcode: '',
  other: ''
})

const name = ref(null)
const passcode = ref(null)

const errorMessages = computed(() => {
  return Object.values(errors).filter(errorMessage => Boolean(errorMessage))
})

function toggleExtended() {
  isExtended.value = !isExtended.value
  errors.name = ''
  errors.passcode = ''
  errors.other = ''
  formData.name = formData.name === 'bebriukai' ? 'bebriukai' : ''
  formData.passcode = formData.passcode === 'bebriukai' ? 'bebriukai' : ''
  if (isExtended.value) {
    name.value.focus()
  }
}

function resetError(type) {
  if (!formData[type]) {
    errors[type] = ''
  }
}

async function handleSubmit() {
  try {
    let result = null
    if (props.type === 'authenticate') {
      result = await groupStore.authenticate(formData)
    } else if (props.type === 'create'){
      if (formData.passcode.length < 8) {
        errors.passcode = 'Passcode must be at least 8 characters long!'
        return;
      }
      result = await groupStore.createGroup(formData)
    }
    if (result?.success) {
      emit('authenticate')
    }
  } catch (err) {
    if (!(err?.response?.data)) {
      errors.other = 'Something went wrong!'
      return
    }
    const { message, type } = err.response.data;
    errors[type]= message
    [type].value.focus()
  }
}

</script>

<style lang="scss" scoped>
@import '../scss/shared-styles-forms.scss';
</style>
