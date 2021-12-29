const PageHeader = ({ title, children }) => {
    return (
        <div className="border-b border-gray-200 px-4 py-4 sm:flex sm:items-center sm:justify-between sm:px-6 lg:px-8">
            <div className="flex-1 min-w-0">
                <h1 className="text-xl font-bold leading-6 text-gray-900 sm:truncate">
                    {title}
                </h1>
            </div>
            <div className="mt-4 flex sm:mt-0 sm:ml-4">
                {children}
            </div>
        </div>

    )
}

export default PageHeader;