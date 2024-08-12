import React, { useState, useEffect } from 'react';
import { getRolId, isAuthenticated } from '../../services/AuthService';
import './Panel.css';
import { toast } from 'react-toastify';
import { getAllEmployees } from '../../services/EmployeesService';
import { getAllRequests, deleteRequest } from '../../services/RequestsService.js';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import ModalRequest from './../ModalRequest/ModalRequest.jsx';
import ModalEmployee from './../ModalEmployee/ModalEmployee.jsx';

const Panel = () => {
  const [authStatus, setAuthStatus] = useState(isAuthenticated());
  const [rolId, setRolId] = useState(getRolId());
  const [selectedOption, setSelectedOption] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalRequestOpen, setIsModalRequestOpen] = useState(false);
  const [isModalEmployeeOpen, setIsModalEmployeeOpen] = useState(false);

  useEffect(() => {
    const checkAuth = () => {
      const isAuth = isAuthenticated();
      setAuthStatus(isAuth);
      if (isAuth) {
        setRolId(getRolId());
      }
    };

    checkAuth();
    const intervalId = setInterval(checkAuth, 1000);

    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    if (selectedOption === 'employees') {
      const loadEmployees = async () => {
        setLoading(true);
        try {
          const data = await getAllEmployees();
          if (data.message === 'Empleados recuperados exitosamente') {
            setEmployees(data.employees);
          } else {
            setEmployees([]);
            toast.error(data.message || 'No se pudieron recuperar los empleados');
          }
        } catch (error) {
          setEmployees([]);
          toast.error(error.message || 'Error al recuperar empleados');
        } finally {
          setLoading(false);
        }
      };
      loadEmployees();
    } else {
      setEmployees([]);
    }
  }, [selectedOption]);

  useEffect(() => {
    if (selectedOption === 'requests') {
      const loadRequests = async () => {
        setLoading(true);
        try {
          const data = await getAllRequests();
          if (data.message === 'Solicitudes encontradas exitosamente') {
            setRequests(data.requests);
          } else {
            setRequests([]);
            toast.error(data.message || 'No se pudieron recuperar las solicitudes');
          }
        } catch (error) {
          setRequests([]);
          toast.error(error.message || 'Error al recuperar solicitudes');
        } finally {
          setLoading(false);
        }
      };
      loadRequests();
    } else {
      setRequests([]);
    }
  }, [selectedOption]);

  if (!authStatus) {
    return null;
  }

  const handleDeleteRequest = async (id) => {
    try {
      setLoading(true);
      const response = await deleteRequest(id);
      if (response.message === 'Solicitud eliminada exitosamente') {
        setRequests(requests.filter(request => request.id !== id));
        toast.success('Solicitud eliminada exitosamente');
      } else {
        toast.error(response.message || 'No se pudo eliminar la solicitud');
      }
    } catch (error) {
      toast.error(error.message || 'Error al eliminar la solicitud');
    } finally {
      setLoading(false);
    }
  };

  const refreshEmployees = async () => {
    try {
      const data = await getAllEmployees();
      if (data.message === 'Empleados recuperados exitosamente') {
        setEmployees(data.employees);
      } else {
        toast.error(data.message || 'No se pudieron recuperar los empleados');
      }
    } catch (error) {
      toast.error(error.message || 'Error al recuperar empleados');
    }
  };

  const refreshRequests = async () => {
    try {
      const data = await getAllRequests();
      if (data.message === 'Solicitudes encontradas exitosamente') {
        setRequests(data.requests);
      } else {
        toast.error(data.message || 'No se pudieron recuperar las solicitudes');
      }
    } catch (error) {
      toast.error(error.message || 'Error al recuperar solicitudes');
    }
  };

  return (
    <div className="panel">
      <div className="menu">
        <h2>¡Bienvenido Querido {rolId === '1' ? 'Empleado' : 'Administrador'}!</h2>
        <div className="menu-items">
          <div className="menu-item" onClick={() => setSelectedOption('requests')}>
            <h3>Solicitudes</h3>
          </div>
          <div className="menu-item" onClick={() => setSelectedOption('employees')}>
            <h3>Empleados</h3>
          </div>
        </div>
      </div>
      {loading && (
        <div className="spinner-container">
          <div className="spinner"></div>
        </div>
      )}
      {selectedOption === 'employees' && employees.length > 0 && !loading && (
        <div className="employees-container">
          <h3>Empleados</h3>
          <div className="create-button-container">
            <button className="create-button" onClick={() => setIsModalEmployeeOpen(true)}>
              Crear Empleado
            </button>
          </div>
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Fecha de Entrada</th>
                <th>Salario</th>
              </tr>
            </thead>
            <tbody>
              {employees.map(employee => (
                <tr key={employee.id}>
                  <td>{employee.id}</td>
                  <td>{employee.name}</td>
                  <td>{employee.date_entry}</td>
                  <td>{employee.salary}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {selectedOption === 'requests' && requests.length > 0 && !loading && (
        <div className="requests-container">
          <h3>Solicitudes</h3>
          <div className="create-button-container">
            <button className="create-button" onClick={() => setIsModalRequestOpen(true)}>
              Crear Solicitud
            </button>
          </div>
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Código</th>
                <th>Descripción</th>
                <th>Resumen</th>
                <th>Empleado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {requests.map(request => (
                <tr key={request.id}>
                  <td>{request.id}</td>
                  <td>{request.code}</td>
                  <td>{request.description}</td>
                  <td>{request.summary}</td>
                  <td>{request.employee.name}</td>
                  <td>
                    <FontAwesomeIcon
                      icon={faTrash}
                      className="delete-icon"
                      onClick={() => handleDeleteRequest(request.id)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
     {isModalRequestOpen && (
        <ModalRequest
          isOpen={isModalRequestOpen}
          onClose={() => setIsModalRequestOpen(false)}
          onSuccess={refreshRequests}
        />
      )}
      {isModalEmployeeOpen && (
        <ModalEmployee
          isOpen={isModalEmployeeOpen}
          onClose={() => setIsModalEmployeeOpen(false)}
          onSuccess={refreshEmployees}
        />
      )}
    </div>
  );
};

export default Panel;
