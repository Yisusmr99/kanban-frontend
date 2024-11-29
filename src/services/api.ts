import Swal from 'sweetalert2';

const API_BASE_URL = 'http://localhost:3000';

async function apiRequest(endpoint: string, options: RequestInit) {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      credentials: 'include', // Incluye cookies
    });

    // Si la respuesta no es exitosa, lanza un error
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'An unknown error occurred');
    }

    return await response.json(); // Devuelve el resultado de la API
  } catch (error: any) {
    console.error('API error:', error.message);

    // Usa Swal para mostrar errores
    await Swal.fire({
      icon: 'error',
      title: 'Error',
      text: error.message || 'An unknown error occurred',
    });

    throw error; // Relanza el error para que pueda manejarse en los componentes
  }
}

export const ApiService = {
    // Registro de usuario
    register: (data: { email: string; password: string; username: string }) => apiRequest('/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }),

    // Inicio de sesión
    login: (data: { email: string; password: string }) => apiRequest('/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }),

    logout: () => apiRequest('/auth/logout', { method: 'POST' }),

    // Obtener proyectos
    getProjects: () => apiRequest('/projects', { method: 'GET' }),

    // Crear un proyecto
    createProject: (data: {
        name: string;
        description: string;
        users: number[];
    }) => apiRequest('/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    }),

    // Editar un proyecto
    updateProject: (
        id: number,
        data: { name: string; description: string; users: number[] }
    ) =>
    apiRequest(`/projects/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }),

    // Eliminar un proyecto
    deleteProject: (id: number) => apiRequest(`/projects/${id}`, {
      method: 'DELETE',
    }),

    // Obtener un proyecto específico
    getProject: (id: number) => apiRequest(`/projects/${id}`, {
      method: 'GET',
    }),

    getUsers: () => apiRequest('/users', { method: 'GET' }),
};
