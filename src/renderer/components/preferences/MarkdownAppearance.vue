<script setup lang="ts">
import type {
  MarkdownAppearancePreset,
  MarkdownAppearanceValues,
} from '~/shared/markdownAppearance'
import { Button } from '@/components/ui/shadcn/button'
import * as Select from '@/components/ui/shadcn/select'
import { useNotesEditor, useTheme } from '@/composables'
import {
  createCustomMarkdownAppearanceSeed,
  resolveMarkdownAppearance,
} from '~/shared/markdownAppearance'
import MarkdownColorField from './MarkdownColorField.vue'

const { settings } = useNotesEditor()
const { isDark } = useTheme()

const presetOptions: Array<{ value: MarkdownAppearancePreset, label: string }> = [
  { value: 'akash', label: 'Akash Default' },
  { value: 'github', label: 'GitHub' },
  { value: 'minimal', label: 'Minimal' },
  { value: 'nord', label: 'Nord' },
  { value: 'custom', label: 'Custom' },
]

const headingRows = [
  { label: 'H1', color: 'h1Color', size: 'h1Size', weight: 'h1Weight' },
  { label: 'H2', color: 'h2Color', size: 'h2Size', weight: 'h2Weight' },
  { label: 'H3', color: 'h3Color', size: 'h3Size', weight: 'h3Weight' },
  { label: 'H4', color: 'h4Color', size: 'h4Size', weight: 'h4Weight' },
  { label: 'H5', color: 'h5Color', size: 'h5Size', weight: 'h5Weight' },
  { label: 'H6', color: 'h6Color', size: 'h6Size', weight: 'h6Weight' },
] as const

const preview = computed(() =>
  resolveMarkdownAppearance(settings.markdownAppearance, isDark.value),
)

const previewStyle = computed(() => {
  const value = preview.value
  return {
    color: value.textColor,
    background: isDark.value ? '#111318' : '#ffffff',
    borderColor: isDark.value ? '#30363d' : '#d0d7de',
  }
})

function resetCustom() {
  settings.markdownAppearance.custom
    = createCustomMarkdownAppearanceSeed(isDark.value)
}

function clampCustomNumbers() {
  const custom = settings.markdownAppearance.custom
  const sizes = [
    'h1Size',
    'h2Size',
    'h3Size',
    'h4Size',
    'h5Size',
    'h6Size',
  ] as const
  const weights = [
    'h1Weight',
    'h2Weight',
    'h3Weight',
    'h4Weight',
    'h5Weight',
    'h6Weight',
  ] as const

  for (const key of sizes)
    custom[key] = Math.min(4, Math.max(0.5, Number(custom[key]) || 1))

  for (const key of weights) {
    custom[key] = Math.min(
      900,
      Math.max(100, Math.round((Number(custom[key]) || 600) / 50) * 50),
    )
  }

  custom.inlineCodeRadius = Math.min(
    30,
    Math.max(0, Number(custom.inlineCodeRadius) || 0),
  )
  custom.codeBlockRadius = Math.min(
    30,
    Math.max(0, Number(custom.codeBlockRadius) || 0),
  )
  custom.quoteBorderWidth = Math.min(
    12,
    Math.max(0, Number(custom.quoteBorderWidth) || 0),
  )
}

watch(
  () => settings.markdownAppearance.custom,
  clampCustomNumbers,
  { deep: true },
)
</script>

