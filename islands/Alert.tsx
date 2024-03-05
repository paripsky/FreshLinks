import { useSignal } from "@preact/signals";
import { ComponentChildren } from "preact";
import IconX from "tabler_icons_tsx/tsx/x.tsx";

type AlertProps = {
  children: ComponentChildren;
  defaultOpen?: boolean;
  urlParamToRemove?: string;
};

export function Alert(
  { children, defaultOpen = false, urlParamToRemove }: AlertProps,
) {
  const open = useSignal(defaultOpen);

  const onClearAlert = () => {
    if (urlParamToRemove) {
      const url = new URL(window.location.href);
      url.searchParams.delete(urlParamToRemove);
      history.replaceState({}, "", url);
    }

    open.value = false;
  };

  if (!open.value) return null;

  return (
    <div
      class="flex flex-wrap gap-1 items-center p-4 mb-4 text-sm text-green-800 rounded-lg bg-green-50 dark:bg-gray-800 dark:text-green-400"
      role="alert"
    >
      {children}
      <button
        class="ml-auto bg-green-100 text-gray-500 hover:text-gray-900 rounded-lg focus:ring-2 focus:ring-gray-300 p-1.5 hover:bg-green-200"
        onClick={onClearAlert}
      >
        <IconX size={16} />
      </button>
    </div>
  );
}
