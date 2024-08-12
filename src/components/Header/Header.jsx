import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faTimes, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import Login from './../Login/Login';
import Register from './../Register/Register';
import { clearAuthData, isAuthenticated } from './../../services/AuthService';
import './Header.css';
import { toast } from 'react-toastify';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [authStatus, setAuthStatus] = useState(isAuthenticated());

  useEffect(() => {
    const checkAuth = () => {
      setAuthStatus(isAuthenticated());
    };

    const intervalId = setInterval(checkAuth, 1000);

    return () => clearInterval(intervalId);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(prevState => !prevState);
  };

  const openLogin = () => {
    setIsLoginOpen(true);
  };

  const closeLogin = () => {
    setIsLoginOpen(false);
  };

  const openRegister = () => {
    setIsRegisterOpen(true);
  };

  const closeRegister = () => {
    setIsRegisterOpen(false);
  };

  const handleLogout = () => {
    clearAuthData();
    setAuthStatus(false);
    toast.success('Has cerrado sesión con éxito.');
  };

  return (
    <header className="header">
      <div className="header-left">
        <h1 className="header-title">App</h1>
      </div>
      <button className="header-menu-toggle" onClick={toggleMenu}>
        <FontAwesomeIcon icon={faBars} />
      </button>
      <div className={`header-menu ${isMenuOpen ? 'open' : ''}`}>
        <button className="header-menu-close" onClick={toggleMenu}>
          <FontAwesomeIcon icon={faTimes} />
        </button>
        {authStatus ? (
          <button className="header-button logout" onClick={handleLogout}>
            <FontAwesomeIcon icon={faSignOutAlt} /> Logout
          </button>
        ) : (
          <>
            <button className="header-button login" onClick={openLogin}>Iniciar sesión</button>
            <button className="header-button register" onClick={openRegister}>Registrarse</button>
          </>
        )}
      </div>
      {isLoginOpen && <Login onClose={closeLogin} />}
      {isRegisterOpen && <Register onClose={closeRegister} />}
    </header>
  );
};

export default Header;
