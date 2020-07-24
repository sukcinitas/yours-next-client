<template>
    <div :class="[isBottom ? 'members--bottom' : 'members']">
      <div
        v-for="member in activeMembers"
        :key="member.emoji"
        :class="[{'members__moderator': moderator === member.name}, 'members__member']"
        @click="makeModerator(member.name)"
        @mouseover="isTooltipDisplayed = true, target = $event.target.innerText"
        @mouseout="isTooltipDisplayed = false"
      >
        <p>{{member.emoji}}</p>
        <p
          :class="{'members__tooltip': isTooltipDisplayed && target === member.emoji,
          'members__tooltip--hidden': !isTooltipDisplayed || target !== member.emoji}"
        >
        {{naming(member.name)}}
        </p>
      </div>
    </div>
</template>

<script>
export default {
  name: 'MembersList',
  props: ['isBottom'],
  data() {
    return {
      isTooltipDisplayed: false,
      target: '',
    };
  },
  computed: {
    activeMembers() {
      return this.$store.state.group.activeMembers;
    },
    isModerator() {
      return this.$store.getters['group/isModerator'];
    },
    moderator() {
      return this.$store.state.group.moderator;
    },
  },
  methods: {
    makeModerator(name) {
      if (this.isModerator) {
        if (this.moderator === name) {
          return;
        }
        this.$socket.emit('setModerator', name);
      }
    },
    naming(name) {
      if (this.$store.state.group.member.name === name) {
        return 'you';
      }
      return this.isModerator ? `click to make ${name} the moderator` : name;
    },
  },
};
</script>

<style lang="scss" scoped>
  @import '@/scss/shared-styles-forms.scss';
  @import '@/scss/shared-styles-buttons.scss';
  @import '@/scss/members-list.scss';
</style>
