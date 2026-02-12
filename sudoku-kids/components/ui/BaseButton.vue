<template>
  <button
    :class="[
      'font-semibold transition-all active:scale-95 disabled:cursor-not-allowed disabled:opacity-50',
      sizeClasses[size],
      variantClasses[variant]
    ]"
    :disabled="disabled"
    @click="$emit('click')"
  >
    <slot />
  </button>
</template>

<script setup lang="ts">
type ButtonSize = 'sm' | 'md' | 'lg';
type ButtonVariant = 'primary' | 'secondary';

interface Props {
  size?: ButtonSize;
  variant?: ButtonVariant;
  disabled?: boolean;
}

withDefaults(defineProps<Props>(), {
  size: 'md',
  variant: 'primary',
  disabled: false
});

defineEmits<{
  click: [];
}>();

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'min-h-10 min-w-10 rounded-md px-4 py-2 text-base',
  md: 'min-h-12 min-w-12 rounded-lg px-6 py-3 text-lg',
  lg: 'min-h-14 min-w-14 rounded-xl px-8 py-4 text-xl'
};

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    'bg-primary-500 text-white shadow-md hover:bg-primary-600 hover:shadow-lg',
  secondary:
    'border-2 border-primary-500 bg-white text-primary-500 hover:bg-primary-50'
};
</script>
