import React, { useState } from 'react';
import Navigation from '../components/Navigation';
import { useJobs } from '../context/JobContext';

function Employees() {
  const { employees, addEmployee, removeEmployee } = useJobs();
  const [newEmployeeName, setNewEmployeeName] = useState('');
  const [error, setError] = useState('');

  const handleAddEmployee = async (e) => {
    e.preventDefault();
    if (newEmployeeName.length < 2) {
      setError('Employee name must be at least 2 characters');
      return;
    }
    try {
      await addEmployee({ name: newEmployeeName });
      setNewEmployeeName('');
      setError('');
    } catch (err) {
      setError('Failed to add employee');
    }
  };

  const handleRemoveEmployee = async (employeeId) => {
    if (window.confirm('Are you sure you want to remove this employee?')) {
      try {
        await removeEmployee(employeeId);
      } catch (err) {
        setError('Failed to remove employee');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navigation />
      <main className="container mx-auto p-4">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-bold mb-6">Manage Employees</h2>
          
          <form onSubmit={handleAddEmployee} className="mb-8">
            <div className="flex gap-4">
              <input
                type="text"
                value={newEmployeeName}
                onChange={(e) => setNewEmployeeName(e.target.value)}
                placeholder="Enter employee name"
                className="flex-1 p-2 border rounded focus:ring-preferred-green focus:border-preferred-green"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-preferred-green text-white rounded hover:bg-preferred-green/90"
              >
                Add Employee
              </button>
            </div>
            {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
          </form>


          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {employees.map(employee => (
              <div 
                key={employee.id}
                className="flex justify-between items-center p-3 border rounded hover:bg-gray-50"
              >
                <span>{employee.name}</span>
                <button
                  onClick={() => handleRemoveEmployee(employee.id)}
                  className="text-red-600 hover:text-red-800"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

export default Employees;