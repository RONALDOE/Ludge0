import api from '@src/config/axios';

type Login = {
  username: string;
  password: string;
};

export const login = async (data: Login) => {
  try {
    const response = await api.post('/auth/login', { login: data });
    return response.data;
  } catch (error) {
    return null;
  }
};

export const logout = async () => {
  try {
    const response = await api.delete('/auth/logout');
    return response.data;
  } catch (error) {
    return null;
  }
};

export const getUsers = async () => {
  const response = await api('/users');
  return response.data;
};

export const getUserById = async (id: string) => {
  const response = await api(`/users/${id}`);
  return response.data;
};
