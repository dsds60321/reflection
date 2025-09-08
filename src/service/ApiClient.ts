import AsyncStorage from '@react-native-async-storage/async-storage';

// API 설정
const API_BASE_URL = 'http://127.0.0.1:10001/ongimemo/v1';
const TOKEN_KEY = '@reflection_token';

// API 응답 타입
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

// HTTP 메서드 타입
type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

// 요청 옵션 타입
interface RequestOptions {
  method?: HttpMethod;
  body?: any;
  headers?: Record<string, string>;
  requireAuth?: boolean;
}

class ApiClient {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  // 토큰 가져오기
  private async getToken(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem(TOKEN_KEY);
    } catch (error) {
      console.error('토큰 가져오기 실패:', error);
      return null;
    }
  }

  // 인증 헤더 생성
  private async getAuthHeaders(): Promise<Record<string, string>> {
    const token = await this.getToken();
    // return token ? { Authorization: `${token}` } : {};
    return { Authorization: 'hPTT_eWP4WkSD67OYS_be6o-4xb55fFfaS1ucifIUf4' };
  }

  // 공통 요청 메서드
  private async request<T>(
    endpoint: string,
    options: RequestOptions = {}
  ): Promise<ApiResponse<T>> {
    const {
      method = 'GET',
      body,
      headers = {},
      requireAuth = true
    } = options;

    try {
      // 기본 헤더 설정
      const defaultHeaders: Record<string, string> = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      };

      // 인증 헤더 추가 (로그인 제외)
      if (requireAuth) {
        const authHeaders = await this.getAuthHeaders();
        Object.assign(defaultHeaders, authHeaders);
      }

      // 사용자 정의 헤더 병합
      const finalHeaders = { ...defaultHeaders, ...headers };

      // 요청 옵션 구성
      const requestOptions: RequestInit = {
        method,
        headers: finalHeaders,
      };

      // 바디 데이터 추가 (GET 요청 제외)
      if (body && method !== 'GET') {
        requestOptions.body = JSON.stringify(body);
      }

      // 요청 실행
      const response = await fetch(`${this.baseURL}${endpoint}`, requestOptions);

      // 응답 처리
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();

      return {
        success: true,
        data: data.data || data,
        message: data.message
      };

    } catch (error) {
      console.error(`API 요청 실패 [${method} ${endpoint}]:`, error);

      return {
        success: false,
        error: error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.'
      };
    }
  }

  // GET 요청
  async get<T>(endpoint: string, params?: Record<string, any>, requireAuth = true): Promise<ApiResponse<T>> {
    let url = endpoint;

    if (params) {
      const searchParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          searchParams.append(key, String(value));
        }
      });
      url += `?${searchParams.toString()}`;
    }

    return this.request<T>(url, { method: 'GET', requireAuth });
  }

  // POST 요청
  async post<T>(endpoint: string, body?: any, requireAuth = true): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'POST', body, requireAuth });
  }

  // PUT 요청
  async put<T>(endpoint: string, body?: any, requireAuth = true): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'PUT', body, requireAuth });
  }

  // DELETE 요청
  async delete<T>(endpoint: string, requireAuth = true): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'DELETE', requireAuth });
  }
}

// API 클라이언트 인스턴스 생성 및 내보내기
export const apiClient = new ApiClient(API_BASE_URL);