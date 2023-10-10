import { ReactNode } from "react";

export type NotificationState = "info" | "success" | "warn" | "danger";

export type ToastNotification = {
  ts: number;
  title: ReactNode;
  description: ReactNode;
  state?: NotificationState;
};
