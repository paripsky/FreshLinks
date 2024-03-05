import type { GitHubUser } from "../utils/github.ts";

export function UserMenu({ user }: { user: GitHubUser }) {
  return (
    <div className="relative">
      <input
        type="checkbox"
        name="userMenu"
        id="userMenu"
        class="peer absolute w-10 h-10 appearance-none pointer-events-none"
      />
      <label for="userMenu">
        <img
          id="avatarButton"
          type="button"
          class="w-10 h-10 rounded-full cursor-pointer"
          src={user.avatar_url}
          alt="User dropdown"
        />
      </label>
      <div
        id="userDropdown"
        class="peer-checked:flex flex-col z-10 hidden absolute right-0 bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700 dark:divide-gray-600"
      >
        <div class="px-4 py-3 text-sm text-gray-900 dark:text-white">
          <div>{user.name}</div>
          <div class="font-medium truncate">{user.email}</div>
        </div>
        <ul
          class="py-2 text-sm text-gray-700 dark:text-gray-200"
          aria-labelledby="avatarButton"
        >
          <li>
            <a
              href="#"
              class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
            >
              Settings
            </a>
          </li>
        </ul>
        <div class="py-1">
          <a
            href="/signout"
            class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
          >
            Sign out
          </a>
        </div>
      </div>
    </div>
  );
}
