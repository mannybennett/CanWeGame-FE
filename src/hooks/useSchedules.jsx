import { useContext } from 'react';
import { ScheduleContext } from '../context/ScheduleContext.jsx'; // Import the ScheduleContext

/**
 * Custom hook to access gaming schedule data and actions from the ScheduleContext.
 * This hook simplifies consuming the ScheduleContext, making components cleaner.
 *
 * @returns {object} An object containing schedule data, loading/error states,
 * and functions to interact with schedules (create, update, delete, fetch).
 */
const useSchedules = () => {
    // Use useContext to get the value provided by the ScheduleContext.Provider
    const context = useContext(ScheduleContext);

    // Optional: Add a check to ensure the hook is used within a Provider
    if (context === undefined) {
        throw new Error('useSchedules must be used within a ScheduleProvider');
    }

    // Return all the values that the ScheduleContext.Provider makes available
    return context;
};

export default useSchedules;