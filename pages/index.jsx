import Layout from "../components/layout"
import Head from "next/head";
import { OfficeBuildingIcon, DocumentSearchIcon, FireIcon, ChatAlt2Icon } from "@heroicons/react/outline";

export const getServerSideProps = async () => {
  const res = await fetch("https://ularkadut.xyz/v1.0/incidents");
  const data = await res.json();

  return {
    props: {
      incidents: data,
    },
  };
}

function Home({ incidents }) {
  const cards = [
    {
      name: 'Incidents Open',
      href: '/incidents',
      icon: DocumentSearchIcon,
      total: incidents.data.filter((status) => status.incidentStatus === 'Open').length
    },
    {
      name: 'Problem Management',
      href: '#',
      icon: FireIcon,
      total: 0
    },
    {
      name: 'Ticket Open',
      href: '#',
      icon: ChatAlt2Icon,
      total: 0
    },

  ]

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
              <div className="py-6 md:flex md:items-center md:justify-between lg:border-t lg:border-gray-200">
                <div className="flex-1 min-w-0">
                  {/* Profile */}
                  <div className="flex items-center">
                    <div>
                      <div className="flex items-center">
                        <h1 className="ml-3 text-2xl font-bold leading-7 text-gray-900 sm:leading-9 sm:truncate">
                          Hello, Emilia Birch
                        </h1>
                      </div>
                      <dl className="mt-6 flex flex-col sm:ml-3 sm:mt-1 sm:flex-row sm:flex-wrap">
                        <dt className="sr-only">Company</dt>
                        <dd className="flex items-center text-sm text-gray-500 font-medium capitalize sm:mr-6">
                          <OfficeBuildingIcon
                            className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400"
                            aria-hidden="true"
                          />
                          Application Management &amp; Operation Division
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
              <h2 className="text-lg leading-6 font-medium text-gray-900">Overview</h2>
              <div className="mt-2 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {/* Card */}
                {cards.map((card) => (
                  <div key={card.name} className="bg-white overflow-hidden shadow rounded-lg">
                    <div className="p-5">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          <card.icon className="h-6 w-6 text-gray-400" aria-hidden="true" />
                        </div>
                        <div className="ml-5 w-0 flex-1">
                          <dl>
                            <dt className="text-sm font-medium text-gray-500 truncate">{card.name}</dt>
                            <dd>
                              <div className="text-lg font-medium text-gray-900">{card.total}</div>
                            </dd>
                          </dl>
                        </div>
                      </div>
                    </div>
                    <div className="bg-gray-50 px-5 py-3">
                      <div className="text-sm">
                        <a href={card.href} className="font-medium text-cyan-700 hover:text-cyan-900">
                          {card.href !== '#' ? 'View All' : 'Coming Soon'}
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </Layout>
    </>
  );
}

export default Home;