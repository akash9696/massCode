<script setup lang="ts">
import type { NoteFragment } from './noteFragments'
import * as ContextMenu from '@/components/ui/shadcn/context-menu'
import * as Tabs from '@/components/ui/shadcn/tabs'
import { useDialog } from '@/composables'
import { i18n } from '@/electron'
import { Plus } from 'lucide-vue-next'
import Draggable from 'vuedraggable'

interface Props {
  fragments: NoteFragment[]
  activeId: string
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  disabled: false,
})

const emit = defineEmits<{
  add: []
  delete: [id: string]
  rename: [id: string, label: string]
  reorder: [ids: string[]]
  select: [id: string]
}>()

const { confirm } = useDialog()
const editingId = ref<string>()
const editingLabel = ref('')

function select(id: string) {
  if (!props.disabled && editingId.value === undefined)
    emit('select', id)
}

function startRename(fragment: NoteFragment) {
  if (props.disabled)
    return
  editingId.value = fragment.id
  editingLabel.value = fragment.label
}

function finishRename(fragment: NoteFragment) {
  if (editingId.value !== fragment.id)
    return

  const label = editingLabel.value.trim()
  editingId.value = undefined

  if (label && label !== fragment.label)
    emit('rename', fragment.id, label)
}

async function remove(fragment: NoteFragment) {
  if (props.disabled || props.fragments.length <= 1)
    return

  const isConfirmed = await confirm({
    title: i18n.t('messages:confirm.deletePermanently', {
      name: fragment.label,
    }),
    content: i18n.t('messages:warning.noUndo'),
  })

  if (isConfirmed)
    emit('delete', fragment.id)
}

function onDragEnd(event: { oldIndex?: number, newIndex?: number }) {
  if (
    props.disabled
    || event.oldIndex === undefined
    || event.newIndex === undefined
    || event.oldIndex === event.newIndex
  ) {
    return
  }

  const ids = props.fragments.map(fragment => fragment.id)
  const [moved] = ids.splice(event.oldIndex, 1)
  ids.splice(event.newIndex, 0, moved)
  emit('reorder', ids)
}
</script>

<template>
  <Tabs.Tabs
    :model-value="activeId"
    activation-mode="manual"
    class="border-border max-w-full min-w-0 border-b px-2 py-1"
  >
    <div class="flex w-full min-w-0 items-center gap-1">
      <Tabs.TabsList as-child class="w-full min-w-0 justify-start overflow-x-auto">
        <Draggable
          :model-value="fragments"
          item-key="id"
          direction="horizontal"
          :disabled="disabled || fragments.length < 2"
          :force-fallback="true"
          :fallback-on-body="true"
          :fallback-tolerance="4"
          ghost-class="fragment-placeholder"
          fallback-class="fragment-drag-preview"
          filter="input, textarea, [contenteditable]"
          :prevent-on-filter="false"
          @end="onDragEnd"
        >
          <template #item="{ element: fragment }">
            <Tabs.TabsTrigger
              :value="fragment.id"
              as="div"
              class="h-7 w-max max-w-50 min-w-20 cursor-default px-2"
              @click="select(fragment.id)"
              @keydown.enter.space.prevent="select(fragment.id)"
            >
              <ContextMenu.ContextMenu>
                <ContextMenu.ContextMenuTrigger class="block w-full min-w-0">
                  <UiInput
                    v-if="editingId === fragment.id"
                    v-model="editingLabel"
                    variant="ghost"
                    focus
                    select
                    class="h-5 min-w-16 rounded-none px-0 py-0 text-center text-sm font-medium"
                    @mousedown.stop
                    @click.stop
                    @keydown.stop
                    @blur="finishRename(fragment)"
                    @keydown.enter.prevent="finishRename(fragment)"
                    @keydown.esc="editingId = undefined"
                  />
                  <UiText
                    v-else
                    as="span"
                    variant="base"
                    weight="medium"
                    class="block truncate text-center leading-5 text-inherit"
                    :title="fragment.label"
                    @dblclick.stop="startRename(fragment)"
                  >
                    {{ fragment.label }}
                  </UiText>
                </ContextMenu.ContextMenuTrigger>
                <ContextMenu.ContextMenuContent>
                  <ContextMenu.ContextMenuItem @select="startRename(fragment)">
                    {{ i18n.t("action.rename") }}
                  </ContextMenu.ContextMenuItem>
                  <ContextMenu.ContextMenuSeparator />
                  <ContextMenu.ContextMenuItem
                    :disabled="fragments.length <= 1"
                    @select="remove(fragment)"
                  >
                    {{ i18n.t("action.delete.common") }}
                  </ContextMenu.ContextMenuItem>
                </ContextMenu.ContextMenuContent>
              </ContextMenu.ContextMenu>
            </Tabs.TabsTrigger>
          </template>
        </Draggable>
      </Tabs.TabsList>

      <UiActionButton
        class="size-7 shrink-0"
        :disabled="disabled"
        :tooltip="i18n.t('action.new.fragment')"
        :aria-label="i18n.t('action.new.fragment')"
        @click="emit('add')"
      >
        <Plus class="size-4" />
      </UiActionButton>
    </div>
  </Tabs.Tabs>
</template>

<style scoped>
.fragment-placeholder > * {
  opacity: 0.35;
}

.fragment-drag-preview {
  border-radius: var(--radius-md);
  background: var(--accent);
  box-shadow: 0 3px 12px rgb(0 0 0 / 0.2);
  opacity: 1 !important;
}

.fragment-drag-preview :deep(*) {
  pointer-events: none !important;
}
</style>
