import IconSun from "tabler_icons_tsx/tsx/sun.tsx";
import IconMoon from "tabler_icons_tsx/tsx/moon.tsx";
import { useSignal } from "@preact/signals";
import { setCookie } from "../utils/cookie.ts";

export function ThemeToggle({ isDarkTheme }: { isDarkTheme: boolean }) {
  const isDarkMode = useSignal(isDarkTheme);

  const onToggleTheme = () => {
    isDarkMode.value = !isDarkMode.value;
    const oldTheme = isDarkMode.value ? "light" : "dark";
    const newTheme = isDarkMode.value ? "dark" : "light";

    const html = document.querySelector("html");
    if (!html) return;

    html.classList.remove(oldTheme);
    html.classList.add(newTheme);
    html.style.colorScheme = newTheme;
    setCookie("theme", newTheme);
  };

  return (
    <button class="flex p-2" onClick={onToggleTheme}>
      {isDarkMode.value ? <IconSun size={16} /> : <IconMoon size={16} />}
    </button>
  );
}
