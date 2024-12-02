import { Popover } from '@headlessui/react';

function JobTooltip({ job }) {
  return (
    <Popover className="relative">
      <Popover.Button className="w-full focus:outline-none">
        <JobEvent job={job} />
      </Popover.Button>

      <Popover.Panel className="absolute z-10 w-72 px-4 mt-3 transform -translate-x-1/2 left-1/2">
        <div className="bg-white rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 p-4">
          <div className="flex flex-col space-y-2">
            <h4 className="font-bold">{job.name}</h4>
            <p className="text-sm text-gray-600">{job.location}</p>
            <div className="text-sm">
              <p>Start: {new Date(job.startDate).toLocaleDateString()}</p>
              <p>End: {new Date(job.endDate).toLocaleDateString()}</p>
            </div>
            <p className="text-sm">{job.description}</p>
          </div>
        </div>
      </Popover.Panel>
    </Popover>
  );
}