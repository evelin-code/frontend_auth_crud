import React, { useState } from 'react';
import './Register.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { signup, saveAuthData } from './../../services/AuthService';
import { toast } from 'react-toastify';

const Register = ({ onClose }) => {
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (password !== confirmPassword) {
      toast.error('Las contraseñas no coinciden.');
      setLoading(false);
      return;
    }

    try {
      const result = await signup(username, email, password);
      if (result.token) {
        saveAuthData(result.token, result.rol_id);
        setUsername('');
        setEmail('');
        setPassword('');
        setConfirmPassword('');
        onClose();
        toast.success(result.message);
      } else {
        toast.error(result.message || 'Error desconocido');
      }
    } catch (error) {
      toast.error(error.message || 'Error en el servidor');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-modal">
      <div className="register-content">
        <button className="register-close" onClick={onClose}>
          <FontAwesomeIcon icon={faTimes} />
        </button>
        <h2>Registrarse</h2>
        <form onSubmit={handleSubmit}>
          <label>
            Nombre de usuario:
            <input 
              type="text" 
              value={username} 
              onChange={(e) => setUsername(e.target.value)} 
              required 
            />
          </label>
          <label>
            Correo electrónico:
            <input 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
            />
          </label>
          <label>
            Contraseña:
            <input 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
            />
          </label>
          <label>
            Confirmar Contraseña:
            <input 
              type="password" 
              value={confirmPassword} 
              onChange={(e) => setConfirmPassword(e.target.value)} 
              required 
            />
          </label>
          <button type="submit" disabled={loading}>
            {loading ? <div className="spinner"></div> : 'Registrarse'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;
