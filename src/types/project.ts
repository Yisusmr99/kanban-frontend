export type User = {
  id: number;
  email: string;
  username: string;
  full_name: string;
  isActive: boolean;
  created_at: string;
  updated_at: string;
};

export type Project = {
  id: number;
  name: string;
  description: string;
  created_at: string;
  updated_at: string;
  owner: User;
  collaborators: User[]; // Nueva propiedad para la lista de colaboradores
  role: 'owner' | 'collaborator'; // Nueva propiedad para identificar el rol del usuario logueado
};
