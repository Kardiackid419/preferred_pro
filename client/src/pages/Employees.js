import React, { useState, useEffect } from 'react';
import { db } from '../firebase/config';
import { collection, getDocs, updateDoc, doc } from 'firebase/firestore';
import EmployeePool from '../components/EmployeePool';

function Employees() {
  const [employees, setEmployees] = useState([]);
  const [unassignedUsers, setUnassignedUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsersAndEmployees = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'users'));
        const allUsers = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          assigned: false
        }));

        const employeesList = allUsers.filter(user => user.role === 'crew');
        setEmployees(employeesList);
        
        const unassigned = allUsers.filter(user => !user.role || user.role === 'default');
        setUnassignedUsers(unassigned);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsersAndEmployees();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Employee Management</h1>
      
      {/* Employee Pool Component */}
      <div className="mb-8">
        <h2 className="text-xl font-bold mb-4">Employee Pool</h2>
        <EmployeePool employees={employees} />
      </div>

      {/* Unassigned Users Section */}
      <div className="mb-8">
        <h2 className="text-xl font-bold mb-4">Available Users</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {unassignedUsers.map(user => (
            <div 
              key={user.id} 
              className="bg-white rounded-lg shadow-md p-4"
            >
              <h3 className="text-lg font-semibold">{user.email}</h3>
              <p className="text-gray-600">
                Signed up: {new Date(user.createdAt?.seconds * 1000).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
        {unassignedUsers.length === 0 && (
          <p className="text-center text-gray-500">No unassigned users found.</p>
        )}
      </div>
    </div>
  );
}

export default Employees;