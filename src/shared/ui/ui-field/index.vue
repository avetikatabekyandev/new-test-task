<template>
  <div
      class="field"
      draggable="true"
  >
    {{ field.label }}
  </div>
</template>

<script setup lang="ts">
import { defineProps } from 'vue'
import type { Field } from '@/entities/field/model/field'

defineProps<{ field: Field }>()
</script>

<style lang="scss" scoped>
.field {
  width: 100%;
  background: #232532;
  padding: 16px;
  color: #fff;
  border-radius: 3px;
  cursor: grab;
  user-select: none;
  transition: background-color 0.2s;

  &:active {
    cursor: grabbing;
    background-color: #3a3a3a;
  }
}
</style>
