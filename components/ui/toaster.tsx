"use client";

import * as React from "react";

import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport
} from "@/components/ui/toast";
import { useToastState, useToastDispatch } from "@/components/ui/use-toast";

function ToastList() {
  const { toasts } = useToastState();
  const dispatch = useToastDispatch();

  return (
    <>
      {toasts.map((toast) => (
        <Toast key={toast.id} duration={3000} onOpenChange={(open) => !open && dispatch({ type: "REMOVE", id: toast.id })}>
          <div className="grid gap-1">
            <ToastTitle>{toast.title}</ToastTitle>
            {toast.description && <ToastDescription>{toast.description}</ToastDescription>}
          </div>
          <ToastClose />
        </Toast>
      ))}
    </>
  );
}

export function Toaster() {
  return (
    <ToastProvider>
      <ToastList />
      <ToastViewport />
    </ToastProvider>
  );
}
