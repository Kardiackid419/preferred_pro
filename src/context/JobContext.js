import React, { createContext, useContext, useState, useEffect } from 'react';
import { db } from '../firebase';
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
    { id: '3', name: 'Brett G.', shift: null },
    { id: '4', name: 'Codi W.', shift: null },
    { id: '5', name: 'John R.', shift: null },
    { id: '6', name: 'Mike V.', shift: null },
    { id: '7', name: 'Josh S.', shift: null },
    { id: '8', name: 'Zach B.', shift: null },
    { id: '9', name: 'David P.', shift: null },
    { id: '10', name: 'Brian H.', shift: null },
    { id: '11', name: 'Anthony P.', shift: null },
    { id: '12', name: 'Joe J.', shift: null },
    { id: '13', name: 'Kevin C.', shift: null },
    { id: '14', name: 'Tommy S.', shift: null },
    { id: '15', name: 'Bobby B.', shift: null },
    { id: '16', name: 'Zach Baker', shift: null },
    { id: '17', name: 'Mike L.', shift: null }
  ]);

  useEffect(() => {
    const loadJobs = async () => {
      const querySnapshot = await getDocs(collection(db, "jobs"));
      const jobsData = querySnapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id
      }));
      setJobs(jobsData);
    };
    loadJobs();
  }, []);

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

  const deleteJob = async (jobId) => {
    try {
      await deleteDoc(doc(db, "jobs", jobId));
      setJobs(jobs.filter(job => job.id !== jobId));
    } catch (error) {
      console.error("Error deleting job: ", error);
      throw error;
    }
  };

  const updateJob = async (jobId, updatedData) => {
    try {
      await updateDoc(doc(db, "jobs", jobId), {
        ...updatedData,
        dayShift: updatedData.dayShift || [],
        nightShift: updatedData.nightShift || [],
        assignedEmployees: updatedData.assignedEmployees || []
      });
      setJobs(prev => prev.map(job => 
        job.id === jobId ? { ...updatedData, id: jobId } : job
      ));
    } catch (error) {
      console.error("Error updating job:", error);
      throw error;
    }
  };

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

  const checkEmployeeAvailability = (employeeId, startDate, endDate, currentJobId = null) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    return !jobs.some(job => {
      if (job.id === currentJobId) return false;
      
      const jobStart = new Date(job.startDate);
      const jobEnd = new Date(job.endDate);
      
      const hasOverlap = (
        (start <= jobEnd && start >= jobStart) ||
        (end >= jobStart && end <= jobEnd) ||
        (start <= jobStart && end >= jobEnd)
      );
      
      return hasOverlap && job.assignedEmployees.includes(employeeId);
    });
  };

  const value = {
    jobs,
    setJobs,
    addJob,
    deleteJob,
    updateJob,
    employees,
    addEmployee,
    removeEmployee
  };

  return (
    <JobContext.Provider value={value}>
      {children}
    </JobContext.Provider>
  );
}