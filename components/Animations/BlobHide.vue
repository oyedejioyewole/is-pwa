<script setup lang="ts">
import { gsap } from "gsap";
</script>

<template>
  <div
    @mouseenter="gsap.to('#cursor-fx', { opacity: 0, scale: 0 })"
    @mouseleave="gsap.to('#cursor-fx', { opacity: 1, scale: 1 })"
  >
    <slot />
  </div>
</template>
