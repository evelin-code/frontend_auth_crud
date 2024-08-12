import { ApiConfig } from '../utils/ApiConfig';

export const getAllEmployees = async () => {
  const token = localStorage.getItem('authToken');

  try {
    const response = await fetch(`${ApiConfig.API_BASE_URL}/employees`, {
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

export const createEmployee = async (employeeData) => {
  const token = localStorage.getItem('authToken');

  try {
    const response = await fetch(`${ApiConfig.API_BASE_URL}/employees`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(employeeData),
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
