<script setup lang="ts">
import { animate } from "animejs";

const cursorRef = useTemplateRef<HTMLDivElement>("cursorRef");
const paused = shallowRef(false);

const { x, y, sourceType } = useMouse();
watch([x, y, sourceType, paused], ([newX, newY, newSourceType, isPaused]) => {
  if (!cursorRef.value || isPaused || newSourceType === "touch") return;

  animate(cursorRef.value, {
    x: newX,
    y: newY,
    duration: 200,
  });
});

onMounted(() => {
  const nodesToHide = document.querySelectorAll(".hide-cursor");

  for (const node of nodesToHide) {
    useEventListener(node, ["mouseenter", "mouseleave"], (event) => {
      if (!cursorRef.value) return;

      paused.value = event.type === "mouseenter";

      animate(cursorRef.value, {
        scale: event.type === "mouseenter" ? 0 : 1,
        opacity: event.type === "mouseenter" ? 0 : 1,
        duration: 300,
      });
    });
  }
});
</script>

<template>
  <div
    class="fixed -inset-x-5 -inset-y-5 -z-10 aspect-square h-10 rounded-full border border-orange-900 dark:border-orange-100"
    ref="cursorRef"
  />
</template>
