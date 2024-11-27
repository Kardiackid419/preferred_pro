import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useJobs } from '../context/JobContext';
import { useAuth } from '../context/AuthContext';
import Navigation from '../components/Navigation';
import EmployeePool from '../components/EmployeePool';

function EditJob() {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const { jobs, updateJob, deleteJob } = useJobs();
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
    assignedEmployees: [],
    dayShift: [],
    nightShift: []
  });

  useEffect(() => {
    const job = jobs.find(j => j.id === jobId);
    if (job) {
      setJobData({
        ...job,
        startDate: new Date(job.startDate).toISOString().split('T')[0],
        endDate: new Date(job.endDate).toISOString().split('T')[0]
      });
    }
  }, [jobId, jobs]);

  const validateForm = () => {
    const newErrors = {};
    
    if (jobData.name.length < 3) {
      newErrors.name = 'Job name must be at least 3 characters';
    }
    
    if (jobData.jobNumber.length < 4) {
      newErrors.jobNumber = 'Job number must be at least 4 characters';
    }
    
    const start = new Date(jobData.startDate);
    const end = new Date(jobData.endDate);
    
    if (end <= start) {
      newErrors.endDate = 'End date must be after start date';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      await updateJob(jobId, {
        ...jobData,
        startDate: new Date(jobData.startDate),
        endDate: new Date(jobData.endDate)
      });
      navigate('/schedule');
    } catch (error) {
      setErrors({ submit: 'Failed to update job' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this job?')) {
      try {
        await deleteJob(jobId);
        navigate('/schedule');
      } catch (error) {
        setErrors({ submit: 'Failed to delete job' });
      }
    }
  };

  const handleAssignEmployee = (employeeId, shift) => {
    setJobData(prev => ({
      ...prev,
      assignedEmployees: [...prev.assignedEmployees, employeeId],
      [shift === 'day' ? 'dayShift' : 'nightShift']: [...prev[shift === 'day' ? 'dayShift' : 'nightShift'], employeeId]
    }));
  };

  const handleUnassignEmployee = (employeeId) => {
    setJobData(prev => ({
      ...prev,
      assignedEmployees: prev.assignedEmployees.filter(id => id !== employeeId),
      dayShift: prev.dayShift.filter(id => id !== employeeId),
      nightShift: prev.nightShift.filter(id => id !== employeeId)
    }));
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navigation />
      
      <main className="container mx-auto p-4">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Edit Job</h2>
            <button
              onClick={handleDelete}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Delete Job
            </button>
          </div>

          <form onSubmit={handleUpdate} className="space-y-6">
            {/* Copy the form fields from CreateJob component */}
            {/* Reference lines 94-196 from CreateJob.js */}

            <EmployeePool 
              jobData={jobData}
              onAssignEmployee={handleAssignEmployee}
              onUnassignEmployee={handleUnassignEmployee}
            />

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
                {isLoading ? 'Updating...' : 'Update Job'}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}

export default EditJob;