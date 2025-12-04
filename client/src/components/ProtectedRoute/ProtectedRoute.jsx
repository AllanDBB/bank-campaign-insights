import React from 'react';
import { useAccessControl } from '../../hooks/useAccessControl';

export default function ProtectedRoute({ children, requiredPermission }) {
  const access = useAccessControl();

  // Check if permission is granted
  if (requiredPermission && !access[requiredPermission]) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%',
        backgroundColor: '#060606',
        color: '#ccc',
        fontSize: '1.2rem',
        textAlign: 'center',
        padding: '2rem'
      }}>
        <div>
          <h2 style={{ color: '#e74c3c', marginBottom: '1rem' }}>Acceso Denegado</h2>
          <p>No tienes permisos para acceder a esta sección.</p>
          <p style={{ fontSize: '0.9rem', color: '#999', marginTop: '1rem' }}>
            Contacta con un administrador si crees que esto es un error.
          </p>
        </div>
      </div>
    );
  }

  return children;
}
