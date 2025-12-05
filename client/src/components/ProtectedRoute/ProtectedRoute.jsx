import React from 'react';

export default function ProtectedRoute({ children }) {
  // Just render children - permissions are validated by API
  // and handled by individual pages
  return children;
}
