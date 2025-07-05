// src/context/ScheduleContext.jsx
import { createContext, useState, useEffect, useCallback, useContext } from 'react';
import scheduleService from '../services/scheduleService'; // Import your schedule service
import { AuthContext } from './AuthContext'; // To potentially trigger re-fetch on auth changes, or use userId

// Create the Schedule Context
const ScheduleContext = createContext();

// Schedule Provider Component
const ScheduleProvider = ({ children }) => {
    // State for the list of schedules
    const [schedules, setSchedules] = useState([]);

    // States for loading and error handling for different operations
    const [loadingSchedules, setLoadingSchedules] = useState(true);
    const [schedulesError, setSchedulesError] = useState(null);
    const [isCreatingSchedule, setIsCreatingSchedule] = useState(false);
    const [isUpdatingSchedule, setIsUpdatingSchedule] = useState(false);
    const [isDeletingSchedule, setIsDeletingSchedule] = useState(false);

    // Access authentication context (optional, but good for linking data to logged-in user)
    const { isAuthenticated, user } = useContext(AuthContext);

    // --- Data Fetching ---
    // useCallback memoizes the fetch function to prevent unnecessary re-creations
    // which helps with useEffect dependencies and performance.
    const fetchMySchedules = useCallback(async () => {
        if (!isAuthenticated) {
            // If not authenticated, clear schedules and stop loading
            setSchedules([]);
            setLoadingSchedules(false);
            return;
        }

        setLoadingSchedules(true);
        setSchedulesError(null); // Clear any previous errors
        try {
            const response = await scheduleService.getMySchedules();
            setSchedules(response.data); // Assuming response.data is the array of schedules
        } catch (err) {
            console.error("Failed to fetch schedules:", err);
            setSchedulesError(err);
        } finally {
            setLoadingSchedules(false);
        }
    }, [isAuthenticated]); // Re-run if authentication status changes

    // Fetch schedules when the component mounts or isAuthenticated status changes
    useEffect(() => {
        fetchMySchedules();
    }, [fetchMySchedules]);


    // --- CRUD Operations ---

    /**
     * Creates a new gaming schedule.
     * @param {object} scheduleData - The data for the new schedule (StartTime, EndTime, DaysOfWeek).
     * @returns {Promise<object|boolean>} The created schedule object on success, or false on failure.
     */
    const createSchedule = async (scheduleData) => {
        setIsCreatingSchedule(true);
        setSchedulesError(null);
        try {
            const response = await scheduleService.createSchedule(scheduleData);
            // After successful creation, re-fetch the list to ensure data consistency
            await fetchMySchedules();
            return response.data; // Return the newly created schedule data
        } catch (err) {
            console.error("Failed to create schedule:", err);
            setSchedulesError(err);
            throw err; // Re-throw to allow component to handle specific UI for creation error
        } finally {
            setIsCreatingSchedule(false);
        }
    };

    /**
     * Updates an existing gaming schedule.
     * @param {string} scheduleId - The ID of the schedule to update.
     * @param {object} updatedScheduleData - The updated data for the schedule.
     * @returns {Promise<object|boolean>} The updated schedule object on success, or false on failure.
     */
    const updateSchedule = async (scheduleId, updatedScheduleData) => {
        setIsUpdatingSchedule(true);
        setSchedulesError(null);
        try {
            const response = await scheduleService.updateSchedule(scheduleId, updatedScheduleData);
            // Re-fetch to ensure state consistency after update
            await fetchMySchedules();
            return response.data; // Return updated schedule data
        } catch (err) {
            console.error(`Failed to update schedule ${scheduleId}:`, err);
            setSchedulesError(err);
            throw err;
        } finally {
            setIsUpdatingSchedule(false);
        }
    };

    /**
     * Deletes a gaming schedule.
     * @param {string} scheduleId - The ID of the schedule to delete.
     * @returns {Promise<boolean>} True on success, false on failure.
     */
    const deleteSchedule = async (scheduleId) => {
        setIsDeletingSchedule(true);
        setSchedulesError(null);
        try {
            await scheduleService.deleteSchedule(scheduleId);
            // Re-fetch to update the list after deletion
            await fetchMySchedules();
            return true;
        } catch (err) {
            console.error(`Failed to delete schedule ${scheduleId}:`, err);
            setSchedulesError(err);
            throw err;
        } finally {
            setIsDeletingSchedule(false);
        }
    };

    // The value provided to consumers of this context
    const contextValue = {
        schedules,
        loadingSchedules,
        schedulesError,
        isCreatingSchedule,
        isUpdatingSchedule,
        isDeletingSchedule,
        fetchMySchedules, // Allow components to manually trigger a re-fetch
        createSchedule,
        updateSchedule,
        deleteSchedule,
    };

    return (
        <ScheduleContext.Provider value={contextValue}>
            {children}
        </ScheduleContext.Provider>
    );
};

export { ScheduleContext, ScheduleProvider };