<script lang="ts" setup>
import type { NotivueItem } from "notivue";
export interface EventStreamNotificationProps {
  detailType: "metadata" | "issues";
}

defineProps<{ item: NotivueItem<EventStreamNotificationProps> }>();
</script>

<template>
  <div
    class="max-w-2xs rounded-lg border bg-orange-100 p-4 shadow-lg transition has-[.notification-button]:space-y-4 dark:bg-orange-900"
  >
    <div class="space-y-1">
      <p
        :role="$props.item.ariaRole"
        :aria-live="$props.item.ariaLive"
        aria-atomic="true"
        class="inline-flex items-center gap-x-2 font-bold"
      >
        <UiIcon
          :name="{
            'seal-check': $props.item.type === 'success',
            'seal-warning': $props.item.type === 'error',
            warning: $props.item.type === 'warning',
          }"
          size="20"
          weight="duotone"
        />
        {{ $props.item.title }}
      </p>

      <p>{{ $props.item.message }}</p>
    </div>

    <div class="flex gap-x-4" v-if="$props.item.type !== 'error'">
      <button @click="console.log" type="button" class="notification-button">
        <UiIcon name="scroll" size="18" weight="duotone" />
        View {{ $props.item.props.detailType }}
      </button>

      <button
        @click="$props.item.clear"
        type="button"
        class="notification-button"
      >
        <UiIcon name="x" />
        Close
      </button>
    </div>
  </div>
</template>
