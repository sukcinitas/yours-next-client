<template>
  <div
    :class="[
      isBottom ? 'members--bottom' : 'members',
      isMessages ? 'members--messages' : '',
    ]"
  >
    <div
      v-for="member in activeMembers"
      :key="member.emoji"
      :class="[
        { members__moderator: moderator === member.name && !isMessages },
        'members__member',
        { members__you: user === member.name && !isMessages },
      ]"
      @dblclick="makeModerator(member.name)"
      @mouseover="
        (isTooltipDisplayed = true), (target = $event.target.innerText)
      "
      @mousedown="
        (isTooltipDisplayed = true), (target = $event.target.innerText)
      "
      @mouseout="isTooltipDisplayed = false"
      @mouseup="isTooltipDisplayed = false"
    >
      <p>{{ member.emoji }}</p>
      <p
        :class="{
          members__tooltip: isTooltipDisplayed && target === member.emoji,
          'members__tooltip--hidden':
            !isTooltipDisplayed || target !== member.emoji,
          'members__tooltip--bottom':
            isTooltipDisplayed && target === member.emoji && isBottom,
        }"
      >
        {{ user === member.name ? 'you' : member.name }}
        {{
          isModerator && user !== member.name && !isMessages
            ? `\n---\nDouble-click to make ${member.name} moderator`
            : ''
        }}
      </p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'MembersList',
  props: ['isBottom', 'isMessages'],
  data() {
    return {
      isTooltipDisplayed: false,
      target: '',
    };
  },
  computed: {
    activeMembers() {
      return this.$store.state.group.activeMembers.map(member => member);
    },
    isModerator() {
      return this.$store.getters['group/isModerator'];
    },
    moderator() {
      return this.$store.state.group.moderator;
    },
    user() {
      return this.$store.state.group.member.name;
    },
  },
  methods: {
    makeModerator(name) {
      if (this.isModerator && !this.isMessages) {
        if (this.moderator === name) {
          return;
        }
        this.$socket.emit('setModerator', name);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
@import '@/scss/shared-styles-forms.scss';
@import '@/scss/shared-styles-buttons.scss';
@import '@/scss/members-list.scss';
</style>
