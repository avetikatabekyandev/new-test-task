import { ref } from 'vue'
import type { Field } from '@/entities/field/model/field'

export function useGroupManager(initial: Field[][]) {
    let wasDropped = false
    let pendingDrop: {
        from: number
        to: number
        field: Field
        index: number
        asGroup?: boolean
    } | null = null

    const isDragging = ref(false)
    const groups = ref<Field[][]>([...initial])
    const dragged = ref<Field | null>(null)
    const fromGroupIndex = ref<number | null>(null)

    const hover = ref<{
        groupIndex: number | null
        fieldIndex: number | null
        zone: 'left' | 'right' | 'top' | 'bottom' | null
    }>({
        groupIndex: null,
        fieldIndex: null,
        zone: null,
    })

    function onDragStart(field: Field, gIndex: number) {
        dragged.value = field
        fromGroupIndex.value = gIndex
        isDragging.value = true
        wasDropped = false
    }

    function onDragOverField(gIndex: number, fIndex: number, event: DragEvent) {
        const rect = (event.target as HTMLElement).getBoundingClientRect()
        const offsetX = event.clientX - rect.left
        const zone = offsetX < rect.width / 2 ? 'left' : 'right'
        hover.value = { groupIndex: gIndex, fieldIndex: fIndex, zone }
    }

    function onDragOverFieldZone(gIndex: number, fIndex: number, zone: 'left' | 'right') {
        if (!isDragging.value) return
        if (
            fromGroupIndex.value === gIndex &&
            dragged.value &&
            groups.value[gIndex]?.[fIndex]?.id === dragged.value.id
        ) return
        hover.value = { groupIndex: gIndex, fieldIndex: fIndex, zone }
    }

    function onDropFieldZone(gIndex: number, fIndex: number, zone: 'left' | 'right') {
        if (!dragged.value || fromGroupIndex.value === null) return
        if (
            fromGroupIndex.value === gIndex &&
            groups.value[gIndex]?.[fIndex]?.id === dragged.value.id
        ) return

        wasDropped = true
        const insertIndex = zone === 'left' ? fIndex : fIndex + 1

        pendingDrop = {
            from: fromGroupIndex.value,
            to: gIndex,
            field: dragged.value,
            index: insertIndex,
        }

        commitDrop()
    }

    function onDropOnField(gIndex: number, fIndex: number) {
        if (!dragged.value || fromGroupIndex.value === null || !hover.value.zone) return
        if (
            fromGroupIndex.value === gIndex &&
            groups.value[gIndex]?.[fIndex]?.id === dragged.value.id
        ) return

        wasDropped = true
        const insertIndex = hover.value.zone === 'left' ? fIndex : fIndex + 1

        pendingDrop = {
            from: fromGroupIndex.value,
            to: gIndex,
            field: dragged.value,
            index: insertIndex,
        }

        commitDrop()
    }

    function onDragOverZone(gIndex: number, zone: 'top' | 'bottom') {
        if (!isDragging.value) return
        hover.value = { groupIndex: gIndex, fieldIndex: null, zone }
    }

    function onDropZone(gIndex: number, zone: 'top' | 'bottom') {
        if (!dragged.value || fromGroupIndex.value === null) return

        wasDropped = true
        pendingDrop = {
            from: fromGroupIndex.value,
            to: zone === 'top' ? gIndex : gIndex + 1,
            field: dragged.value,
            index: 0,
            asGroup: true,
        }

        commitDrop()
    }

    function commitDrop() {
        if (!pendingDrop) return

        const { from, field, index, asGroup } = pendingDrop
        let { to } = pendingDrop

        const source = groups.value[from]
        if (!source) {
            clear()
            return
        }

        const fromIdx = source.findIndex(f => f.id === field.id)
        if (fromIdx !== -1) source.splice(fromIdx, 1)
        if (source.length === 0) groups.value.splice(from, 1)

        if (from < to) to -= 1

        const safeTo = Math.min(to, groups.value.length)

        if (asGroup) {
            groups.value.splice(safeTo, 0, [field])
        } else {
            const target = groups.value[safeTo]
            if (!target) {
                groups.value.splice(safeTo, 0, [field])
            } else {
                target.splice(index, 0, field)
            }
        }

        pendingDrop = null
        clear()
    }

    function getZoneClass(
        groupIndex: number,
        fieldIndex: number | null,
        zone: 'left' | 'right' | 'top' | 'bottom'
    ) {
        if (!isDragging.value || hover.value.zone !== zone) return false
        if (
            fromGroupIndex.value === groupIndex &&
            dragged.value &&
            fieldIndex !== null &&
            groups.value[groupIndex]?.[fieldIndex]?.id === dragged.value.id
        ) return false

        return (
            hover.value.groupIndex === groupIndex &&
            hover.value.fieldIndex === fieldIndex &&
            hover.value.zone === zone
        )
    }

    function clear() {
        if (!wasDropped && dragged.value && fromGroupIndex.value !== null) {
            const group = groups.value[fromGroupIndex.value]
            const alreadyInGroup = group?.some(f => f.id === dragged.value?.id)
            if (!alreadyInGroup) {
                if (group) {
                    group.push(dragged.value as Field)
                } else {
                    groups.value.splice(fromGroupIndex.value, 0, [dragged.value as Field])
                }
            }
        }

        dragged.value = null
        fromGroupIndex.value = null
        hover.value = { groupIndex: null, fieldIndex: null, zone: null }
        isDragging.value = false
        wasDropped = false
        pendingDrop = null
    }

    function onDragEnd() {
        clear()
    }

    return {
        groups,
        onDragStart,
        onDragOverField,
        onDropOnField,
        onDragOverFieldZone,
        onDropFieldZone,
        onDragOverZone,
        onDropZone,
        getZoneClass,
        onDragEnd,
        isDragging,
    }
}