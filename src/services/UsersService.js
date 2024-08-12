import { ApiConfig } from '../utils/ApiConfig';

export const getAllUsers = async () => {
  const token = localStorage.getItem('authToken');

  try {
    const response = await fetch(`${ApiConfig.API_BASE_URL}/users`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Error en la solicitud');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    return { message: error.message };
  }
};