<template>
  <UiMenuFormSection label="Markdown appearance">
    <UiMenuFormItem label="Theme preset">
      <Select.Select v-model="settings.markdownAppearance.preset">
        <Select.SelectTrigger class="w-64">
          <Select.SelectValue />
        </Select.SelectTrigger>
        <Select.SelectContent>
          <Select.SelectItem
            v-for="option in presetOptions"
            :key="option.value"
            :value="option.value"
          >
            {{ option.label }}
          </Select.SelectItem>
        </Select.SelectContent>
      </Select.Select>
      <template #description>
        Choose a complete Markdown style. Select Custom to edit individual elements.
      </template>
    </UiMenuFormItem>

    <div
      class="rounded-lg border p-4"
      :style="previewStyle"
    >
      <div
        class="text-2xl font-bold"
        :style="{ color: preview.h1Color }"
      >
        Markdown preview
      </div>
      <div
        class="mt-2"
        :style="{ color: preview.textColor }"
      >
        Normal text with
        <strong :style="{ color: preview.strongColor }">bold</strong>,
        <em :style="{ color: preview.emphasisColor }">italic</em>,
        <span
          class="underline"
          :style="{ color: preview.linkColor }"
        >a link</span>
        and
        <code
          class="px-1.5 py-0.5"
          :style="{
            color: preview.inlineCodeTextColor,
            background: preview.inlineCodeBackground,
            border: `1px solid ${preview.inlineCodeBorderColor}`,
            borderRadius: `${preview.inlineCodeRadius}px`,
          }"
        >inline code</code>.
      </div>
      <div
        class="mt-3 px-3 py-2 font-mono text-xs"
        :style="{
          color: preview.codeBlockTextColor,
          background: preview.codeBlockBackground,
          border: `1px solid ${preview.codeBlockBorderColor}`,
          borderRadius: `${preview.codeBlockRadius}px`,
        }"
      >
        const fast = true
      </div>
      <div
        class="mt-3 px-3 py-2"
        :style="{
          color: preview.quoteTextColor,
          background: preview.quoteBackground,
          borderLeft: `${preview.quoteBorderWidth}px solid ${preview.quoteBorderColor}`,
        }"
      >
        A blockquote using the selected Markdown style.
      </div>
      <span
        class="mt-3 inline-block rounded px-1"
        :style="{
          color: preview.highlightTextColor,
          background: preview.highlightBackground,
        }"
      >
        highlighted text
      </span>
    </div>

    <template v-if="settings.markdownAppearance.preset === 'custom'">
      <div class="pt-2 text-sm font-semibold">
        Text
      </div>
      <MarkdownColorField
        v-model="settings.markdownAppearance.custom.textColor"
        label="Body text"
      />
      <MarkdownColorField
        v-model="settings.markdownAppearance.custom.strongColor"
        label="Bold text"
      />
      <MarkdownColorField
        v-model="settings.markdownAppearance.custom.emphasisColor"
        label="Italic text"
      />
      <MarkdownColorField
        v-model="settings.markdownAppearance.custom.strikeColor"
        label="Strikethrough"
      />
      <MarkdownColorField
        v-model="settings.markdownAppearance.custom.linkColor"
        label="Links"
      />

      <div class="pt-2 text-sm font-semibold">
        Headings
      </div>
      <UiMenuFormItem
        v-for="heading in headingRows"
        :key="heading.label"
        :label="heading.label"
      >
        <div class="flex items-center gap-2">
          <input
            v-model="settings.markdownAppearance.custom[heading.color]"
            type="color"
            class="h-8 w-10 cursor-pointer rounded border border-border bg-transparent p-0.5"
          >
          <UiInput
            v-model="settings.markdownAppearance.custom[heading.size]"
            type="number"
            min="0.5"
            max="4"
            step="0.05"
            size="sm"
            class="w-24"
          />
          <UiInput
            v-model="settings.markdownAppearance.custom[heading.weight]"
            type="number"
            min="100"
            max="900"
            step="50"
            size="sm"
            class="w-24"
          />
        </div>
        <template #description>
          Color · size in em · font weight
        </template>
      </UiMenuFormItem>

      <div class="pt-2 text-sm font-semibold">
        Inline code
      </div>
      <MarkdownColorField
        v-model="settings.markdownAppearance.custom.inlineCodeTextColor"
        label="Inline code text"
      />
      <MarkdownColorField
        v-model="settings.markdownAppearance.custom.inlineCodeBackground"
        label="Inline code background"
      />
      <MarkdownColorField
        v-model="settings.markdownAppearance.custom.inlineCodeBorderColor"
        label="Inline code border"
      />
      <UiMenuFormItem label="Inline code radius">
        <UiInput
          v-model="settings.markdownAppearance.custom.inlineCodeRadius"
          type="number"
          min="0"
          max="30"
          size="sm"
          class="w-24"
        />
      </UiMenuFormItem>

      <div class="pt-2 text-sm font-semibold">
        Code blocks
      </div>
      <MarkdownColorField
        v-model="settings.markdownAppearance.custom.codeBlockTextColor"
        label="Code block text"
      />
      <MarkdownColorField
        v-model="settings.markdownAppearance.custom.codeBlockBackground"
        label="Code block background"
      />
      <MarkdownColorField
        v-model="settings.markdownAppearance.custom.codeBlockBorderColor"
        label="Code block border"
      />
      <UiMenuFormItem label="Code block radius">
        <UiInput
          v-model="settings.markdownAppearance.custom.codeBlockRadius"
          type="number"
          min="0"
          max="30"
          size="sm"
          class="w-24"
        />
      </UiMenuFormItem>

      <div class="pt-2 text-sm font-semibold">
        Quote & highlight
      </div>
      <MarkdownColorField
        v-model="settings.markdownAppearance.custom.quoteTextColor"
        label="Blockquote text"
      />
      <MarkdownColorField
        v-model="settings.markdownAppearance.custom.quoteBackground"
        label="Blockquote background"
      />
      <MarkdownColorField
        v-model="settings.markdownAppearance.custom.quoteBorderColor"
        label="Blockquote border"
      />
      <UiMenuFormItem label="Blockquote border width">
        <UiInput
          v-model="settings.markdownAppearance.custom.quoteBorderWidth"
          type="number"
          min="0"
          max="12"
          size="sm"
          class="w-24"
        />
      </UiMenuFormItem>
      <MarkdownColorField
        v-model="settings.markdownAppearance.custom.highlightTextColor"
        label="Highlight text"
      />
      <MarkdownColorField
        v-model="settings.markdownAppearance.custom.highlightBackground"
        label="Highlight background"
      />

      <div class="pt-2 text-sm font-semibold">
        Other elements
      </div>
      <MarkdownColorField
        v-model="settings.markdownAppearance.custom.listMarkerColor"
        label="List markers"
      />
      <MarkdownColorField
        v-model="settings.markdownAppearance.custom.ruleColor"
        label="Horizontal rules"
      />
      <MarkdownColorField
        v-model="settings.markdownAppearance.custom.checkboxColor"
        label="Checkbox accent"
      />

      <UiMenuFormItem label="Reset custom style">
        <Button
          variant="outline"
          @click="resetCustom"
        >
          Reset custom values
        </Button>
        <template #description>
          Reset Custom to a readable light/dark starting point.
        </template>
      </UiMenuFormItem>
    </template>
  </UiMenuFormSection>
</template>
