import React from "react";

function AdminNav() {
  return (
    <nav className="fixed top-0 z-30 w-full border-b border-gray-200 bg-white p-0 dark:border-gray-700 dark:bg-gray-800 sm:p-0">
      <div className="mx-auto flex flex-wrap items-center justify-between">
        <div className="w-full p-3 pr-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              {/* <button className="mr-3 cursor-pointer rounded p-2 text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">
                <span className="sr-only">Toggle sidebar</span>
                <div className="lg:hidden">
                  <svg
                    stroke="currentColor"
                    fill="currentColor"
                    stokewidth="0"
                    viewBox="0 0 20 20"
                    aria-hidden="true"
                    className="h-6 w-6"
                    height="1em"
                    width="1em"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h6a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                </div>
                <div className="hidden lg:block">
                  <svg
                    stroke="currentColor"
                    fill="currentColor"
                    stokewidth="0"
                    viewBox="0 0 20 20"
                    aria-hidden="true"
                    className="h-6 w-6"
                    height="1em"
                    width="1em"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h6a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                </div>
              </button> */}
              <a className="flex items-center mr-14 gap-[10px]" href="/">
                <div>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                  >
                    <path
                      fill="currentColor"
                      d="m16 7.58l-5.5-2.4L5 7.58v3.6c0 3.5 2.33 6.74 5.5 7.74c.25-.08.49-.2.73-.3c-.15-.51-.23-1.06-.23-1.62c0-2.97 2.16-5.43 5-5.91z"
                      opacity="0.3"
                    />
                    <path
                      fill="currentColor"
                      d="M17 13c-2.21 0-4 1.79-4 4s1.79 4 4 4s4-1.79 4-4s-1.79-4-4-4m0 1.38c.62 0 1.12.51 1.12 1.12s-.51 1.12-1.12 1.12s-1.12-.51-1.12-1.12s.5-1.12 1.12-1.12m0 5.37c-.93 0-1.74-.46-2.24-1.17c.05-.72 1.51-1.08 2.24-1.08s2.19.36 2.24 1.08c-.5.71-1.31 1.17-2.24 1.17"
                      opacity="0.3"
                    />
                    <circle cx="17" cy="15.5" r="1.12" fill="currentColor" />
                    <path
                      fill="currentColor"
                      d="M18 11.09V6.27L10.5 3L3 6.27v4.91c0 4.54 3.2 8.79 7.5 9.82c.55-.13 1.08-.32 1.6-.55A5.97 5.97 0 0 0 17 23c3.31 0 6-2.69 6-6c0-2.97-2.16-5.43-5-5.91M11 17c0 .56.08 1.11.23 1.62c-.24.11-.48.22-.73.3c-3.17-1-5.5-4.24-5.5-7.74v-3.6l5.5-2.4l5.5 2.4v3.51c-2.84.48-5 2.94-5 5.91m6 4c-2.21 0-4-1.79-4-4s1.79-4 4-4s4 1.79 4 4s-1.79 4-4 4"
                    />
                    <path
                      fill="currentColor"
                      d="M17 17.5c-.73 0-2.19.36-2.24 1.08c.5.71 1.32 1.17 2.24 1.17s1.74-.46 2.24-1.17c-.05-.72-1.51-1.08-2.24-1.08"
                    />
                  </svg>
                </div>
                <span className="self-center whitespace-nowrap text-2xl font-semibold dark:text-white">
                  Admin Solana
                </span>
              </a>
              {/* <form className="hidden lg:block lg:pl-2">
                <label
                  className="text-sm font-medium text-gray-900 dark:text-white sr-only"
                  data-testid="flowbite-label"
                  htmlFor="search"
                >
                  Search
                </label>
                <div className="flex w-full lg:w-96">
                  <div className="relative w-full">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                      <svg
                        stroke="currentColor"
                        fill="currentColor"
                        stokewidth="0"
                        viewBox="0 0 20 20"
                        aria-hidden="true"
                        className="h-5 w-5 text-gray-500 dark:text-gray-400"
                        height="1em"
                        width="1em"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          fillRule="evenodd"
                          d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                          clipRule="evenodd"
                        ></path>
                      </svg>
                    </div>
                    <input
                      className="block w-full border disabled:cursor-not-allowed disabled:opacity-50 outline-none border-gray-300 bg-gray-50 text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 focus:border-primary-500 focus:ring-primary-500 dark:focus:border-primary-500 dark:focus:ring-primary-500 p-2.5 sm:text-sm pl-10 rounded-lg"
                      type="search"
                      id="search"
                      placeholder="Search"
                      required=""
                      name="search"
                    />
                  </div>
                </div>
              </form> */}
            </div>
            {/* <div className="flex items-center lg:gap-3">
              <div className="flex items-center">
                <button className="cursor-pointer rounded p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-900 focus:bg-gray-100 focus:ring-2 focus:ring-gray-100 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white dark:focus:bg-gray-700 dark:focus:ring-gray-700 lg:hidden">
                  <span className="sr-only">Search</span>
                  <svg
                    stroke="currentColor"
                    fill="currentColor"
                    stokewidth="0"
                    viewBox="0 0 20 20"
                    aria-hidden="true"
                    className="h-6 w-6"
                    height="1em"
                    width="1em"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                </button>
                <button
                  type="button"
                  className="flex items-center"
                  aria-expanded="false"
                  aria-haspopup="menu"
                  id=":RknqjaH1:"
                >
                  <span className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">
                    <span className="sr-only">Notifications</span>
                    <svg
                      stroke="currentColor"
                      fill="currentColor"
                      stokewidth="0"
                      viewBox="0 0 20 20"
                      aria-hidden="true"
                      className="h-6 w-6"
                      height="1em"
                      width="1em"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z"></path>
                    </svg>
                  </span>
                </button>
                <button
                  type="button"
                  className="flex items-center"
                  aria-expanded="false"
                  aria-haspopup="menu"
                  id=":RsnqjaH1:"
                >
                  <span className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">
                    <span className="sr-only">Apps</span>
                    <svg
                      stroke="currentColor"
                      fill="currentColor"
                      stokewidth="0"
                      viewBox="0 0 20 20"
                      aria-hidden="true"
                      className="h-6 w-6"
                      height="1em"
                      width="1em"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path>
                    </svg>
                  </span>
                </button>
                <div className="hidden dark:block">
                  <div className="w-fit" data-testid="flowbite-tooltip-target">
                    <button
                      type="button"
                      aria-label="Toggle dark mode"
                      data-testid="dark-theme-toggle"
                      className="rounded-lg p-2.5 text-sm text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-4 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-700"
                    >
                      <svg
                        stroke="currentColor"
                        fill="currentColor"
                        stokewidth="0"
                        viewBox="0 0 20 20"
                        aria-hidden="true"
                        aria-label="Currently dark mode"
                        data-active="false"
                        className="h-5 w-5 hidden dark:block"
                        height="1em"
                        width="1em"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
                          clipRule="evenodd"
                        ></path>
                      </svg>
                      <svg
                        stroke="currentColor"
                        fill="currentColor"
                        stokewidth="0"
                        viewBox="0 0 20 20"
                        aria-hidden="true"
                        aria-label="Currently light mode"
                        data-active="true"
                        className="h-5 w-5 dark:hidden"
                        height="1em"
                        width="1em"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"></path>
                      </svg>
                    </button>
                  </div>
                  <div
                    data-testid="flowbite-tooltip"
                    tabIndex="-1"
                    className="absolute z-10 inline-block rounded-lg px-3 py-2 text-sm font-medium shadow-sm transition-opacity duration-300 invisible opacity-0 bg-gray-900 text-white dark:bg-gray-700"
                    style={{ position: "absolute", top: "8px", left: "8px" }}
                    id=":R14nqja:"
                    role="tooltip"
                  >
                    <div className="relative z-20">Toggle light mode</div>
                    <div
                      className="absolute z-10 h-2 w-2 rotate-45 bg-gray-900 dark:bg-gray-700"
                      data-testid="flowbite-tooltip-arrow"
                      style={{ top: "-4px", left: "-1px" }}
                    >
                      &nbsp;
                    </div>
                  </div>
                </div>
                <div className="dark:hidden">
                  <div className="w-fit" data-testid="flowbite-tooltip-target">
                    <button
                      type="button"
                      aria-label="Toggle dark mode"
                      data-testid="dark-theme-toggle"
                      className="rounded-lg p-2.5 text-sm text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-4 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-700"
                    >
                      <svg
                        stroke="currentColor"
                        fill="currentColor"
                        stokewidth="0"
                        viewBox="0 0 20 20"
                        aria-hidden="true"
                        aria-label="Currently dark mode"
                        data-active="false"
                        className="h-5 w-5 hidden dark:block"
                        height="1em"
                        width="1em"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
                          clipRule="evenodd"
                        ></path>
                      </svg>
                      <svg
                        stroke="currentColor"
                        fill="currentColor"
                        stokewidth="0"
                        viewBox="0 0 20 20"
                        aria-hidden="true"
                        aria-label="Currently light mode"
                        data-active="true"
                        className="h-5 w-5 dark:hidden"
                        height="1em"
                        width="1em"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"></path>
                      </svg>
                    </button>
                  </div>
                  <div
                    data-testid="flowbite-tooltip"
                    tabIndex="-1"
                    className="absolute z-10 inline-block rounded-lg px-3 py-2 text-sm font-medium shadow-sm transition-opacity duration-300 invisible opacity-0 bg-gray-900 text-white dark:bg-gray-700"
                    style={{
                      position: "absolute",
                      top: "61px",
                      left: "1254.47px",
                    }}
                    id=":R1cnqja:"
                    role="tooltip"
                  >
                    <div className="relative z-20">Toggle dark mode</div>
                    <div
                      className="absolute z-10 h-2 w-2 rotate-45 bg-gray-900 dark:bg-gray-700"
                      data-testid="flowbite-tooltip-arrow"
                      style={{ top: "-4px", left: "68.7655px" }}
                    >
                      &nbsp;
                    </div>
                  </div>
                </div>
                <div className="ml-3 flex items-center">
                  <button
                    type="button"
                    className="flex items-center"
                    aria-expanded="false"
                    aria-haspopup="menu"
                    id=":R1knqjaH1:"
                  >
                    <span>
                      <span className="sr-only">User menu</span>
                      <div
                        className="flex items-center justify-center space-x-4 rounded"
                        data-testid="flowbite-avatar"
                      >
                        <div className="relative">
                          <img
                            alt=""
                            src="/images/users/neil-sims.png"
                            className="rounded-full h-8 w-8"
                            data-testid="flowbite-avatar-img"
                          />
                        </div>
                      </div>
                    </span>
                  </button>
                </div>
              </div>
            </div> */}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default AdminNav;
