import React from 'react';

const Logout = () => {
    const handleLogout = () => {
        try {
            if (window.confirm('¿Estás seguro de que deseas cerrar sesión?')) {
                localStorage.removeItem('token');
                window.location.href = '/login';
            }
        } catch (error) {
            console.error('Error al cerrar sesión:', error);
        }
    };

    return (
        <button onClick={handleLogout} className="btn-login">
            Cerrar Sesión
        </button>
    );
};

export default Logout;