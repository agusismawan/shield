import Head from "next/head";
import Layout from "../components/layout";
import PageHeader from "../components/incidents/page-header";
import CardHeader from "../components/incidents/card-header";
import IncidentTables from "../components/incidents/incident-tables";
import { FolderOpenIcon, CheckCircleIcon } from "@heroicons/react/outline";

export const getServerSideProps = async () => {
  const res = await fetch("https://ularkadut.xyz/v1.0/incidents");
  const data = await res.json();

  return {
    props: {
      incidents: data,
    },
  };
}

export default function IncidentList({ incidents }) {
  return (
    <>
      <Layout>
        <Head>
          <title>Incident Report</title>
        </Head>
        <section>
          {/* Page title & actions */}
          <PageHeader title="Incident Report" />

          {/* Cards */}
          <div className="px-4 mt-6 sm:px-6 lg:px-8">
            <ul className="grid grid-cols-1 gap-4 sm:gap-6 sm:grid-cols-2 xl:grid-cols-4 mt-3">
              <CardHeader
                id="1"
                bgColor="bg-red-600"
                initials={<FolderOpenIcon className="w-6 h-6" />}
                title="Open"
                desc={`${incidents.data.filter((status) => status.incidentStatus === 'Open').length} Incidents`}
              />
              <CardHeader
                id="2"
                bgColor="bg-green-500"
                initials={<CheckCircleIcon className="w-6 h-6" />}
                title="Resolved"
                desc={`${incidents.data.filter((status) => status.incidentStatus === 'Resolved').length} Incidents`}
              />
              <CardHeader
                id="3"
                bgColor="bg-blue-500"
                initials={<CheckCircleIcon className="w-6 h-6" />}
                title="All"
                desc={`${incidents.data.filter((status) => status.incidentStatus).length} Incidents`}
              />
            </ul>
          </div>

          {/* Incident Tables table (small breakpoint and up) */}
          <div className="hidden mt-8 sm:block">
            <div className="align-middle inline-block min-w-full border-b border-gray-200">
              <IncidentTables incidents={incidents} />
            </div>
          </div>
        </section>
      </Layout>
    </>
  );
}
