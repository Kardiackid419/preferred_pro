import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useJobs } from '../context/JobContext';
import { useAuth } from '../context/AuthContext';
import Navigation from '../components/Navigation';
import { Input, TextArea } from '../components/shared/Input';
import { Button } from '../components/shared/Button';

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
      
      <main className="container mx-auto px-4 py-4 sm:py-6 max-w-4xl">
        <div className="bg-white rounded-lg sm:rounded-xl shadow p-4 sm:p-6 md:p-8">
          <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-gray-800 border-b pb-3">
            Create New Job
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Job Name"
                type="text"
                required
                placeholder="Enter job name"
                value={jobData.name}
                onChange={(e) => setJobData({ ...jobData, name: e.target.value })}
                error={errors.name}
              />
              
              <Input
                label="Job Number"
                type="text"
                required
                placeholder="Enter job number"
                value={jobData.jobNumber}
                onChange={(e) => setJobData({ ...jobData, jobNumber: e.target.value })}
                error={errors.jobNumber}
              />
              
              <Input
                label="Start Date"
                type="date"
                required
                value={jobData.startDate}
                onChange={(e) => setJobData({ ...jobData, startDate: e.target.value })}
                error={errors.startDate}
              />
              
              <Input
                label="End Date"
                type="date"
                required
                value={jobData.endDate}
                onChange={(e) => setJobData({ ...jobData, endDate: e.target.value })}
                error={errors.endDate}
              />
            </div>

            <Input
              label="Location"
              type="text"
              required
              placeholder="Enter job location"
              value={jobData.location}
              onChange={(e) => setJobData({ ...jobData, location: e.target.value })}
              error={errors.location}
            />

            <TextArea
              label="Description"
              rows="4"
              value={jobData.description}
              onChange={(e) => setJobData({ ...jobData, description: e.target.value })}
            />

            <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 sm:gap-4 mt-6">
              <Button
                type="button"
                variant="secondary"
                onClick={() => navigate('/schedule')}
                className="w-full sm:w-auto"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full sm:w-auto"
              >
                {isLoading ? 'Creating...' : 'Create Job'}
              </Button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}

export default CreateJob;