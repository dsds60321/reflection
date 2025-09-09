import { apiClient, ApiResponse } from './ApiClient';
import { DateUtils } from '../utils/DateUtils';

// 칭찬 타입 정의 - API 응답에 맞게 정의
export interface Praise {
  idx?: number;
  user_idx?: number;
  title: string;
  content: string;
  recipient: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'COMPLETED';
  createdAt: string;    // "2024-01-15T09:30:00"
  updatedAt: string;
  completed_at?: string;
  deleted_at?: string;
  author_name?: string;
  recipients?: string[];
}

// 월별 요청 파라미터
export interface MonthlyPraiseParams {
  year: number;
  month: number;
  user_idx?: number;
}

// 주별 요청 파라미터
export interface WeeklyPraiseParams {
  reference_date: string; // "2024-01-15"
  user_idx?: number;
}

// 일별 요청 파라미터
export interface DailyPraiseParams {
  date: string; // "2024-01-15"
  user_idx?: number;
}

// 범위 요청 파라미터 (공통)
export interface DateRangePraiseParams {
  start_date: string;  // "2024-01-15 00:00:00"
  end_date: string;    // "2024-01-31 23:59:59"
  user_idx?: number;
}

// 응답 데이터 타입
export interface PraiseResponse {
  praises?: Praise[];
  total_count?: number;
  period_info?: {
    start_date: string;
    end_date: string;
    type: 'monthly' | 'weekly' | 'daily';
    year?: number;
    month?: number;
    week_start?: string;
    week_end?: string;
  };
  daily_summary?: {
    date: string;
    count: number;
  }[];
}

class PraiseApiService {
  // API 응답을 내부 인터페이스에 맞게 변환하는 헬퍼 함수
  private transformPraise(apiPraise: any): Praise {
    return {
      ...apiPraise,
      // 필요한 경우 키 매핑
      created_at: apiPraise.createdAt,
      updated_at: apiPraise.updatedAt,
      // status는 대소문자 변환
      status: apiPraise.status?.toLowerCase() as 'pending' | 'approved' | 'rejected' | 'completed',
    };
  }

  // 월별 칭찬 조회
  async getMonthlyPraises(params: MonthlyPraiseParams): Promise<ApiResponse<PraiseResponse>> {
    console.log('-- getMonthlyPraises')

    const { start, end } = DateUtils.getMonthRange(params.year, params.month);

    const queryParams = {
      start_date: start,
      end_date: end,
      user_idx: params.user_idx,
      period_type: 'monthly'
    };

    const response = await apiClient.get<any>('/praises', queryParams);

    // 응답 데이터 변환
    if (response.success && Array.isArray(response.data)) {
      const transformedData = response.data.map(item => this.transformPraise(item));
      return {
        ...response,
        data: {
          praises: transformedData,
          total_count: transformedData.length,
          period_info: {
            start_date: start,
            end_date: end,
            type: 'monthly',
            year: params.year,
            month: params.month
          }
        }
      };
    }

    return response;
  }

  // 주별 칭찬 조회
  async getWeeklyPraises(params: WeeklyPraiseParams): Promise<ApiResponse<PraiseResponse>> {
    const { start, end } = DateUtils.getWeekRange(params.reference_date);

    const queryParams = {
      start_date: start,
      end_date: end,
      user_idx: params.user_idx,
      period_type: 'weekly'
    };

    const response = await apiClient.get<any>('/praises', queryParams);

    // 응답 데이터 변환
    if (response.success && Array.isArray(response.data)) {
      const transformedData = response.data.map(item => this.transformPraise(item));
      const weekRange = DateUtils.getWeekRange(params.reference_date);
      return {
        ...response,
        data: {
          praises: transformedData,
          total_count: transformedData.length,
          period_info: {
            start_date: weekRange.start,
            end_date: weekRange.end,
            type: 'weekly',
            week_start: params.reference_date,
            week_end: params.reference_date
          }
        }
      };
    }

    return response;
  }

  // 일별 칭찬 조회
  async getDailyPraises(params: DailyPraiseParams): Promise<ApiResponse<PraiseResponse>> {
    const { start, end } = DateUtils.getDayRange(params.date);

    const queryParams = {
      start_date: start,
      end_date: end,
      user_idx: params.user_idx,
      period_type: 'daily'
    };

    const response = await apiClient.get<any>('/praises', queryParams);

    // 응답 데이터 변환
    if (response.success && Array.isArray(response.data)) {
      const transformedData = response.data.map(item => this.transformPraise(item));
      return {
        ...response,
        data: {
          praises: transformedData,
          total_count: transformedData.length,
          period_info: {
            start_date: start,
            end_date: end,
            type: 'daily'
          }
        }
      };
    }

    return response;
  }

  // 범위 요청 (공통 엔드포인트)
  async getPraisesByRange(params: DateRangePraiseParams): Promise<ApiResponse<PraiseResponse>> {
    const response = await apiClient.get<any>('/praises', params);

    if (response.success && Array.isArray(response.data)) {
      const transformedData = response.data.map(item => this.transformPraise(item));
      return {
        ...response,
        data: {
          praises: transformedData,
          total_count: transformedData.length
        }
      };
    }

    return response;
  }

  // 편의 메서드들
  async getCurrentMonthPraises(userIdx?: number): Promise<ApiResponse<PraiseResponse>> {
    const { currentMonth } = DateUtils.getCurrentPeriods();
    return this.getMonthlyPraises({
      year: currentMonth.year,
      month: currentMonth.month,
      user_idx: userIdx
    });
  }

  async getCurrentWeekPraises(userIdx?: number): Promise<ApiResponse<PraiseResponse>> {
    const today = new Date().toISOString().split('T')[0];
    return this.getWeeklyPraises({
      reference_date: today,
      user_idx: userIdx
    });
  }

  async getTodayPraises(userIdx?: number): Promise<ApiResponse<PraiseResponse>> {
    const today = new Date().toISOString().split('T')[0];
    return this.getDailyPraises({
      date: today,
      user_idx: userIdx
    });
  }
}

export const praiseApi = new PraiseApiService();