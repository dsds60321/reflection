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

export type RootStackParamList = {
  ReflectionMain: undefined;
  ReflectionDetail: {
    reflection: {
      id: string;
      title: string;
      content: string;
      author: string;
      recipient?: string;
      date: string;
      reward?: string;
      status: 'completed' | 'pending';
    };
  };
  ReflectionForm: {
    mode: 'create' | 'edit';
    reflection?: {
      id: string;
      title: string;
      content: string;
      author: string;
      recipient?: string;
      date: string;
      reward?: string;
      status: 'completed' | 'pending';
    };
  };
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}

export type TabType = 'reflections' | 'praises';