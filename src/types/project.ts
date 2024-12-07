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


export type DataProject = {
  count_users: number,
	count_projects: number,
	count_tasks: number,
  summary_projects: SumarryProject[]
};

export type SumarryProject = {
  id: number,
  name: string,
  description: string,
  count_tasks: number,
  created_at: string,
  deleted_at: string,
  owner: string,
  collaborators: number,
  total_tasks: number,
  count_tasks_todo: number,
  count_tasks_inprogress: number,
  count_tasks_review: number,
  count_tasks_done: number,
  porcentage_tasks: number,
  tasks_by_responsible: TaskByResponsible[]
} 

export type TaskByResponsible = {
  id: number,
  fullName: string,
  username: string,
  cardCount: number
}