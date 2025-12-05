export const getErrorMessage = (error) => {
  // Handle axios errors
  if (error?.response?.status === 403) {
    return 'No tienes permiso para realizar esta acción. Contacta a tu administrador si necesitas acceso.';
  }

  if (error?.response?.status === 401) {
    return 'Tu sesión ha expirado. Por favor, inicia sesión nuevamente.';
  }

  if (error?.response?.status === 400) {
    return error?.response?.data?.message || 'Los datos enviados no son válidos.';
  }

  if (error?.response?.status === 404) {
    return 'El recurso solicitado no fue encontrado.';
  }

  if (error?.response?.status === 500) {
    return 'Error interno del servidor. Intenta más tarde.';
  }

  if (error?.response?.status >= 500) {
    return 'Error del servidor. Por favor, intenta nuevamente más tarde.';
  }

  // Handle network errors
  if (!error?.response) {
    if (error?.message === 'Network Error') {
      return 'Error de conexión. Verifica tu conexión a internet.';
    }
    return error?.message || 'Error desconocido. Intenta nuevamente.';
  }

  // Handle custom error messages
  if (typeof error === 'string') {
    return error;
  }

  // Default error message
  return 'Ocurrió un error inesperado. Intenta nuevamente.';
};
