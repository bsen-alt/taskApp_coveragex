import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/tasks',
});

export const getTasks = async (search = '') => {
  console.log("Fetching Tasks with Search:", search); // Debugging log
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



