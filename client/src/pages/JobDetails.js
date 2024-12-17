import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useJobs } from '../context/JobContext';
import { useAuth } from '../contexts/AuthContext';
import Navigation from '../components/Navigation';

function CreateJob() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { jobs, setJobs } = useJobs();
  const [jobData, setJobData] = useState({
    name: '',
    jobNumber: '',
    location: '',
    startDate: '',
    endDate: '',
    description: '',
    type: 'paint',
    status: 'active',
    assignedEmployees: []
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const newJob = {
      ...jobData,
      id: Date.now(),
      startDate: new Date(jobData.startDate),
      endDate: new Date(jobData.endDate),
      documents: []
    };
    
    setJobs([...jobs, newJob]);
    navigate('/schedule');
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navigation />
      
      <main className="container mx-auto p-4">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-bold mb-6">Create New Job</h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Job Name
                </label>
                <input
                  type="text"
                  required
                  className="w-full p-2 border rounded focus:ring-preferred-green focus:border-preferred-green"
                  value={jobData.name}
                  onChange={(e) => setJobData({ ...jobData, name: e.target.value })}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Job Number
                </label>
                <input
                  type="text"
                  required
                  className="w-full p-2 border rounded focus:ring-preferred-green focus:border-preferred-green"
                  value={jobData.jobNumber}
                  onChange={(e) => setJobData({ ...jobData, jobNumber: e.target.value })}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Start Date
                </label>
                <input
                  type="date"
                  required
                  className="w-full p-2 border rounded focus:ring-preferred-green focus:border-preferred-green"
                  value={jobData.startDate}
                  onChange={(e) => setJobData({ ...jobData, startDate: e.target.value })}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  End Date
                </label>
                <input
                  type="date"
                  required
                  className="w-full p-2 border rounded focus:ring-preferred-green focus:border-preferred-green"
                  value={jobData.endDate}
                  onChange={(e) => setJobData({ ...jobData, endDate: e.target.value })}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Location
              </label>
              <input
                type="text"
                required
                className="w-full p-2 border rounded focus:ring-preferred-green focus:border-preferred-green"
                value={jobData.location}
                onChange={(e) => setJobData({ ...jobData, location: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                className="w-full p-2 border rounded focus:ring-preferred-green focus:border-preferred-green"
                rows="4"
                value={jobData.description}
                onChange={(e) => setJobData({ ...jobData, description: e.target.value })}
              />
            </div>

            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => navigate('/schedule')}
                className="px-4 py-2 border rounded text-gray-600 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-preferred-green text-white rounded hover:bg-preferred-green/90"
              >
                Create Job
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}

export default CreateJob;