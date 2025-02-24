import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/tasks',
});

export const getTasks = async () => {
  const response = await API.get('/');
  return response.data;
};

export const createTask = async (task) => {
  const response = await API.post('/', task);
  return response.data;
};

export const markTaskAsDone = async (id) => {
  await API.patch(`/${id}/done`);
};
