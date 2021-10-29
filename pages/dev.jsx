import Layout from "../components/layout";

export default function Dev() {
    return (
        <>
            <Layout>
                <div className="absolute inset-0 py-6 px-4 sm:px-6 lg:px-8">
                    <div className="h-full border-2 border-gray-200 border-dashed rounded-lg" />
                </div>
                <aside className="hidden relative xl:flex xl:flex-col flex-shrink-0 w-96 border-l border-gray-200">
                    {/* Start secondary column (hidden on smaller screens) */}
                    <div className="absolute inset-0 py-6 px-4 sm:px-6 lg:px-8">
                        <div className="h-full border-2 border-gray-200 border-dashed rounded-lg" />
                    </div>
                    {/* End secondary column */}
                </aside>
            </Layout>
        </>
    )
}