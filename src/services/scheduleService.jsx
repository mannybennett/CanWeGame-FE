import api from './api';

const scheduleService = {
  createSchedule: async (scheduleData) => {
    return await api.post('/Schedule', scheduleData);
  },
  getMySchedules: async () => {
    return await api.get('/Schedule/my');
  },
  getUserSchedules: async (userId) => {
    return await api.get(`/Schedule/user/${userId}`);
  },
  updateSchedule: async (scheduleId, updatedScheduleData) => {
    return await api.put(`/Schedule/${scheduleId}`, updatedScheduleData);
  },
  deleteSchedule: async (scheduleId) => {
    return await api.delete(`/Schedule/${scheduleId}`);
  },
};

export default scheduleService;