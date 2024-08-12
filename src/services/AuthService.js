import { ApiConfig } from '../utils/ApiConfig';

const TOKEN_KEY = 'authToken';
const ROL_ID_KEY = 'rolId';
const EXPIRATION_KEY = 'tokenExpiration';

export const saveAuthData = (token, rolId) => {
  const expirationTime = new Date().getTime() + 60 * 60 * 1000;

  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(ROL_ID_KEY, rolId);
  localStorage.setItem(EXPIRATION_KEY, expirationTime);
};

export const getAuthToken = () => {
  const token = localStorage.getItem(TOKEN_KEY);
  const expirationTime = localStorage.getItem(EXPIRATION_KEY);

  if (token && expirationTime && new Date().getTime() < expirationTime) {
    return token;
  } else {
    clearAuthData();
    return null;
  }
};

export const getRolId = () => {
  return localStorage.getItem(ROL_ID_KEY);
};

export const clearAuthData = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(ROL_ID_KEY);
  localStorage.removeItem(EXPIRATION_KEY);
};

export const isAuthenticated = () => {
  return getAuthToken() !== null;
};

export const signup = async (username, email, password) => {
  try {
    const response = await fetch(`${ApiConfig.API_BASE_URL}/auth/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, email, password }),
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
};

export const signin = async (email, password) => {
  try {
    const response = await fetch(`${ApiConfig.API_BASE_URL}/auth/signin`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error durante el inicio de sesión:', error);
    throw error;
  }
};
