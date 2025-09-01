import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<{ success: boolean; message: string }>;
  signup: (name: string, email: string, password: string) => Promise<{ success: boolean; message: string }>;
  logout: () => Promise<void>;
  getAuthHeaders: () => { Authorization: string } | {};
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

const TOKEN_KEY = '@reflection_token';
const USER_KEY = '@reflection_user';

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);

  // 앱 시작 시 저장된 토큰 확인
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const storedToken = await AsyncStorage.getItem(TOKEN_KEY);
      const storedUser = await AsyncStorage.getItem(USER_KEY);

      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error('Auth check error:', error);
      // 토큰이 손상된 경우 제거
      await AsyncStorage.multiRemove([TOKEN_KEY, USER_KEY]);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string): Promise<{ success: boolean; message: string }> => {
    try {
      // 실제 API 호출 시뮬레이션
      await new Promise(resolve => setTimeout(resolve, 1500));

      // 테스트 계정 검증
      if (email === 'user@example.com' && password === '123456') {
        const mockToken = 'mock_jwt_token_12345';
        const mockUser: User = {
          id: '1',
          name: '홍길동',
          email: 'user@example.com',
        };

        // 토큰과 사용자 정보 저장
        await AsyncStorage.setItem(TOKEN_KEY, mockToken);
        await AsyncStorage.setItem(USER_KEY, JSON.stringify(mockUser));

        setToken(mockToken);
        setUser(mockUser);
        setIsAuthenticated(true);

        return { success: true, message: '로그인 성공!' };
      } else {
        return { success: false, message: '이메일 또는 비밀번호가 올바르지 않습니다.' };
      }
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, message: '로그인 중 오류가 발생했습니다.' };
    }
  };

  const signup = async (name: string, email: string, password: string): Promise<{ success: boolean; message: string }> => {
    try {
      // 실제 API 호출 시뮬레이션
      await new Promise(resolve => setTimeout(resolve, 2000));

      // 이메일 중복 체크 시뮬레이션
      if (email === 'existing@example.com') {
        return { success: false, message: '이미 사용 중인 이메일입니다.' };
      }

      const mockToken = 'mock_jwt_token_new_user';
      const mockUser: User = {
        id: Date.now().toString(),
        name,
        email,
      };

      // 토큰과 사용자 정보 저장
      await AsyncStorage.setItem(TOKEN_KEY, mockToken);
      await AsyncStorage.setItem(USER_KEY, JSON.stringify(mockUser));

      setToken(mockToken);
      setUser(mockUser);
      setIsAuthenticated(true);

      return { success: true, message: '회원가입이 완료되었습니다!' };
    } catch (error) {
      console.error('Signup error:', error);
      return { success: false, message: '회원가입 중 오류가 발생했습니다.' };
    }
  };

  const logout = async () => {
    try {
      // 저장된 토큰과 사용자 정보 제거
      await AsyncStorage.multiRemove([TOKEN_KEY, USER_KEY]);

      setToken(null);
      setUser(null);
      setIsAuthenticated(false);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const getAuthHeaders = () => {
    if (token) {
      return { Authorization: `Bearer ${token}` };
    }
    return {};
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        isLoading,
        user,
        token,
        login,
        signup,
        logout,
        getAuthHeaders,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};