<template>
  <div class="drop-zone" :class="{ hovered: active }" />
</template>

<script setup lang="ts">
import { defineProps } from 'vue'

defineProps<{
  position: 'top' | 'bottom'
  groupIndex: number
  active: boolean
}>()
</script>

<style lang="scss" scoped>
.drop-zone {
  height: 8px;
  transition: background-color 0.2s;
  border: 1px dashed transparent;

  &.hovered {
    border-color: #00bcd4;
  }
}
</style>
