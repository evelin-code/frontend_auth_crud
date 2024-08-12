import React, { useState, useEffect } from 'react';
import './ModalRequest.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { getAllEmployees } from '../../services/EmployeesService';
import { createRequest } from '../../services/RequestsService';
import { toast } from 'react-toastify';

const ModalRequest = ({ isOpen, onClose, onSuccess }) => {
  const [employees, setEmployees] = useState([]);
  const [code, setCode] = useState('');
  const [description, setDescription] = useState('');
  const [summary, setSummary] = useState('');
  const [selectedEmployee, setSelectedEmployee] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (isOpen) {
      const loadEmployees = async () => {
        try {
          const data = await getAllEmployees();
          if (data.message === 'Empleados recuperados exitosamente') {
            setEmployees(data.employees);
          } else {
            setErrorMessage(data.message || 'Error al recuperar empleados');
          }
        } catch (error) {
          setErrorMessage(error.message || 'Error al recuperar empleados');
        }
      };
      loadEmployees();
    }
  }, [isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await createRequest({
        code,
        description,
        summary,
        employee_id: selectedEmployee,
      });

      if (response.request) {
        onSuccess();
        onClose();
        toast.success(response.message);
      } else {
        setErrorMessage(response.message || 'Error al crear solicitud');
      }
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="close-btn" onClick={onClose}>
          <FontAwesomeIcon icon={faTimes} />
        </button>
        <h2>Crear Solicitud</h2>
        {errorMessage && <p className="error-message">{errorMessage}</p>}
        <form onSubmit={handleSubmit}>
          <label>
            Empleado:
            <select
              value={selectedEmployee}
              onChange={(e) => setSelectedEmployee(e.target.value)}
              required
            >
              <option value="">Seleccione un empleado</option>
              {employees.map((employee) => (
                <option key={employee.id} value={employee.id}>
                  {employee.name}
                </option>
              ))}
            </select>
          </label>
          <label>
            Código:
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              required
            />
          </label>
          <label>
            Descripción:
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </label>
          <label>
            Resumen:
            <input
              type="text"
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              required
            />
          </label>
          <button type="submit" disabled={loading}>
            {loading ? <span className="spinner"></span> : 'Crear Solicitud'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ModalRequest;
