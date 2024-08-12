import { ApiConfig } from '../utils/ApiConfig';

export const getAllRequests = async () => {
  const token = localStorage.getItem('authToken');

  try {
    const response = await fetch(`${ApiConfig.API_BASE_URL}/request`, {
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

export const deleteRequest = async (id) => {
  const token = localStorage.getItem('authToken');

  try {
    const response = await fetch(`${ApiConfig.API_BASE_URL}/request/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Error en la solicitud de eliminación');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    return { message: error.message };
  }
};

export const createRequest = async (requestData) => {
  const token = localStorage.getItem('authToken');

  try {
    const response = await fetch(`${ApiConfig.API_BASE_URL}/request`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestData),
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