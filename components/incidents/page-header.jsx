const PageHeader = ({ title, children }) => {
  return (
    <div className="px-4 py-4 border-b border-gray-200 sm:flex sm:items-center sm:justify-between sm:px-6 lg:px-12">
      <div className="flex-1 min-w-0">
        <h1 className="text-xl font-bold leading-6 text-gray-900 sm:truncate">
          {title}
        </h1>
      </div>
      <div className="flex mt-4 space-x-3 sm:mt-0 sm:ml-4">{children}</div>
    </div>
  );
};

export default PageHeader;
