import * as React from "react";

export type ToastMessage = {
  id: string;
  title: string;
  description?: string;
};

type ToastState = {
  toasts: ToastMessage[];
};

type ToastAction =
  | { type: "ADD"; toast: ToastMessage }
  | { type: "REMOVE"; id: string };

const ToastStateContext = React.createContext<ToastState | undefined>(undefined);
const ToastDispatchContext = React.createContext<React.Dispatch<ToastAction> | undefined>(undefined);

function toastReducer(state: ToastState, action: ToastAction): ToastState {
  switch (action.type) {
    case "ADD":
      return { ...state, toasts: [...state.toasts, action.toast] };
    case "REMOVE":
      return { ...state, toasts: state.toasts.filter((toast) => toast.id !== action.id) };
    default:
      return state;
  }
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = React.useReducer(toastReducer, { toasts: [] });

  return (
    <ToastStateContext.Provider value={state}>
      <ToastDispatchContext.Provider value={dispatch}>{children}</ToastDispatchContext.Provider>
    </ToastStateContext.Provider>
  );
}

export function useToastState() {
  const context = React.useContext(ToastStateContext);
  if (!context) {
    throw new Error("useToastState must be used within ToastProvider");
  }
  return context;
}

export function useToastDispatch() {
  const context = React.useContext(ToastDispatchContext);
  if (!context) {
    throw new Error("useToastDispatch must be used within ToastProvider");
  }
  return context;
}

export function useToast() {
  const dispatch = useToastDispatch();

  const pushToast = React.useCallback(
    (toast: Omit<ToastMessage, "id">) => {
      const id = crypto.randomUUID();
      dispatch({ type: "ADD", toast: { id, ...toast } });
      return id;
    },
    [dispatch]
  );

  const dismiss = React.useCallback(
    (id: string) => {
      dispatch({ type: "REMOVE", id });
    },
    [dispatch]
  );

  return { toast: pushToast, dismiss };
}
