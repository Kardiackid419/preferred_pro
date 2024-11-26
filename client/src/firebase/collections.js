import { collection, addDoc, getDocs } from 'firebase/firestore';
import { db } from './config';

export const jobsCollection = collection(db, 'jobs');

export const addJob = async (jobData) => {
  try {
    const docRef = await addDoc(jobsCollection, {
      ...jobData,
      createdAt: new Date().toISOString(),
    });
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error('Error adding job:', error);
    return { success: false, error: error.message };
  }
};

export const getJobs = async () => {
  try {
    const querySnapshot = await getDocs(jobsCollection);
    const jobs = [];
    querySnapshot.forEach((doc) => {
      jobs.push({ id: doc.id, ...doc.data() });
    });
    return jobs;
  } catch (error) {
    console.error('Error getting jobs:', error);
    return [];
  }
};