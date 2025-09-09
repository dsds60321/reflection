import { apiClient, ApiResponse } from './ApiClient';
import { DateUtils } from '../utils/DateUtils';

// 반성문 타입 정의 (timestamp 형식)
export interface Reflection {
  idx?: number; // 선택적으로 변경
  user_idx?: number; // 선택적으로 변경
  title: string;
  content: string;
  reward: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'TERMINATED'; // API 응답 형식에 맞춤
  createdAt: string;    // API 응답 키명에 맞춤
  updatedAt: string;    // API 응답 키명에 맞춤
  completed_at?: string;
  deleted_at?: string;
  author_name?: string;
  recipients?: string[]; // API 응답에 맞게 문자열 배열로 변경
}

// 기존 ReflectionRecipient 인터페이스는 유지 (필요시 사용)
export interface ReflectionRecipient {
  idx: number;
  reflection_id: number;
  recipient_idx?: number;
  recipient_name: string;
  recipient_email?: string;
  response: 'pending' | 'approved' | 'rejected';
  response_message?: string;
  responded_at?: string;
}

// 월별 요청 파라미터
export interface MonthlyReflectionParams {
  year: number;
  month: number;
  user_idx?: number;
}

// 주별 요청 파라미터
export interface WeeklyReflectionParams {
  reference_date: string; // "2024-01-15" - 해당 주에 포함된 아무 날짜
  user_idx?: number;
}

// 일별 요청 파라미터
export interface DailyReflectionParams {
  date: string; // "2024-01-15"
  user_idx?: number;
}

// 범위 요청 파라미터 (공통)
export interface DateRangeParams {
  start_date: string;  // "2024-01-15 00:00:00"
  end_date: string;    // "2024-01-31 23:59:59"
  user_idx?: number;
}

// 응답 데이터 타입
export interface ReflectionResponse {
  reflections?: Reflection[];
}

class ReflectionApiService {
  // 월별 반성문 조회
  async getMonthlyReflections(params: MonthlyReflectionParams): Promise<ApiResponse<ReflectionResponse>> {
    console.log('-- getMonthlyReflections')

    const { start, end } = DateUtils.getMonthRange(params.year, params.month);
    console.log('getMonthlyReflections start: ', start)
    console.log('getMonthlyReflections end: ', end)


    const queryParams = {
      start_date: start,
      end_date: end,
      user_idx: params.user_idx,
      period_type: 'monthly'
    };

    return apiClient.get<ReflectionResponse>('/reflections', queryParams);
  }

  // 주별 반성문 조회
  async getWeeklyReflections(params: WeeklyReflectionParams): Promise<ApiResponse<ReflectionResponse>> {
    const { start, end } = DateUtils.getWeekRange(params.reference_date);

    const queryParams = {
      start_date: start,
      end_date: end,
      user_idx: params.user_idx,
      period_type: 'weekly'
    };

    return apiClient.get<ReflectionResponse>('/reflections', queryParams);
  }

  // 일별 반성문 조회
  async getDailyReflections(params: DailyReflectionParams): Promise<ApiResponse<ReflectionResponse>> {
    const { start, end } = DateUtils.getDayRange(params.date);

    const queryParams = {
      start_date: start,
      end_date: end,
      user_idx: params.user_idx,
      period_type: 'daily'
    };

    return apiClient.get<ReflectionResponse>('/reflections', queryParams);
  }
}

export const reflectionApi = new ReflectionApiService();