import { createContext, useState, useEffect, useCallback, useContext } from 'react';
import scheduleService from '../services/scheduleService';
import { AuthContext } from './AuthContext'; // Import AuthContext to get user and friends data

const ScheduleContext = createContext();

const ScheduleProvider = ({ children }) => {
    const [mySchedules, setMySchedules] = useState([]);
    const [friendSchedules, setFriendSchedules] = useState([]);

    // States for loading and error handling
    const [loadingMySchedules, setLoadingMySchedules] = useState(true);
    const [loadingFriendSchedules, setLoadingFriendSchedules] = useState(true);
    const [schedulesError, setSchedulesError] = useState(null); // General error for all schedules
    const [isCreatingSchedule, setIsCreatingSchedule] = useState(false);
    const [isUpdatingSchedule, setIsUpdatingSchedule] = useState(false);
    const [isDeletingSchedule, setIsDeletingSchedule] = useState(false);

    // Access authentication context to get the current user object and their friends
    const { isAuthenticated, user } = useContext(AuthContext);

    // --- Data Fetching ---

    // Function to fetch the current user's schedules
    const fetchMySchedules = useCallback(async () => {
        if (!isAuthenticated) {
            setMySchedules([]);
            setLoadingMySchedules(false);
            return;
        }

        setLoadingMySchedules(true);
        setSchedulesError(null);
        try {
            const response = await scheduleService.getMySchedules();
            setMySchedules(response.data);
        } catch (err) {
            console.error("Failed to fetch my schedules:", err);
            setSchedulesError(err);
        } finally {
            setLoadingMySchedules(false);
        }
    }, [isAuthenticated]);

    // Function to fetch the schedules of the current user's friends
    const fetchFriendSchedules = useCallback(async () => {
        if (!isAuthenticated || !user || !user.friends || user.friends.length === 0) {
            setFriendSchedules([]);
            setLoadingFriendSchedules(false);
            return;
        }

        setLoadingFriendSchedules(true);
        setSchedulesError(null);
        try {
            const allFriendsSchedules = await Promise.all(
                user.friends.map(friend => scheduleService.getUserSchedules(friend.id))
            );
            // Flatten the array of arrays and set the state
            const mergedSchedules = allFriendsSchedules.flatMap(response => response.data);
            setFriendSchedules(mergedSchedules);
        } catch (err) {
            console.error("Failed to fetch friends' schedules:", err);
            setSchedulesError(err);
        } finally {
            setLoadingFriendSchedules(false);
        }
    }, [isAuthenticated, user]);

    // Combined useEffect to fetch both sets of schedules on mount or auth change
    useEffect(() => {
        fetchMySchedules();
        fetchFriendSchedules();
    }, [fetchMySchedules, fetchFriendSchedules]);


    // --- CRUD Operations ---
    // These functions will now affect 'mySchedules' and will trigger a re-fetch of 'mySchedules'
    const createSchedule = async (scheduleData) => {
        setIsCreatingSchedule(true);
        setSchedulesError(null);
        try {
            const response = await scheduleService.createSchedule(scheduleData);
            await fetchMySchedules(); // Re-fetch the user's schedules
            return response.data;
        } catch (err) {
            console.error("Failed to create schedule:", err);
            setSchedulesError(err);
            throw err;
        } finally {
            setIsCreatingSchedule(false);
        }
    };

    const updateSchedule = async (scheduleId, updatedScheduleData) => {
        setIsUpdatingSchedule(true);
        setSchedulesError(null);
        try {
            const response = await scheduleService.updateSchedule(scheduleId, updatedScheduleData);
            await fetchMySchedules(); // Re-fetch the user's schedules
            return response.data;
        } catch (err) {
            console.error(`Failed to update schedule ${scheduleId}:`, err);
            setSchedulesError(err);
            throw err;
        } finally {
            setIsUpdatingSchedule(false);
        }
    };

    const deleteSchedule = async (scheduleId) => {
        setIsDeletingSchedule(true);
        setSchedulesError(null);
        try {
            await scheduleService.deleteSchedule(scheduleId);
            await fetchMySchedules(); // Re-fetch the user's schedules
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
        mySchedules,
        friendSchedules,
        loadingMySchedules,
        loadingFriendSchedules,
        schedulesError,
        isCreatingSchedule,
        isUpdatingSchedule,
        isDeletingSchedule,
        fetchMySchedules,
        fetchFriendSchedules, // Expose this for manual re-fetch if needed
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