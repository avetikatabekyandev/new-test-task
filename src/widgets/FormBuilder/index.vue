<template>
  <div class="form-grid">
    <template v-for="(group, gIndex) in groups" :key="gIndex">
      <DropZone
          position="top"
          :groupIndex="gIndex"
          :active="getZoneClass(gIndex, 'top')"
          @dragover.prevent="onDragOverZone(gIndex, 'top')"
          @drop.prevent="onDropZone(gIndex, 'top')"
      />

      <div
          class="form-grid__group"
          :style="{ gridTemplateColumns: `repeat(${group.length}, 1fr)` }"
      >
        <UiField
            v-for="(field, fIndex) in group"
            :key="field.id"
            :field="field"
            @dragstart="onDragStart(field, gIndex)"
            @dragend="onDragEnd"
            @dragover.prevent="onDragOverField(gIndex, fIndex, $event)"
            @drop.prevent="onDropOnField(gIndex, fIndex)"
        />
      </div>
    </template>

    <DropZone
        position="bottom"
        :groupIndex="groups.length"
        :active="getZoneClass(groups.length, 'bottom')"
        @dragover.prevent="onDragOverZone(groups.length, 'bottom')"
        @drop.prevent="onDropZone(groups.length, 'bottom')"
    />
  </div>
</template>

<script setup lang="ts">
import { defineProps } from 'vue'
import { useGroupManager } from './model/useGroupManager'
import { UiField } from '@/shared/ui/ui-field'
import { DropZone } from '@/shared/ui/drop-zone'
import type { Field } from '@/entities/field/model/field'

const props = defineProps<{
  initial: Field[][]
}>()

const {
  groups,
  onDragStart,
  onDragOverField,
  onDropOnField,
  onDragOverZone,
  onDropZone,
  getZoneClass,
  onDragEnd
} = useGroupManager(props.initial)
</script>

<style lang="scss" scoped>
.form-grid {
  display: flex;
  flex-direction: column;
  padding: 15px 10px 10px;
  background: #3C3F4F;
  border-radius: 3px;

  &__group {
    display: grid;
    gap: 12px;
  }
}
</style>