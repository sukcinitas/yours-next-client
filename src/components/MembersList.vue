<template>
  <div
    :class="[
      props.isBottom ? 'members--bottom' : 'members',
      props.isMessages ? 'members--messages' : '',
    ]"
  >
    <div
      v-for="member in activeMembers"
      :key="member.emoji"
      :class="[
        { members__moderator: moderator === member.name && !props.isMessages },
        'members__member',
        { members__you: user === member.name && !props.isMessages },
      ]"
      @dblclick="makeModerator(member.name)"
      @mouseover="
        (isTooltipDisplayed = true), (target = $event.target.innerText)
      "
      @mousedown="
        (isTooltipDisplayed = true), (target = $event.target.innerText)
      "
      @touchstart="
        (isTooltipDisplayed = true), (target = $event.target.innerText)
      "
      @touchmove="
        (isTooltipDisplayed = true), (target = $event.target.innerText)
      "
      @mouseout="isTooltipDisplayed = false"
      @mouseup="isTooltipDisplayed = false"
      @touchend="isTooltipDisplayed = false"
    >
      <p>{{ member.emoji }}</p>
      <p
        :class="{
          members__tooltip: isTooltipDisplayed && target === member.emoji,
          'members__tooltip--hidden':
            !isTooltipDisplayed || target !== member.emoji,
          'members__tooltip--bottom':
            isTooltipDisplayed && target === member.emoji && props.isBottom,
        }"
      >
        {{ user === member.name ? 'you' : member.name }}
        <span v-if="isModerator && user !== member.name && !props.isMessages" class="members__line"
        ></span>
        {{
          isModerator && user !== member.name && !props.isMessages
            ? `double-click to make ${member.name} moderator`
            : ''
        }}
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useGroupStore } from '../stores/group';
import { socket } from "@/socket";

const props = defineProps(['isBottom', 'isMessages'])
const isTooltipDisplayed = ref(false)
const target = ref('')
const groupStore = useGroupStore()

const activeMembers = computed(() => {
  return groupStore.activeMembers;
})

const isModerator = computed(() => {
  return groupStore.isModerator
})

const moderator = computed(() => {
  return groupStore.moderator
})

const user = computed(() => {
  return groupStore.member.name
})

function  makeModerator(name) {
  if (isModerator.value && !props.isMessages) {
    if (moderator.value !== name) {
        socket.emit('setModerator', name);
      }
  }
}

</script>

<style lang="scss" scoped>
@import '../scss/shared-styles-forms.scss';
@import '../scss/shared-styles-buttons.scss';
@import '../scss/members-list.scss';
</style>
