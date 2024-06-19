<script setup lang="ts">
import { z } from "zod";

const url = ref<string>("");

const handleSubmit = async () => {
  const urlSchema = z.string().url().startsWith("https://");

  const results = urlSchema.safeParse(url.value);

  if (results.success) {
    const notification = push.promise({
      title: "Analysing",
      message: "Please wait :-P",
    });

    const response = await $fetch("/api/proxy", {
      body: { url: results.data },
      method: "POST",
      onRequestError: () => {
        notification.reject("Check your internet connection");
      },
    });

    if (response) {
      if (response.isFound && response.isValid)
        notification.resolve("URL is installable");
      else if (response.isFound && !response.isValid)
        notification.resolve("URL is partially installable");
      else notification.reject("URL isn't installable");
    } else notification.reject("URL doesn't exist");
  } else {
    results.error.issues.forEach(({ message }) => push.error(message));
  }

  url.value = "";
};
</script>

<template>
  <main class="mx-auto self-center">
    <form
      class="flex flex-col items-center gap-4 md:flex-row"
      @submit.prevent="handleSubmit"
    >
      <AnimationsBlobHide class="contents">
        <input
          class="rounded-full border border-orange-900 bg-transparent py-4 pl-4 outline-none ring-orange-900 hover:ring focus:ring dark:border-orange-100 dark:ring-orange-100"
          name="url"
          required
          type="url"
          v-model="url"
        />
      </AnimationsBlobHide>

      <AnimationsBlobHide class="contents">
        <button
          class="w-full rounded-full border border-orange-900 bg-transparent py-4 outline-none ring-orange-900 hover:ring focus:ring dark:border-orange-100 dark:ring-orange-100 md:w-20"
          type="submit"
        >
          <PhosphorIconMagnifyingGlass
            class="mx-auto fill-orange-900 dark:fill-orange-100"
            size="25"
          />
        </button>
      </AnimationsBlobHide>
    </form>
  </main>
</template>
