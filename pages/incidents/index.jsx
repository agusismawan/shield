import Head from "next/head";
import Link from "next/link";
import Layout from "../../components/layout";
import { useMemo, useState, useEffect } from "react";
import Table from '../../components/incidents/table';
import format from "date-fns/format";
import axios from "axios";
import SelectColumnFilter from "../../components/incidents/dropdown-filter";
import AvatarCell from "../../components/incidents/avatar-cell";
import PageHeader from "../../components/incidents/page-header";
import { PlusSmIcon } from "@heroicons/react/outline";
import { ButtonSmall } from '../../components/ui/button';
import { toast } from "react-toastify";

function IncidentList() {
    const [loadingData, setLoadingData] = useState(true);
    const columns = useMemo(() => [
        {
            Header: "Incident Name",
            accessor: "incidentName",
        },
        {
            Header: "Application",
            accessor: "paramApps.name",
            Filter: SelectColumnFilter,
            filter: 'includes',
            Cell: props => {
                return (
                    props.row.original.idApps ?
                        <div>
                            <div className="text-xs font-normal text-gray-900">{props.row.original.paramApps.name}</div>
                            <div className="text-xs font-normal text-gray-500">{props.row.original.paramApps.criticalityApp}</div>
                        </div>
                        : '-'
                )
            }
        },
        {
            Header: "Priority",
            accessor: "paramPriorityMatrix.mapping",
        },
        {
            Header: "Duration",
            accessor: "resolvedIntervals",
        },
        {
            Header: "Started At",
            accessor: "startTime",
            Cell: props => {
                return (
                    <div>
                        <div className="text-xs font-normal text-gray-900">{format(new Date(props.row.original.startTime), "dd/MM/yyyy HH:mm:ss")}</div>
                        <div className="text-xs font-normal text-gray-500">End at {format(new Date(props.row.original.endTime), "dd/MM/yyyy HH:mm:ss")}</div>
                    </div>
                )
            }
        },
        {
            Header: "Reporter",
            accessor: "",
            Cell: AvatarCell
        },
    ], [])

    const [data, setData] = useState([]);
    useEffect(() => {
        async function getData() {
            await axios.get("https://ularkadut.xyz/v1.0/incidents")
                .then((response) => {
                    console.log(response.data);
                    const result = response.data;
                    setData(result.data);
                    setLoadingData(false);
                })
                .catch((err) => toast.error(err))
        }
        if (loadingData) {
            getData();
        }
    }, [])

    return (
        <>
            <Layout>
                <Head>
                    <title>Incident Report</title>
                </Head>
                <section>
                    {/* Page title & actions */}
                    <PageHeader title="Incident Report">
                        <Link href="/incidents/add" passHref>
                            <ButtonSmall type="button">
                                <PlusSmIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
                                New Incident
                            </ButtonSmall>
                        </Link>
                    </PageHeader>

                    {loadingData ? (
                        <p>Loading Please Wait ...</p>
                    ) : (
                        <div className="hidden sm:block mt-3">
                            <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
                                <Table columns={columns} data={data} />
                            </div>
                        </div>
                    )}
                </section>
            </Layout>
        </>
    )
}

export default IncidentList;