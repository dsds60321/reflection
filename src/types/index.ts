export interface User {
  id: string;
  name: string;
  avatar: string;
}

export interface Reflection {
  id: string;
  title: string;
  content: string;
  author: User;
  recipient?: string;
  date: string;
  reward?: string;
}

export interface Praise {
  id: string;
  content: string;
  author: User;
  recipient: User;
  date: string;
}

export interface DashboardStats {
  reflectionsSent: number;
  praisesReceived: number;
}

export type TabType = 'reflections' | 'praises';