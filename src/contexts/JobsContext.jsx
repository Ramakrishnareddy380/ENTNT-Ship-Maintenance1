import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  getJobs, 
  getJobsByShipId,
  getJobsByComponentId,
  getJobsForDate,
  addJob, 
  updateJob, 
  deleteJob 
} from '../utils/localStorageUtils';

/**
 * @typedef {Object} JobsContextType
 * @property {import('../types').Job[]} jobs
 * @property {boolean} loading
 * @property {string|null} error
 * @property {function(string): import('../types').Job[]} getJobsByShipId
 * @property {function(string): import('../types').Job[]} getJobsByComponentId
 * @property {function(string): import('../types').Job[]} getJobsForDate
 * @property {function(import('../types').Job): Promise<import('../types').Job>} addJob
 * @property {function(import('../types').Job): Promise<import('../types').Job>} updateJob
 * @property {function(string): Promise<void>} deleteJob
 * @property {function(): void} refreshJobs
 */

const JobsContext = createContext(undefined);

/**
 * Provider component for jobs context
 * @param {Object} props
 * @param {React.ReactNode} props.children
 */
export const JobsProvider = ({ children }) => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load jobs
  useEffect(() => {
    const loadJobs = async () => {
      try {
        const jobData = getJobs();
        setJobs(jobData);
      } catch (err) {
        setError('Failed to load jobs');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadJobs();
  }, []);

  // Get jobs by ship ID
  const getJobsByShipIdHandler = (shipId) => {
    return getJobsByShipId(shipId);
  };

  // Get jobs by component ID
  const getJobsByComponentIdHandler = (componentId) => {
    return getJobsByComponentId(componentId);
  };

  // Get jobs for a specific date
  const getJobsForDateHandler = (date) => {
    return getJobsForDate(date);
  };

  // Add a new job
  const addJobHandler = async (jobData) => {
    setLoading(true);
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const newJob = addJob(jobData);
      setJobs(prevJobs => [...prevJobs, newJob]);
      return newJob;
    } catch (err) {
      setError('Failed to add job');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Update an existing job
  const updateJobHandler = async (jobData) => {
    setLoading(true);
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const updatedJob = updateJob(jobData);
      setJobs(prevJobs => 
        prevJobs.map(job => job.id === updatedJob.id ? updatedJob : job)
      );
      return updatedJob;
    } catch (err) {
      setError('Failed to update job');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Delete a job
  const deleteJobHandler = async (id) => {
    setLoading(true);
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      deleteJob(id);
      setJobs(prevJobs => prevJobs.filter(job => job.id !== id));
    } catch (err) {
      setError('Failed to delete job');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Refresh jobs data
  const refreshJobs = () => {
    try {
      const jobData = getJobs();
      setJobs(jobData);
    } catch (err) {
      setError('Failed to refresh jobs');
      console.error(err);
    }
  };

  return (
    <JobsContext.Provider value={{
      jobs,
      loading,
      error,
      getJobsByShipId: getJobsByShipIdHandler,
      getJobsByComponentId: getJobsByComponentIdHandler,
      getJobsForDate: getJobsForDateHandler,
      addJob: addJobHandler,
      updateJob: updateJobHandler,
      deleteJob: deleteJobHandler,
      refreshJobs
    }}>
      {children}
    </JobsContext.Provider>
  );
};

/**
 * Hook to use the jobs context
 * @returns {JobsContextType}
 */
export const useJobs = () => {
  const context = useContext(JobsContext);
  if (context === undefined) {
    throw new Error('useJobs must be used within a JobsProvider');
  }
  return context;
}; 