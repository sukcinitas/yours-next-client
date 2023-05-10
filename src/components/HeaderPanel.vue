<template>
  <div class="header">
    <button v-if="props.leaveBtn" @click="leave" class="header__button">Leave</button>
    <button v-if="props.homeBtn" @click="goHome" class="header__button">Home</button>
    <button v-if="props.backBtn" @click="goBack" class="header__button">Back</button>
  </div>
</template>

<script setup>
import { useGroupStore } from '../stores/group'
import { useRouter } from 'vue-router'

const props = defineProps(['leaveBtn', 'backBtn', 'homeBtn'])
const groupStore = useGroupStore()
const router = useRouter()
// const errors = reactive({
//   leave: ''
// })

async function leave() {
  try {
    await groupStore.resetState();
    router.push({ name: 'EntranceView' });
  } catch (err) {
    // this.errors.leave = err.message;
  }
}
function goHome() {
  router.push({ name: 'MainView' });
}
function goBack() {
  router.go(-1);
}
</script>

<style lang="scss" scoped>
@import '../scss/shared-styles-forms.scss';
@import '../scss/shared-styles-buttons.scss';
@import '../scss/main-page.scss';
@import '../scss/header-panel.scss';
</style>
