<script setup lang="ts">
interface Option {
  value: string | number
  label: string
}

interface Props {
  modelValue: string | number
  options: Option[]
  placeholder?: string
  disabled?: boolean
  size?: 'sm' | 'md' | 'lg'
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: '请选择',
  disabled: false,
  size: 'md',
})

const emit = defineEmits<{
  'update:modelValue': [value: string | number]
}>()

const sizeClasses = {
  sm: 'px-3 py-1.5 text-sm min-h-9',
  md: 'px-4 py-2 text-base min-h-11',
  lg: 'px-5 py-3 text-lg min-h-14',
}

function handleChange(event: Event) {
  const target = event.target as HTMLSelectElement
  const option = props.options.find(o => String(o.value) === target.value)
  if (option) {
    // Preserve the original type (number or string)
    const value = typeof option.value === 'number' ? Number(target.value) : target.value
    emit('update:modelValue', value)
  }
}
</script>

<template>
  <select
    :value="modelValue"
    :disabled="disabled"
    :class="[
      'w-full rounded-lg border border-gray-300 bg-white',
      'focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500',
      'disabled:opacity-50 disabled:cursor-not-allowed',
      'appearance-none cursor-pointer',
      sizeClasses[size],
    ]"
    @change="handleChange"
  >
    <option v-if="placeholder" value="" disabled>
      {{ placeholder }}
    </option>
    <option
      v-for="option in options"
      :key="option.value"
      :value="option.value"
    >
      {{ option.label }}
    </option>
  </select>
</template>

<style scoped>
select {
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e");
  background-position: right 0.5rem center;
  background-repeat: no-repeat;
  background-size: 1.5em 1.5em;
  padding-right: 2.5rem;
}
</style>
