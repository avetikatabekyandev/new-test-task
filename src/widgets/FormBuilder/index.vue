<template>
  <div class="form-grid">
    <template v-for="(group, gIndex) in groups" :key="gIndex">
      <DropZone
          position="top"
          :groupIndex="gIndex"
          :active="getZoneClass(gIndex, null, 'top')"
          @dragover.prevent="onDragOverZone(gIndex, 'top')"
          @drop.prevent="onDropZone(gIndex, 'top')"
      />

      <div
          class="form-grid__group"
      >
        <template v-for="(field, fIndex) in group" :key="field.id">
          <DropZone
              position="left"
              :groupIndex="gIndex"
              :fieldIndex="fIndex"
              :active="getZoneClass(gIndex, fIndex, 'left')"
              @dragover.prevent="onDragOverFieldZone(gIndex, fIndex, 'left')"
              @drop.prevent="onDropFieldZone(gIndex, fIndex, 'left')"
          />

          <UiField
              :field="field"
              @dragstart="onDragStart(field, gIndex)"
              @dragend="onDragEnd"
              @dragover.prevent="onDragOverField(gIndex, fIndex, $event)"
              @drop.prevent="onDropOnField(gIndex, fIndex)"
          />

          <DropZone
              position="right"
              :groupIndex="gIndex"
              :fieldIndex="fIndex"
              :active="getZoneClass(gIndex, fIndex, 'right')"
              @dragover.prevent="onDragOverFieldZone(gIndex, fIndex, 'right')"
              @drop.prevent="onDropFieldZone(gIndex, fIndex, 'right')"
          />
        </template>
      </div>
    </template>

    <DropZone
        position="bottom"
        :groupIndex="groups.length"
        :active="getZoneClass(groups.length, null, 'bottom')"
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
  onDragOverFieldZone,
  onDropFieldZone,
  getZoneClass,
  onDragEnd
} = useGroupManager(props.initial)
</script>

<style scoped lang="scss">
.form-grid {
  display: flex;
  flex-direction: column;
  padding: 15px 10px 10px;
  background: #3C3F4F;
  border-radius: 3px;

  &__group {
    display: flex;
    gap: 12px;
  }
}
</style>