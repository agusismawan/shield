import Link from "next/link";
import { classNames } from "./utils";
import { Fragment } from "react";
import { Menu, Transition, Disclosure } from "@headlessui/react";
import { SelectorIcon, UserCircleIcon } from "@heroicons/react/solid";
import { ChevronRightIcon } from "@heroicons/react/outline";
import { checkMemberAES } from "./problems/ProblemHelper";

export default function Sidebar({ navigation, router, session, action }) {
  return (
    <>
      {/* Static sidebar for desktop */}
      <div className="hidden lg:flex lg:flex-shrink-0">
        <div className="flex flex-col w-64 pt-5 pb-4 bg-white border-r border-gray-200">
          <div className="flex items-center flex-shrink-0 px-6">
            <img className="w-auto h-8" src="/shield-logo.png" alt="Shield" />
          </div>
          {/* Sidebar component, swap this element with another sidebar if you like */}
          <div className="flex flex-col flex-1 h-0 overflow-y-auto">
            {/* User account dropdown */}
            <Menu
              as="div"
              className="relative inline-block px-3 mt-6 text-left"
            >
              {({ open }) => (
                <>
                  <div>
                    <Menu.Button className="group w-full bg-white rounded-md px-3.5 py-2 text-sm text-left font-medium text-gray-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-blue-500">
                      <span className="flex items-center justify-between w-full">
                        <span className="flex items-center justify-between min-w-0 space-x-3">
                          <UserCircleIcon
                            className="w-10 h-10 text-gray-500"
                            aria-hidden="true"
                          />
                          <span className="flex flex-col flex-1 min-w-0">
                            <span className="text-sm font-medium text-gray-900 truncate">
                              {session.fullname
                                ? session.fullname
                                : session.username}
                            </span>
                            <span className="text-sm text-gray-500 truncate">
                              {`@${session.username}`}
                            </span>
                          </span>
                        </span>
                        <SelectorIcon
                          className="flex-shrink-0 w-5 h-5 text-gray-400 group-hover:text-gray-500"
                          aria-hidden="true"
                        />
                      </span>
                    </Menu.Button>
                  </div>
                  <Transition
                    show={open}
                    as={Fragment}
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                  >
                    <Menu.Items
                      static
                      className="absolute left-0 right-0 z-10 mx-3 mt-1 origin-top bg-white divide-y divide-gray-200 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
                    >
                      <div className="py-1">
                        <Menu.Item>
                          {({ active }) => (
                            <a
                              key={1}
                              href="#"
                              className={classNames(
                                active
                                  ? "bg-gray-100 text-gray-900"
                                  : "text-gray-700",
                                "block px-4 py-2 text-sm"
                              )}
                            >
                              View profile
                            </a>
                          )}
                        </Menu.Item>
                        <Menu.Item>
                          {({ active }) => (
                            <a
                              key={2}
                              href="#"
                              className={classNames(
                                active
                                  ? "bg-gray-100 text-gray-900"
                                  : "text-gray-700",
                                "block px-4 py-2 text-sm"
                              )}
                            >
                              Notifications
                            </a>
                          )}
                        </Menu.Item>
                      </div>
                      <div className="py-1">
                        <Menu.Item>
                          {({ active }) => (
                            <a
                              key={3}
                              href="#"
                              onClick={action}
                              className={classNames(
                                active
                                  ? "bg-gray-100 text-gray-900"
                                  : "text-g  ray-700",
                                "block px-4 py-2 text-sm"
                              )}
                            >
                              Logout
                            </a>
                          )}
                        </Menu.Item>
                      </div>
                    </Menu.Items>
                  </Transition>
                </>
              )}
            </Menu>
            {/* Navigation */}
            <nav className="p-4 px-3 mt-6 border-t border-gray-200">
              <div className="space-y-1">
                {navigation.map((item) =>
                  !item.children ? (
                    <Link key={item.key} href={item.href}>
                      <a
                        className={classNames(
                          router.pathname.includes(item.href)
                            ? "bg-gray-100 text-gray-900"
                            : "text-gray-600 hover:text-gray-900 hover:bg-gray-50",
                          "group flex items-center px-2 py-2 text-sm font-medium rounded-md"
                        )}
                        aria-current={item.current ? "page" : undefined}
                      >
                        <item.icon
                          className={classNames(
                            router.pathname.includes(item.href)
                              ? "text-gray-500"
                              : "text-gray-400 group-hover:text-gray-500",
                            "mr-3 flex-shrink-0 h-6 w-6"
                          )}
                          aria-hidden="true"
                        />
                        {item.name}
                      </a>
                    </Link>
                  ) : (
                    <Disclosure as="div" key={item.name} className="space-y-1">
                      {({ open }) => (
                        <>
                          <Disclosure.Button
                            className={classNames(
                              router.pathname.includes(item.href)
                                ? "bg-gray-100 text-gray-900"
                                : "text-gray-600 hover:text-gray-900 hover:bg-gray-50",
                              "group flex items-center px-2 py-2 text-sm font-medium rounded-md"
                            )}
                            aria-current={item.current ? "page" : undefined}
                          >
                            <item.icon
                              className={classNames(
                                router.pathname.includes(item.href)
                                  ? "text-gray-500"
                                  : "text-gray-400 group-hover:text-gray-500",
                                "mr-3 flex-shrink-0 h-6 w-6"
                              )}
                              aria-hidden="true"
                            />
                            {item.name}
                            <ChevronRightIcon
                              className={classNames(
                                open
                                  ? "text-gray-400 rotate-90 transition-transform ease-in-out duration-250"
                                  : "text-gray-300 transition-transform ease-in-out duration-250",
                                "ml-2 flex-shrink-0 h-5 w-5 transform group-hover:text-gray-400 transition-colors ease-in-out duration-250"
                              )}
                              aria-hidden="true"
                            />
                          </Disclosure.Button>
                          <Disclosure.Panel className="space-y-1">
                            {checkMemberAES(session)
                              ? item.children.map((subItem) => (
                                  <Link key={subItem.name} href={subItem.href}>
                                    <a
                                      className={classNames(
                                        router.pathname == subItem.href
                                          ? "bg-gray-100 text-gray-900"
                                          : "text-gray-600 hover:text-gray-900 hover:bg-gray-50",
                                        "group flex items-center pl-12 pr-2 py-2 text-sm font-medium rounded-md"
                                      )}
                                      aria-current={
                                        subItem.current ? "page" : undefined
                                      }
                                    >
                                      {subItem.name}
                                    </a>
                                  </Link>
                                ))
                              : item.children
                                  .filter((check) => check.permission == "all")
                                  .map((subItem) => {
                                    return (
                                      <Link
                                        key={subItem.name}
                                        href={subItem.href}
                                      >
                                        <a
                                          className={classNames(
                                            router.pathname == subItem.href
                                              ? "bg-gray-100 text-gray-900"
                                              : "text-gray-600 hover:text-gray-900 hover:bg-gray-50",
                                            "group flex items-center pl-12 pr-2 py-2 text-sm font-medium rounded-md"
                                          )}
                                          aria-current={
                                            subItem.current ? "page" : undefined
                                          }
                                        >
                                          {subItem.name}
                                        </a>
                                      </Link>
                                    );
                                  })}
                          </Disclosure.Panel>
                        </>
                      )}
                    </Disclosure>
                  )
                )}
              </div>
            </nav>
          </div>
        </div>
      </div>
    </>
  );
}
