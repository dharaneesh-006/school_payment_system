import api from './api';

export const getSchools = async () => {
  const response = await api.get('/schools');
  return response.data;
};

export const addSchool = async (schoolData) => {
    const response = await api.post('/schools', schoolData); // Assumes a POST /schools endpoint
    return response.data;
}