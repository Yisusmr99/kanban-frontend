import Swal from 'sweetalert2';

const API_BASE_URL = 'http://localhost:3000';

function getCookie(name: string): string | null {
  console.log('Document cookies:', document.cookie);
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    const cookie = parts.pop()?.split(';').shift();
    console.log(`Cookie "${name}" found:`, cookie);
    return cookie || null;
  }
  console.log(`Cookie "${name}" not found`);
  return null;
}

async function apiRequest(endpoint: string, options: RequestInit) {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      credentials: 'include', // Incluye cookies
    });

    if( response.status === 401) {
      window.location.href = '/login';
    }
    // Si la respuesta no es exitosa, lanza un error
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'An unknown error occurred');
    }
    return await response.json(); // Devuelve el resultado de la API
  } catch (error: any) {
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

  createComment: (
    task_id: number,
    data: { content: string;}
  ) => 
    apiRequest(`tasks/${task_id}/comments`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  }),

  updateTask: (
    id: number,
    data: { columnId: number; projectId: number; title: string; description: string; responsibleId: number | null }
  ) => apiRequest(`/cards/update-card/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  }),

  refreshToken: async (): Promise<string | null> => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/refresh-token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        // body: JSON.stringify({ refresh_token: refreshToken }),
      });
      if (response.ok) {
        return 'true';
      } else {
        throw new Error('Unable to refresh token');
      }
    } catch (error) {
      console.log('Error refreshing token:', error);
      return null; // Si falla, retorna null
    }
  },
  
  createTask: (
    data_request: { columnId: number; projectId: number; title: string; description: string; responsibleId: number | null }
  ) => 
    apiRequest(`/cards`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data_request),
  }),

  getComments: (
    task_id: number 
  ) => apiRequest(`/tasks/${task_id}/comments`, {
    method: 'GET',
  }),

  addComment: (
    task_id: number,
    data: { content: string; }
  ) => 
    apiRequest(`/tasks/${task_id}/comments`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  }),

  getTasks: (
    projectId: number
  ) => apiRequest(`/cards/project/${projectId}`, {
    method: 'GET',
  }),

  updateStateTask: (
    active_id: number,
    data: string
  ) => apiRequest(`/cards/${active_id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: data,
  }),

};
