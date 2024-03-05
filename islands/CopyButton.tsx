import { useSignal } from "@preact/signals";
import { useEffect } from "preact/hooks";
import IconClipboardCopy from "tabler_icons_tsx/tsx/clipboard-copy.tsx";
import IconCheck from "tabler_icons_tsx/tsx/check.tsx";

export function CopyButton({ value }: { value: string }) {
  const clicked = useSignal(false);

  useEffect(() => {
    let timeout: number;
    if (clicked.value) {
      timeout = setTimeout(() => clicked.value = false, 2000);
    }

    return () => clearTimeout(timeout);
  });

  return (
    <button
      onClick={() => {
        const valueWithFullPath = value.startsWith("/")
          ? `${window.location.origin}${value}`
          : value;

        navigator.clipboard.writeText(valueWithFullPath);
        clicked.value = true;
      }}
      class={clicked.value ? "text-green-400" : ""}
    >
      {!clicked.value
        ? <IconClipboardCopy size={16} />
        : <IconCheck size={16} />}
    </button>
  );
}
