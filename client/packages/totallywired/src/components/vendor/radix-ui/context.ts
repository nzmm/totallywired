import { createContext, useContext } from "react";
import { ToastNotification } from "./types";

type NotifyFunction = (n: Omit<ToastNotification, "ts">) => void;
export const ToastContext = createContext<NotifyFunction>(() => null);
export const useToastNotifications = () => useContext(ToastContext);
