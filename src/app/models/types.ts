export interface Project {
  id: number;
  name: string;
  description: string;
  status: 'Active' | 'Completed' | 'On Hold';
  startDate: string;
  endDate: string;
  members: number[];
}

export interface Task {
  id: number;
  projectId: number;
  title: string;
  description: string;
  status: 'To Do' | 'In Progress' | 'Done';
  assignedTo: number;
  dueDate: string;
}

export interface User {
  id: number;
  name: string;
  role: 'Manager' | 'Developer' | 'Tester';
  email: string;
}
