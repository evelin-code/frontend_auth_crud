import React, { useState, useEffect } from 'react';
import './ModalEmployee.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { getAllUsers } from '../../services/UsersService';
import { createEmployee } from '../../services/EmployeesService';
import { toast } from 'react-toastify';

const ModalEmployee = ({ isOpen, onClose, onSuccess }) => {
  const [users, setUsers] = useState([]);
  const [dateEntry, setDateEntry] = useState('');
  const [name, setName] = useState('');
  const [salary, setSalary] = useState('');
  const [selectedUser, setSelectedUser] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const loadUsers = async () => {
        try {
          const data = await getAllUsers();
          if (data.message === 'Usuarios recuperados exitosamente') {
            setUsers(data.users);
          } else {
            setErrorMessage(data.message || 'Error al recuperar usuarios');
          }
        } catch (error) {
          setErrorMessage(error.message || 'Error al recuperar usuarios');
        }
      };
      loadUsers();
    }
  }, [isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await createEmployee({
        date_entry: dateEntry,
        name,
        salary,
        user_id: selectedUser,
      });
      if (response.employee) {
        onSuccess();
        onClose();
        toast.success(response.message);
      } else {
        setErrorMessage(response.message || 'Error al crear empleado');
      }
    } catch (error) {
      setErrorMessage(error.message || 'Error al crear empleado');
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
        <h2>Crear Empleado</h2>
        {errorMessage && <p className="error-message">{errorMessage}</p>}
        <form onSubmit={handleSubmit}>
          <label>
            Usuario:
            <select
              value={selectedUser}
              onChange={(e) => setSelectedUser(e.target.value)}
              required
            >
              <option value="">Seleccione un usuario</option>
              {users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.username}
                </option>
              ))}
            </select>
          </label>
          <label>
            Nombre:
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </label>
          <label>
            Fecha de Ingreso:
            <input
              type="date"
              value={dateEntry}
              onChange={(e) => setDateEntry(e.target.value)}
              required
            />
          </label>
          <label>
            Salario:
            <input
              type="number"
              value={salary}
              onChange={(e) => setSalary(e.target.value)}
              required
            />
          </label>
          <button type="submit" disabled={loading}>
            {loading ? <div className="spinner"></div> : 'Crear Empleado'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ModalEmployee;
