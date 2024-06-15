<script setup lang="ts">
import { z } from "zod";

const url = ref<string>("");

const handleSubmit = async () => {
  const urlSchema = z.union([
    z.string().url().startsWith("https://"),
    z.string().url().startsWith("http://"),
  ]);

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

    if (response)
      response.isFound
        ? notification.resolve("URL is a web app")
        : notification.reject("URL isn't a web app");
    else notification.reject("URL isn't reachable");
  } else {
    results.error.issues.forEach(({ message }) =>
      push.error({ message, title: "Validation issue" }),
    );
  }

  url.value = "";
};
</script>

<template>
  <main class="m-auto">
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
