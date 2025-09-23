import api from './api';

export const getTransactions = async (params) => {
  const response = await api.get('/transactions', { params });
  return response.data;
};

export const checkTransactionStatus = async (custom_order_id) => {
  const response = await api.get('/check-status', { params: { custom_order_id } });
  return response.data;
};

export const getTransactionsBySchool = async (schoolId) => {
    const response = await api.get(`/transactions/school/${schoolId}`);
    return response.data;
};