import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useJobs } from '../contexts/JobContext';
import Navigation from '../components/Navigation';

function AllJobs() {
  const { jobs } = useJobs();
  const navigate = useNavigate();
  const [filters, setFilters] = useState({
    past: true,
    current: true,
    upcoming: true
  });

  const filterJobs = () => {
    const now = new Date();
    return jobs.filter(job => {
      const startDate = new Date(job.startDate);
      const endDate = new Date(job.endDate);

      if (filters.past && endDate < now) return true;
      if (filters.current && startDate <= now && endDate >= now) return true;
      if (filters.upcoming && startDate > now) return true;
      return false;
    });
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navigation />
      <main className="container mx-auto p-4">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">All Jobs</h2>
            <div className="flex space-x-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={filters.past}
                  onChange={(e) => setFilters({...filters, past: e.target.checked})}
                  className="mr-2"
                />
                Past Jobs
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={filters.current}
                  onChange={(e) => setFilters({...filters, current: e.target.checked})}
                  className="mr-2"
                />
                Current Jobs
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={filters.upcoming}
                  onChange={(e) => setFilters({...filters, upcoming: e.target.checked})}
                  className="mr-2"
                />
                Upcoming Jobs
              </label>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filterJobs().map(job => (
              <div 
                key={job.id}
                onClick={() => navigate(`/job/${job.id}`)}
                className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer"
              >
                <h3 className="font-semibold text-lg mb-2">{job.name}</h3>
                <p className="text-gray-600 text-sm mb-1">Job #: {job.jobNumber}</p>
                <p className="text-gray-600 text-sm mb-1">Location: {job.location}</p>
                <p className="text-gray-600 text-sm">
                  {new Date(job.startDate).toLocaleDateString()} - {new Date(job.endDate).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

export default AllJobs;