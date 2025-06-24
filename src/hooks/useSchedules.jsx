import { useState, useEffect, useCallback } from 'react';
import scheduleService from '../services/scheduleService'; // Import the schedule service

const useSchedules = () => {
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchMySchedules = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await scheduleService.getMySchedules();
      setSchedules(response.data);
    } catch (err) {
      console.error("Failed to fetch schedules:", err);
      setError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMySchedules();
  }, [fetchMySchedules]);

  const createSchedule = async (scheduleData) => {
    setIsCreating(true);
    setError(null);
    try {
      const response = await scheduleService.createSchedule(scheduleData);
      // Optionally add the new schedule to the state directly or refetch
      // For consistency and to ensure server-side state is reflected, refetch is safer
      await fetchMySchedules();
      return response.data; // Return the created schedule data if needed
    } catch (err) {
      console.error("Failed to create schedule:", err);
      setError(err);
      throw err; // Re-throw to allow component to handle specific UI for creation error
    } finally {
      setIsCreating(false);
    }
  };

  const updateSchedule = async (scheduleId, updatedScheduleData) => {
    setIsUpdating(true);
    setError(null);
    try {
      const response = await scheduleService.updateSchedule(scheduleId, updatedScheduleData);
      await fetchMySchedules(); // Refetch to ensure state consistency
      return response.data; // Return updated schedule data
    } catch (err) {
      console.error(`Failed to update schedule ${scheduleId}:`, err);
      setError(err);
      throw err;
    } finally {
      setIsUpdating(false);
    }
  };

  const deleteSchedule = async (scheduleId) => {
      setIsDeleting(true);
      setError(null);
      try {
        await scheduleService.deleteSchedule(scheduleId);
        // Optimistically remove from state or refetch
        // For simplicity and consistency with add/update, let's refetch
        await fetchMySchedules();
        return true;
      } catch (err) {
        console.error(`Failed to delete schedule ${scheduleId}:`, err);
        setError(err);
          throw err;
      } finally {
        setIsDeleting(false);
      }
  };

  return {
    schedules,
    loading,
    error,
    isCreating,
    isUpdating,
    isDeleting,
    fetchMySchedules, // For manual refresh
    createSchedule,
    updateSchedule,
    deleteSchedule,
  };
};

export default useSchedules;