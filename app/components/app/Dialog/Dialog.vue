<script lang="ts" setup>
import JSONPretty from "vue-json-pretty";
import "vue-json-pretty/lib/styles.css";

const dialogRef = useTemplateRef("dialog");
const dialogState = useDialog();

watchOnce(dialogRef, () => {
  if (!dialogRef.value) return;

  dialogState.value.element = dialogRef.value;
});

useEventListener(dialogRef, "close", () => {
  delete dialogState.value.payload;
  delete dialogState.value.detailType;
});
</script>

<template>
  <dialog
    ref="dialog"
    class="bg-background border-muted m-auto size-9/10 space-y-4 rounded-lg border p-4 text-inherit"
  >
    <template v-if="dialogState.detailType && dialogState.payload">
      <UiItem>
        <UiItemActions>
          <UiButton
            size="icon"
            variant="outline"
            @click="dialogState.element!.close()"
          >
            <UiIcon name="caret-left" />
          </UiButton>
        </UiItemActions>

        <UiItemTitle><b>Navigate back</b></UiItemTitle>
      </UiItem>

      <AppDialogManifestJsonViewer
        v-if="dialogState.detailType === 'details'"
        :manifest-href="dialogState.payload.manifestHref"
        :manifest-blob="dialogState.payload.manifestBlob"
      />

      <template v-else-if="dialogState.detailType === 'issues'">
        <h2 class="text-sm">
          The following issues were found while validating how valid the
          webmanifest was.
        </h2>

        <JSONPretty
          :data="dialogState.payload.errorTree"
          showLineNumber
          showIcon
          :showDoubleQuotes="false"
          :theme="$colorMode.value as 'light' | 'dark'"
        />

        <UiSeparator />

        <UiAccordion collapsible type="single">
          <UiAccordionItem value="error-tree">
            <UiAccordionTrigger
              ><b class="">View webmanifest source</b></UiAccordionTrigger
            >
            <UiAccordionContent class="space-y-4">
              <AppDialogManifestJsonViewer
                :manifest-href="dialogState.payload.manifestHref"
                :manifest-blob="dialogState.payload.rawManifest"
              />
            </UiAccordionContent>
          </UiAccordionItem>
        </UiAccordion>
      </template>
    </template>
  </dialog>
</template>
