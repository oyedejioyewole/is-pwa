import type { EventStreamNotificationProps } from "~/components/app/EventNotification.vue";

export default () => {
  return useState<
    Partial<{ element: HTMLDialogElement } & EventStreamNotificationProps>
  >("dialog", () => ({}));
};
