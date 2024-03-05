import { ThemeToggle } from "../islands/ThemeToggle.tsx";
import { GitHubUser } from "../utils/github.ts";
import { UserMenu } from "./UserMenu.tsx";

export function Header(
  { isDarkTheme, user }: { isDarkTheme: boolean; user?: GitHubUser },
) {
  return (
    <header>
      <nav class="bg-white border-gray-200 px-4 sm:px-6 py-2.5 dark:bg-gray-800">
        <div class="flex flex-wrap gap-4 mx-auto max-w-3xl">
          <a href="/" class="flex gap-1 items-center">
            <img
              src="/logo.png"
              class="h-6 sm:h-9"
              alt="FreshLinks Logo"
            />
            <span class="text-lg font-semibold whitespace-nowrap dark:text-white">
              FreshLinks
            </span>
          </a>

          <ul class="order-2 sm:order-1 flex w-full sm:w-fit gap-2 font-medium sm:mt-0 items-center">
            <li>
              <a
                href="/"
                class="block text-gray-700 border-b border-gray-100 hover:bg-gray-50 sm:hover:bg-transparent sm:border-0 sm:hover:text-primary-700 sm:p-0 dark:text-gray-400 sm:dark:hover:text-white dark:hover:bg-gray-700 dark:hover:text-white sm:dark:hover:bg-transparent dark:border-gray-700"
              >
                Home
              </a>
            </li>
            <li>
              <a
                href="/analytics"
                class="block text-gray-700 border-b border-gray-100 hover:bg-gray-50 sm:hover:bg-transparent sm:border-0 sm:hover:text-primary-700 sm:p-0 dark:text-gray-400 sm:dark:hover:text-white dark:hover:bg-gray-700 dark:hover:text-white sm:dark:hover:bg-transparent dark:border-gray-700"
              >
                Analytics
              </a>
            </li>
          </ul>

          <div className="ml-auto flex gap-1 items-center order-1 sm:order-2">
            <div class="flex items-center">
              {user ? <UserMenu user={user} /> : (
                <a
                  href="/signin"
                  class="text-gray-800 dark:text-white hover:bg-gray-50 focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-4 sm:px-5 py-2 sm:py-2.5 mr-2 dark:hover:bg-gray-700 focus:outline-none dark:focus:ring-gray-400"
                >
                  Log in
                </a>
              )}
            </div>
            <ThemeToggle isDarkTheme={isDarkTheme} />
          </div>
        </div>
      </nav>
    </header>
  );
}
