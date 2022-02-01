import SelectFilterApps from "./select-filter-apps";
import SelectFilterIncidents from "./select-filter-incidents";

const CreateForm = () => {
  const createProblem = async event => {
    event.preventDefault()

    const res = await fetch(
      'http://127.0.0.1:3030/v1/probman/problem',
      {
        body: JSON.stringify({
          idApps: event.target.idApps.value,
          idIncident: event.target.idIncident.value,
          tanpaIncident: event.target.tanpaIncident.value,
          problemName: event.target.problemName.value,
          rootCause: event.target.rootCause.value,
          impact: event.target.impact.value,
          description: event.target.description.value,
          workAround: event.target.workAround.value,
          proposedEnhancement: event.target.proposedEnhancement.value,
        }),
        headers: {
          'Content-Type': 'application/json'
        },
        method: 'POST'
      }
    )

    const result = await res.json()
    // result.user => 'Ada Lovelace'
  }

  return (
    <>
      <div className="bg-gray-50">
        <div className="mx-auto py-2 px-8 sm:py-2 sm:px-8 lg:px-8">
          <div className="mx-auto divide-y-2 divide-gray-200">
            <form onSubmit={createProblem}>
              <div className="space-y-8 divide-y divide-gray-200">
                <div className="mt-6 grid grid-cols-3 gap-x-2 sm:grid-cols-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Application
                    </label>
                    <div className="mt-1 block rounded-md shadow-sm">
                      <SelectFilterApps />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Incident
                    </label>
                    <div className="mt-1 block rounded-md shadow-sm">
                      <SelectFilterIncidents />
                    </div>
                    <div className="mt-2 relative flex items-start">
                      <div className="flex items-center h-5">
                        <input
                          id="tanpaIncident"
                          name="tanpaIncident"
                          type="checkbox"
                          className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                          // value="tanpaIncident"
                        />
                      </div>
                      <div className="ml-3 text-sm">
                        <label
                          htmlFor="tanpaIncident"
                          className="font-medium text-gray-700"
                        >
                          Tanpa Incident
                        </label>
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Problem Name
                    </label>
                    <div className="mt-1">
                      <input
                        id="problemName"
                        name="problemName"
                        className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border border-gray-300 rounded-md"
                        type="text"
                      />
                    </div>
                    <p className="mt-2 text-sm text-gray-500">
                      Write a few sentences about problem.
                    </p>
                  </div>
                </div>

                <div className="mt-6 grid grid-cols-3 gap-x-2 sm:grid-cols-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Root Cause Analysis
                    </label>
                    <div className="mt-1">
                      <textarea
                        id="rootCause"
                        name="rootCause"
                        className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border border-gray-300 rounded-md"
                        type="text"
                      />
                    </div>
                    <p className="mt-2 text-sm text-gray-500">
                      wasweswos fafifu.
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Description
                    </label>
                    <div className="mt-1">
                      <textarea
                        id="description"
                        name="description"
                        className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border border-gray-300 rounded-md"
                        type="text"
                      />
                    </div>
                    <p className="mt-2 text-sm text-gray-500">
                      waswesows fafifu.
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Impact
                    </label>
                    <div className="mt-1">
                      <textarea
                        id="impact"
                        name="impact"
                        className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border border-gray-300 rounded-md"
                        type="text"
                      />
                    </div>
                    <p className="mt-2 text-sm text-gray-500">
                      waswesows fafifu.
                    </p>
                  </div>
                </div>

                <div className="mt-6 grid grid-cols-3 gap-x-2 sm:grid-cols-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Workaround
                    </label>
                    <div className="mt-1">
                      <textarea
                        id="workAround"
                        name="workAround"
                        className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border border-gray-300 rounded-md"
                        type="text"
                      />
                    </div>
                    <p className="mt-2 text-sm text-gray-500">
                      wasweswos fafifu.
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Proposed Enhancement
                    </label>
                    <div className="mt-1">
                      <textarea
                        id="proposedEnhancement"
                        name="proposedEnhancement"
                        className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border border-gray-300 rounded-md"
                        type="text"
                      />
                    </div>
                    <p className="mt-2 text-sm text-gray-500">
                      waswesows fafifu.
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Resolution
                    </label>
                    <div className="mt-1">
                      <textarea
                        id="resolution"
                        name="resolution"
                        className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border border-gray-300 rounded-md"
                        type="text"
                      />
                    </div>
                    <p className="mt-2 text-sm text-gray-500">
                      waswesows fafifu.
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <div className="flex justify-end">
                  <button
                    type="button"
                    className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Save
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default CreateForm;
