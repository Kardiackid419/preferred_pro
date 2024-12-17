import React, { useState, useEffect } from 'react';
import { db } from '../firebase/config';
import { collection, getDocs, doc, updateDoc, getDoc } from 'firebase/firestore';

function AdminTools() {
  const [users, setUsers] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch all users
        const usersSnapshot = await getDocs(collection(db, 'users'));
        const usersData = usersSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setUsers(usersData);

        // Fetch all employees
        const employeesSnapshot = await getDocs(collection(db, 'employees'));
        const employeesData = employeesSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setEmployees(employeesData);

        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const updateUserRole = async (userId, newRole) => {
    try {
      await updateDoc(doc(db, 'users', userId), {
        role: newRole
      });
      setUsers(users.map(user => 
        user.id === userId ? { ...user, role: newRole } : user
      ));
    } catch (error) {
      console.error('Error updating user role:', error);
    }
  };

  const assignUserToEmployee = async (userId, employeeId) => {
    try {
      // Update employee document with userId
      await updateDoc(doc(db, 'employees', employeeId), {
        userId: userId
      });
      // Update local state
      setEmployees(employees.map(emp => 
        emp.id === employeeId ? { ...emp, userId: userId } : emp
      ));
    } catch (error) {
      console.error('Error assigning user to employee:', error);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-6">Admin Tools</h2>
      
      {/* User Role Management */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-4">User Role Management</h3>
        <div className="bg-white shadow rounded-lg p-4">
          {users.map(user => (
            <div key={user.id} className="flex items-center justify-between py-2 border-b">
              <div>
                <p className="font-medium">{user.email}</p>
                <p className="text-sm text-gray-500">Current Role: {user.role || 'none'}</p>
              </div>
              <select
                value={user.role || ''}
                onChange={(e) => updateUserRole(user.id, e.target.value)}
                className="ml-4 p-2 border rounded"
              >
                <option value="">Select Role</option>
                <option value="admin">Admin</option>
                <option value="foreman">Foreman</option>
                <option value="crew">Crew</option>
              </select>
            </div>
          ))}
        </div>
      </div>

      {/* Employee-User Assignment */}
      <div>
        <h3 className="text-xl font-semibold mb-4">Employee-User Assignment</h3>
        <div className="bg-white shadow rounded-lg p-4">
          {employees.map(employee => (
            <div key={employee.id} className="flex items-center justify-between py-2 border-b">
              <div>
                <p className="font-medium">{employee.name}</p>
                <p className="text-sm text-gray-500">
                  Assigned User: {users.find(u => u.id === employee.userId)?.email || 'None'}
                </p>
              </div>
              <select
                value={employee.userId || ''}
                onChange={(e) => assignUserToEmployee(e.target.value, employee.id)}
                className="ml-4 p-2 border rounded"
              >
                <option value="">Select User</option>
                {users.map(user => (
                  <option key={user.id} value={user.id}>
                    {user.email}
                  </option>
                ))}
              </select>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default AdminTools; 