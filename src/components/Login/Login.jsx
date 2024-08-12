import React, { useState } from 'react';
import './Login.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { signin, saveAuthData } from '../../services/AuthService';
import { toast } from 'react-toastify';

const Login = ({ onClose }) => {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await signin(email, password);
      if (result.token) {
        saveAuthData(result.token, result.user.rol_id);
        setEmail('');
        setPassword('');
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
    <div className="login-modal">
      <div className="login-content">
        <button className="login-close" onClick={onClose}><FontAwesomeIcon icon={faTimes} /></button>
        <h2>Iniciar sesión</h2>
        <form onSubmit={handleSubmit}>
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
          <button type="submit" disabled={loading}>
            {loading ? <div className="spinner"></div> : 'Entrar'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
