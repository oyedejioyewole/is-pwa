<script lang="ts" setup>
import type { NotivueItem } from "notivue";
import type z from "zod";

const dialogState = useDialog();

defineProps<{
  item: NotivueItem<EventStreamNotificationProps>;
}>();

export type EventStreamNotificationProps =
  | {
      detailType: "details";
      payload: { manifestHref: string; manifestBlob: Record<string, unknown> };
    }
  | {
      detailType: "issues";
      payload: {
        errorTree: ReturnType<typeof z.treeifyError>;
        manifestHref: string;
        rawManifest: Record<string, unknown>;
      };
    };

const openDialog = (props: EventStreamNotificationProps) => {
  dialogState.value = { ...dialogState.value, ...props };
  dialogState.value.element!.showModal();
};
</script>

<template>
  <div
    class="bg-background border-muted max-w-2xs space-y-4 rounded-lg border p-4 transition"
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

    <div class="flex gap-x-2" v-if="$props.item.type !== 'error'">
      <UiButton variant="outline" @click="openDialog($props.item.props)">
        <UiIcon name="scroll" size="18" weight="duotone" />
        View {{ $props.item.props.detailType }}
      </UiButton>

      <UiButton @click="$props.item.clear">
        <UiIcon name="x" />
        Close
      </UiButton>
    </div>
  </div>
</template>
