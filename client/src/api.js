import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/tasks',
});

export const getTasks = async (search = '') => {
  const response = await API.get('/', { params: { search } });
  return response.data;
};

export const createTask = async (task) => {
  const response = await API.post('/', task);
  return response.data;
};

export const updateTask = async (id, updatedData) => {
  const response = await API.put(`/${id}`, updatedData);
  return response.data;
};

export const markTaskAsDone = async (id) => {
  await API.patch(`/${id}/done`);
};

export const deleteTask = async (id) => {
  const response = await API.delete(`/${id}`);
  return response.data;
};

export const updateTaskStatus = async (id, status_id) => {
  const response = await API.patch(`/${id}/status`, { status_id });
  return response.data;
};



