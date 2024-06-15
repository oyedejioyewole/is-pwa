<script setup lang="ts">
import { gsap } from "gsap";

const { x, y } = useMouse({ touch: false });

watch([x, y], ([newX, newY]) =>
  gsap.to("#cursor-fx", {
    x: newX - 20,
    y: newY - 20,
  }),
);

watchOnce([x, y], () => {
  gsap.set("#cursor-fx", { scale: 1 });
});
</script>

<template>
  <div
    class="absolute -z-10 aspect-square h-10 scale-0 rounded-full border border-orange-900 dark:border-orange-100"
    id="cursor-fx"
  />
</template>
