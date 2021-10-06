import Head from "next/head";
import { useRouter } from "next/router";
import Layout from "../../components/layout";
import { Fragment } from "react";
import { Menu, Transition } from "@headlessui/react";
import {
  CashIcon,
  CheckCircleIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  OfficeBuildingIcon,
  SearchIcon,
} from "@heroicons/react/solid";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function Detail() {
  return (
    <>
      <Layout>
        <Head>
          <title>Incident Report</title>
        </Head>
        <section>
          {/* Page header */}
          <div className="bg-white shadow">
            <div className="px-4 sm:px-6 lg:max-w-6xl lg:mx-auto lg:px-8">
              <div className="py-6 md:flex md:items-center md:justify-between">
                <div className="flex-1 min-w-0">
                  {/* Profile */}
                  <div className="flex items-center">
                    <div>
                      <h1 className="text-2xl font-bold text-gray-900">
                        Briva Kredivo Timeout
                      </h1>
                      <p className="mt-2 text-sm text-gray-500">
                        reported by{" "}
                        <a href="#" className="font-medium text-gray-900">
                          Jon Snow
                        </a>{" "}
                        in{" "}
                        <a href="#" className="font-medium text-gray-900">
                          Customer Portal
                        </a>
                      </p>
                    </div>
                  </div>
                </div>
                <div className="mt-6 flex space-x-3 md:mt-0 md:ml-4">
                  <button
                    type="button"
                    className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500"
                  >
                    Add money
                  </button>
                  <button
                    type="button"
                    className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-cyan-600 hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500"
                  >
                    Send money
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </Layout>
    </>
  );
}
