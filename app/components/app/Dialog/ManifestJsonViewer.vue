<script lang="ts" setup>
import JSONPretty from "vue-json-pretty";
import "vue-json-pretty/lib/styles.css";

defineProps<{ manifestHref: string; manifestBlob: any }>();

const resolveJSONPathIntoURL = (path: string) => {
  const jsonPaths = path.split(".").slice(1);

  return jsonPaths.reduce((accumulator, currentValue, currentIndex) => {
    currentValue = currentValue.replace(/\[(\d+)\]/, "");

    if (jsonPaths.length > 1 && currentIndex === jsonPaths.length - 1)
      accumulator += `#${currentValue}`;
    else accumulator += `/${currentValue}`;

    return accumulator;
  }, "https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Manifest/Reference");
};
</script>

<template>
  <p class="text-sm">
    <b>Note:</b> Click on any key to see the MDN reference for each PWA manifest
    key
  </p>

  <UiBadge>{{ $props.manifestHref }}</UiBadge>

  <JSONPretty
    :data="$props.manifestBlob"
    showLineNumber
    showIcon
    :showDoubleQuotes="false"
    :theme="$colorMode.value as 'light' | 'dark'"
  >
    <template #renderNodeKey="{ node, defaultKey }">
      <a
        class="underline-offset-4 hover:underline"
        :href="resolveJSONPathIntoURL(node.path)"
        target="_blank"
        >{{ defaultKey }}</a
      >
    </template>
  </JSONPretty>
</template>
