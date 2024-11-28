import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useJobs } from '../context/JobContext';
import { useAuth } from '../context/AuthContext';
import Navigation from '../components/Navigation';

function CreateJob() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { jobs, setJobs, addJob } = useJobs();
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
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

  const validateForm = () => {
    const newErrors = {};
    
    // Job Name validation
    if (jobData.name.length < 3) {
      newErrors.name = 'Job name must be at least 3 characters';
    }
    
    // Job Number validation
    if (jobData.jobNumber.length < 4) {
      newErrors.jobNumber = 'Job number must be at least 4 characters';
    }
    
    // Only validate that end date is after start date
    const start = new Date(jobData.startDate);
    const end = new Date(jobData.endDate);
    
    if (end <= start) {
      newErrors.endDate = 'End date must be after start date';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const newJob = {
        ...jobData,
        startDate: new Date(jobData.startDate),
        endDate: new Date(jobData.endDate),
        documents: [],
        dayShift: [],
        nightShift: [],
        assignedEmployees: [],
        createdBy: currentUser.email,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      await addJob(newJob);
      navigate('/schedule');
    } catch (error) {
      console.error("Error creating job:", error);
      setErrors({ submit: 'Failed to create job' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Navigation />
      
      <main className="container mx-auto p-6 max-w-4xl">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-3xl font-bold mb-8 text-gray-800 border-b pb-4">Create New Job</h2>
          
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Job Name
                </label>
                <input
                  type="text"
                  required
                  className={`w-full p-2 border rounded focus:ring-preferred-green focus:border-preferred-green ${
                    errors.name ? 'border-red-500' : ''
                  }`}
                  value={jobData.name}
                  onChange={(e) => setJobData({ ...jobData, name: e.target.value })}
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-500">{errors.name}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Job Number
                </label>
                <input
                  type="text"
                  required
                  className={`w-full p-2 border rounded focus:ring-preferred-green focus:border-preferred-green ${
                    errors.jobNumber ? 'border-red-500' : ''
                  }`}
                  value={jobData.jobNumber}
                  onChange={(e) => setJobData({ ...jobData, jobNumber: e.target.value })}
                />
                {errors.jobNumber && (
                  <p className="mt-1 text-sm text-red-500">{errors.jobNumber}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Start Date
                </label>
                <input
                  type="date"
                  required
                  className={`w-full p-2 border rounded focus:ring-preferred-green focus:border-preferred-green ${
                    errors.startDate ? 'border-red-500' : ''
                  }`}
                  value={jobData.startDate}
                  onChange={(e) => setJobData({ ...jobData, startDate: e.target.value })}
                />
                {errors.startDate && (
                  <p className="mt-1 text-sm text-red-500">{errors.startDate}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  End Date
                </label>
                <input
                  type="date"
                  required
                  className={`w-full p-2 border rounded focus:ring-preferred-green focus:border-preferred-green ${
                    errors.endDate ? 'border-red-500' : ''
                  }`}
                  value={jobData.endDate}
                  onChange={(e) => setJobData({ ...jobData, endDate: e.target.value })}
                />
                {errors.endDate && (
                  <p className="mt-1 text-sm text-red-500">{errors.endDate}</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Location
              </label>
              <input
                type="text"
                required
                className={`w-full p-2 border rounded focus:ring-preferred-green focus:border-preferred-green ${
                  errors.location ? 'border-red-500' : ''
                }`}
                value={jobData.location}
                onChange={(e) => setJobData({ ...jobData, location: e.target.value })}
              />
              {errors.location && (
                <p className="mt-1 text-sm text-red-500">{errors.location}</p>
              )}
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
                disabled={isLoading}
                className="px-4 py-2 bg-preferred-green text-white rounded hover:bg-preferred-green/90 disabled:opacity-50"
              >
                {isLoading ? 'Creating...' : 'Create Job'}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}

export default CreateJob;