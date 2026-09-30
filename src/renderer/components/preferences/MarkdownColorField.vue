<script setup lang="ts">
interface Props {
  label: string
  description?: string
}

defineProps<Props>()
const model = defineModel<string>({ required: true })
</script>

<template>
  <UiMenuFormItem :label="label">
    <div class="flex items-center gap-2">
      <input
        v-model="model"
        type="color"
        class="h-8 w-10 cursor-pointer rounded border border-border bg-transparent p-0.5"
      >
      <UiInput
        v-model="model"
        size="sm"
        class="w-32 font-mono"
      />
    </div>
    <template
      v-if="description"
      #description
    >
      {{ description }}
    </template>
  </UiMenuFormItem>
</template>
