import { PropsWithChildren, ReactNode, useCallback, useState } from "react";
import * as RToast from "@radix-ui/react-toast";
import { NotificationState, ToastNotification } from "./types";
import { ToastContext } from "./context";
import "./Toast.css";

export const ToastViewport = () => (
  <RToast.Viewport className="ToastViewport" />
);

type ToastProps = {
  title: ReactNode;
  description: ReactNode;
  state?: NotificationState;
};

const Toast = ({ title, description, state = "info" }: ToastProps) => (
  <RToast.Root className={`ToastRoot ${state}`}>
    <RToast.Title className="ToastTitle">{title}</RToast.Title>
    <RToast.Description className="ToastDescription">
      {description}
    </RToast.Description>
  </RToast.Root>
);

type ToastProviderProps = PropsWithChildren & { maxNotificationCount?: number };

export const ToastProvider = ({
  children,
  maxNotificationCount = 3,
}: ToastProviderProps) => {
  const [notifications, setNotifications] = useState<ToastNotification[]>([]);

  const notify = useCallback(
    (n: Omit<ToastNotification, "ts">) => {
      return setNotifications((toasts) => {
        return toasts.slice(-(maxNotificationCount - 1)).concat({
          ts: Date.now(),
          ...n,
        });
      });
    },
    [maxNotificationCount, setNotifications],
  );

  return (
    <RToast.Provider>
      <ToastContext.Provider value={notify}>{children}</ToastContext.Provider>

      {notifications.map((t) => (
        <Toast key={t.ts} title={t.title} description={t.description} />
      ))}
    </RToast.Provider>
  );
};
