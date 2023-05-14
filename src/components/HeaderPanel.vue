<template>
  <div class="header">
    <button
      class="header__logo"
      @click="goHome"
    >
      YN
    </button>
    <button
      v-if="props.leaveBtn"
      class="header__button"
      @click="leave"
    >
      Leave
    </button>
    <button
      v-if="props.backBtn"
      class="header__button"
      @click="goBack"
    >
      Back
    </button>
  </div>
</template>

<script setup>
import { useGroupStore } from '../stores/group'
import { useRouter } from 'vue-router'

const props = defineProps({
  leaveBtn: Boolean,
  backBtn: Boolean,
})
const groupStore = useGroupStore()
const router = useRouter()

async function leave() {
  try {
    await groupStore.resetState();
    router.push({ name: 'EntranceView' });
  } catch (err) {
    //
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
