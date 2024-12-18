import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useJobs } from '../contexts/JobContext';
import { useAuth } from '../contexts/AuthContext';
import Navigation from '../components/Navigation';
import EmployeePool from '../components/EmployeePool';

function JobDetails() {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { jobs, setJobs } = useJobs();
  const [job, setJob] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedJob, setEditedJob] = useState(null);

  useEffect(() => {
    const foundJob = jobs.find(j => j.id === jobId);
    if (foundJob) {
      setJob(foundJob);
      setEditedJob(foundJob);
    }
  }, [jobId, jobs]);

  const handleSave = () => {
    const updatedJobs = jobs.map(j => 
      j.id === jobId ? editedJob : j
    );
    setJobs(updatedJobs);
    setJob(editedJob);
    setIsEditing(false);
  };

  const handleAssignEmployee = (employeeId, shift) => {
    const updatedJob = { ...editedJob };
    if (shift === 'day') {
      updatedJob.dayShift = [...(updatedJob.dayShift || []), employeeId];
    } else {
      updatedJob.nightShift = [...(updatedJob.nightShift || []), employeeId];
    }
    updatedJob.assignedEmployees = [...(updatedJob.assignedEmployees || []), employeeId];
    setEditedJob(updatedJob);
  };

  const handleUnassignEmployee = (employeeId) => {
    const updatedJob = { ...editedJob };
    updatedJob.dayShift = updatedJob.dayShift?.filter(id => id !== employeeId) || [];
    updatedJob.nightShift = updatedJob.nightShift?.filter(id => id !== employeeId) || [];
    updatedJob.assignedEmployees = updatedJob.assignedEmployees?.filter(id => id !== employeeId) || [];
    setEditedJob(updatedJob);
  };

  if (!job) {
    return (
      <div className="min-h-screen bg-gray-100">
        <Navigation />
        <main className="container mx-auto p-4">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-2xl font-bold mb-6">Job not found</h2>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Navigation />
      
      <main className="container mx-auto p-4">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Job Details</h2>
            <div className="space-x-4">
              {!isEditing ? (
                <>
                  <button
                    onClick={() => setIsEditing(true)}
                    className="px-4 py-2 bg-preferred-green text-white rounded hover:bg-preferred-green/90"
                  >
                    Edit Job
                  </button>
                  <button
                    onClick={() => navigate('/all-jobs')}
                    className="px-4 py-2 text-gray-600 hover:bg-gray-50 rounded border"
                  >
                    Back to Jobs
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={handleSave}
                    className="px-4 py-2 bg-preferred-green text-white rounded hover:bg-preferred-green/90"
                  >
                    Save Changes
                  </button>
                  <button
                    onClick={() => {
                      setIsEditing(false);
                      setEditedJob(job);
                    }}
                    className="px-4 py-2 text-gray-600 hover:bg-gray-50 rounded border"
                  >
                    Cancel
                  </button>
                </>
              )}
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold mb-2">Basic Information</h3>
              <div className="space-y-4">
                {isEditing ? (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Job Name
                      </label>
                      <input
                        type="text"
                        value={editedJob.name}
                        onChange={(e) => setEditedJob({ ...editedJob, name: e.target.value })}
                        className="w-full p-2 border rounded"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Job Number
                      </label>
                      <input
                        type="text"
                        value={editedJob.jobNumber}
                        onChange={(e) => setEditedJob({ ...editedJob, jobNumber: e.target.value })}
                        className="w-full p-2 border rounded"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Location
                      </label>
                      <input
                        type="text"
                        value={editedJob.location}
                        onChange={(e) => setEditedJob({ ...editedJob, location: e.target.value })}
                        className="w-full p-2 border rounded"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Status
                      </label>
                      <select
                        value={editedJob.status}
                        onChange={(e) => setEditedJob({ ...editedJob, status: e.target.value })}
                        className="w-full p-2 border rounded"
                      >
                        <option value="active">Active</option>
                        <option value="completed">Completed</option>
                        <option value="pending">Pending</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </div>
                  </>
                ) : (
                  <>
                    <p><span className="font-medium">Job Name:</span> {job.name}</p>
                    <p><span className="font-medium">Job Number:</span> {job.jobNumber}</p>
                    <p><span className="font-medium">Location:</span> {job.location}</p>
                    <p><span className="font-medium">Status:</span> {job.status}</p>
                  </>
                )}
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold mb-2">Dates</h3>
              <div className="space-y-4">
                {isEditing ? (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Start Date
                      </label>
                      <input
                        type="date"
                        value={editedJob.startDate.split('T')[0]}
                        onChange={(e) => setEditedJob({ ...editedJob, startDate: e.target.value })}
                        className="w-full p-2 border rounded"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        End Date
                      </label>
                      <input
                        type="date"
                        value={editedJob.endDate.split('T')[0]}
                        onChange={(e) => setEditedJob({ ...editedJob, endDate: e.target.value })}
                        className="w-full p-2 border rounded"
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <p>
                      <span className="font-medium">Start Date:</span>{' '}
                      {new Date(job.startDate).toLocaleDateString()}
                    </p>
                    <p>
                      <span className="font-medium">End Date:</span>{' '}
                      {new Date(job.endDate).toLocaleDateString()}
                    </p>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="mt-6">
            <h3 className="font-semibold mb-2">Description</h3>
            {isEditing ? (
              <textarea
                value={editedJob.description}
                onChange={(e) => setEditedJob({ ...editedJob, description: e.target.value })}
                className="w-full p-2 border rounded"
                rows="4"
              />
            ) : (
              <p className="text-gray-700">{job.description}</p>
            )}
          </div>

          <div className="mt-6">
            <h3 className="font-semibold mb-2">Employee Assignment</h3>
            <EmployeePool 
              jobData={isEditing ? editedJob : job}
              onAssignEmployee={handleAssignEmployee}
              onUnassignEmployee={handleUnassignEmployee}
            />
          </div>
        </div>
      </main>
    </div>
  );
}

export default JobDetails;