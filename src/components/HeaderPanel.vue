<template>
  <div class="header">
    <button v-if="leaveBtn" @click="leave" class="header__button">Leave</button>
    <button v-if="homeBtn" @click="goHome" class="header__button">Home</button>
    <button v-if="backBtn" @click="goBack" class="header__button">Back</button>
  </div>
</template>

<script>
export default {
  name: 'HeaderPanel',
  data() {
    return {
      errMsg: '',
    };
  },
  props: ['leaveBtn', 'backBtn', 'homeBtn'],
  methods: {
    async leave() {
      try {
        await this.$store.dispatch('group/resetState');
        this.$router.push({ name: 'EntrancePage' });
      } catch (err) {
        this.errMsg = err.message;
      }
    },

    goHome() {
      this.$router.push({ name: 'MainPage' });
    },

    goBack() {
      this.$router.go(-1);
    },
  },
};
</script>

<style lang="scss" scoped>
@import '@/scss/shared-styles-forms.scss';
@import '@/scss/shared-styles-buttons.scss';
@import '@/scss/main-page.scss';
@import '@/scss/header-panel.scss';
</style>
