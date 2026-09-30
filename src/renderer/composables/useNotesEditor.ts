import type { NotesEditorSettings } from '~/main/store/types'
import { store } from '@/electron'
import { MARKDOWN_APPEARANCE_DEFAULTS } from '~/shared/markdownAppearance'

const storedSettings = store.preferences.get('editor.notes') as NotesEditorSettings

if (!storedSettings.markdownAppearance) {
  storedSettings.markdownAppearance = {
    preset: MARKDOWN_APPEARANCE_DEFAULTS.preset,
    custom: { ...MARKDOWN_APPEARANCE_DEFAULTS.custom },
  }
}

const settings = reactive(storedSettings)

watch(
  settings,
  () => {
    store.preferences.set('editor.notes', JSON.parse(JSON.stringify(settings)))
  },
  { deep: true },
)

export function useNotesEditor() {
  return {
    settings,
  }
}
