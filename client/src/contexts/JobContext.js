import React, { createContext, useContext, useState, useEffect } from 'react';
import { db } from '../firebase/config';
import { collection, addDoc, getDocs, query, deleteDoc, doc, updateDoc, serverTimestamp } from 'firebase/firestore';

const JobContext = createContext();

export function useJobs() {
  return useContext(JobContext);
}

export function JobProvider({ children }) {
  const [jobs, setJobs] = useState([]);
  const [employees, setEmployees] = useState([
    { id: '1', name: 'Jim E.', shift: null },
    { id: '2', name: 'Noah S.', shift: null },
    // ... rest of your employees
  ]);

  useEffect(() => {
    const loadJobs = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "jobs"));
        const jobsData = querySnapshot.docs.map(doc => {
          const data = doc.data();
          return {
            ...data,
            id: doc.id,
            startDate: data.startDate?.toDate() || new Date(data.startDate),
            endDate: data.endDate?.toDate() || new Date(data.endDate)
          };
        });
        console.log('Loaded jobs:', jobsData);
        setJobs(jobsData);
      } catch (error) {
        console.error("Error loading jobs:", error);
      }
    };
    loadJobs();
  }, []);

  // Add employee functions
  const addEmployee = async (employeeData) => {
    try {
      const newEmployee = {
        id: Date.now().toString(),
        name: employeeData.name,
        shift: null
      };
      setEmployees(prev => [...prev, newEmployee]);
      return newEmployee;
    } catch (error) {
      console.error("Error adding employee: ", error);
      throw error;
    }
  };

  const removeEmployee = async (employeeId) => {
    try {
      setEmployees(prev => prev.filter(emp => emp.id !== employeeId));
    } catch (error) {
      console.error("Error removing employee: ", error);
      throw error;
    }
  };

  // Your existing job functions
  const updateJob = async (jobId, updatedData) => {
    try {
      await updateDoc(doc(db, "jobs", jobId), {
        ...updatedData,
        updatedAt: serverTimestamp()
      });
      setJobs(prev => prev.map(job => 
        job.id === jobId ? { ...job, ...updatedData } : job
      ));
    } catch (error) {
      console.error("Error updating job:", error);
      throw error;
    }
  };

  const deleteJob = async (jobId) => {
    try {
      await deleteDoc(doc(db, "jobs", jobId));
      setJobs(jobs.filter(job => job.id !== jobId));
    } catch (error) {
      console.error("Error deleting job: ", error);
      throw error;
    }
  };

  const addJob = async (jobData) => {
    try {
      const docRef = await addDoc(collection(db, "jobs"), {
        ...jobData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      
      const newJob = {
        ...jobData,
        id: docRef.id
      };
      
      setJobs(prev => [...prev, newJob]);
      return docRef.id;
    } catch (error) {
      console.error("Error adding job:", error);
      throw error;
    }
  };

  // Include all functions in the value object
  const value = {
    jobs,
    setJobs,
    addJob,
    deleteJob,
    updateJob,
    employees,
    addEmployee,    // Add these two
    removeEmployee  // employee functions
  };

  return (
    <JobContext.Provider value={value}>
      {children}
    </JobContext.Provider>
  );
}