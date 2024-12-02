import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useJobs } from '../context/JobContext';
import { useAuth } from '../context/AuthContext';
import Navigation from '../components/Navigation';
import EmployeePool from '../components/EmployeePool';
import { DragDropContext } from 'react-beautiful-dnd';
import { Button } from '../components/shared/Button';
import { Input, TextArea } from '../components/shared/Input';

const colorOptions = [
  { name: 'Green', value: 'bg-green-200 border-green-500', sample: 'bg-green-200' },
  { name: 'Blue', value: 'bg-blue-200 border-blue-500', sample: 'bg-blue-200' },
  { name: 'Red', value: 'bg-red-200 border-red-500', sample: 'bg-red-200' },
  { name: 'Yellow', value: 'bg-yellow-200 border-yellow-500', sample: 'bg-yellow-200' },
  { name: 'Purple', value: 'bg-purple-200 border-purple-500', sample: 'bg-purple-200' },
  { name: 'Pink', value: 'bg-pink-200 border-pink-500', sample: 'bg-pink-200' },
  { name: 'Orange', value: 'bg-orange-200 border-orange-500', sample: 'bg-orange-200' },
  { name: 'Gray', value: 'bg-gray-200 border-gray-500', sample: 'bg-gray-200' },
];

const jobColors = [
  { name: 'Green', color: '#D1FAE5' },
  { name: 'Blue', color: '#DBEAFE' },
  { name: 'Red', color: '#FEE2E2' },
  { name: 'Yellow', color: '#FEF3C7' },
  { name: 'Purple', color: '#EDE9FE' },
  { name: 'Orange', color: '#FFEDD5' },
  { name: 'Gray', color: '#F3F4F6' },
  { name: 'Teal', color: '#CCFBF1' },
  { name: 'Pink', color: '#FCE7F3' },
  { name: 'Lime', color: '#ECFCCB' },
  { name: 'Sky Blue', color: '#BAE6FD' },
  { name: 'Amber', color: '#FEF3C7' }
];

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
    nightShift: [],
    color: colorOptions[0].value,
    jobColor: jobColors[0].color,
  });

  useEffect(() => {
    const job = jobs.find(j => j.id === jobId);
    if (job) {
      setJobData({
        ...job,
        startDate: new Date(job.startDate).toISOString().split('T')[0],
        endDate: new Date(job.endDate).toISOString().split('T')[0],
        dayShift: job.dayShift || [],
        nightShift: job.nightShift || [],
        assignedEmployees: job.assignedEmployees || [],
        color: job.color || colorOptions[0].value,
        jobColor: job.jobColor || jobColors[0].color,
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
            <Button
              variant="danger"
              onClick={handleDelete}
            >
              Delete Job
            </Button>
          </div>

          <form onSubmit={handleUpdate} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
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

            <EmployeePool 
              jobData={jobData}
              onAssignEmployee={handleAssignEmployee}
              onUnassignEmployee={handleUnassignEmployee}
            />

            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Job Color
              </label>
              <select
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                value={jobData.jobColor}
                onChange={(e) => setJobData({ ...jobData, jobColor: e.target.value })}
              >
                {jobColors.map((color) => (
                  <option 
                    key={color.name} 
                    value={color.color}
                    style={{ backgroundColor: color.color }}
                  >
                    {color.name}
                  </option>
                ))}
              </select>
              
              <div className="mt-2 flex gap-2">
                {jobColors.map((color) => (
                  <div
                    key={color.name}
                    className="w-6 h-6 rounded cursor-pointer"
                    style={{ 
                      backgroundColor: color.color,
                      border: jobData.jobColor === color.color ? '2px solid black' : '1px solid gray'
                    }}
                    onClick={() => setJobData({ ...jobData, jobColor: color.color })}
                    title={color.name}
                  />
                ))}
              </div>
            </div>

            <div className="flex justify-end space-x-4">
              <Button
                type="button"
                variant="secondary"
                onClick={() => navigate('/schedule')}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isLoading}
              >
                {isLoading ? 'Updating...' : 'Update Job'}
              </Button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}

export default EditJob;