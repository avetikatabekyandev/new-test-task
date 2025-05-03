<template>
  <div :class="['drop-zone', position, { hovered: active }]">
    <div v-if="active" class="drop-zone__placeholder" />
  </div>
</template>

<script setup lang="ts">
import { defineProps } from 'vue'

defineProps<{
  position: 'top' | 'bottom' | 'left' | 'right'
  groupIndex: number
  fieldIndex?: number
  active: boolean
}>()
</script>

<style scoped lang="scss">
.drop-zone {
  align-items: center;
  justify-content: center;

  &.left,
  &.right {
    display: none;
    width: 100%;
    height: 51px;
    border-radius: 3px;
  }

  &.top,
  &.bottom {
    height: 8px;
    width: 100%;
  }

  &.hovered {
    display: block;
  }

  &__placeholder {
    width: 100%;
    height: 100%;
    background-color: rgba(0, 188, 212, 0.3);
    border-radius: 6px;
    border: 2px dashed #00bcd4;
    box-sizing: border-box;
  }
}
</style>