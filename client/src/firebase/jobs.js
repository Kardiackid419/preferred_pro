export const assignEmployeeToJob = async (jobId, employeeId) => {
  try {
    // Update job assignments
    await setDoc(doc(db, 'jobAssignments', `${jobId}_${employeeId}`), {
      jobId,
      employeeId,
      assignedAt: new Date().toISOString(),
      status: 'active'
    });

    // Create notification
    await createNotification(employeeId, jobId, 'JOB_ASSIGNMENT');

    return true;
  } catch (error) {
    console.error('Error assigning employee to job:', error);
    throw error;
  }
}; 