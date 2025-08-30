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

export interface Friend {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  avatar?: string;
  isRegistered: boolean;
  status: 'pending' | 'accepted' | 'blocked';
  addedAt: string;
}

export interface Contact {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  isRegistered: boolean;
  isInvited: boolean;
}

export interface InviteMethod {
  type: 'sms' | 'email' | 'kakao' | 'facebook' | 'instagram' | 'copy';
  label: string;
  icon: string;
  color: string;
}


declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}

export type TabType = 'reflections' | 'praises';