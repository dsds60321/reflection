import { apiClient, ApiResponse } from './ApiClient';
import { DateUtils } from '../utils/DateUtils';

// 대시보드 반성문 타입 정의
export interface DashboardReflection {
  title: string;
  content: string;
  reward: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'TERMINATED';
  createdAt: string;
  updatedAt: string;
  recipients: string[];
}

// 대시보드 칭찬 타입 정의
export interface DashboardPraise {
  title: string;
  content: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'COMPLETED';
  createdAt: string;
  updatedAt: string;
  recipients: string[];
}

// 대시보드 요청 파라미터
export interface DashboardParams {
  year?: number;
  month?: number;
  reference_date?: string;
  date?: string;
  start_date?: string;
  end_date?: string;
  user_idx?: number;
  period_type?: 'monthly' | 'weekly' | 'daily';
}

// 대시보드 응답 데이터 타입
export interface DashboardResponse {
  reflectionList: DashboardReflection[];
  praiseList: DashboardPraise[];
}

class DashboardApiService {
  // API 응답을 내부 인터페이스에 맞게 변환하는 헬퍼 함수
  private transformDashboardData(apiData: any): DashboardResponse {
    const transformReflection = (reflection: any): DashboardReflection => ({
      ...reflection,
      // 필요한 경우 키 매핑
      created_at: reflection.createdAt,
      updated_at: reflection.updatedAt,
      // status는 대소문자 변환
      status: reflection.status?.toLowerCase() as 'pending' | 'approved' | 'rejected' | 'terminated',
    });

    const transformPraise = (praise: any): DashboardPraise => ({
      ...praise,
      // 필요한 경우 키 매핑
      created_at: praise.createdAt,
      updated_at: praise.updatedAt,
      // status는 대소문자 변환
      status: praise.status?.toLowerCase() as 'pending' | 'approved' | 'rejected' | 'completed',
    });

    return {
      reflectionList: apiData.reflectionList?.map(transformReflection) || [],
      praiseList: apiData.praiseList?.map(transformPraise) || []
    };
  }

  // 월별 대시보드 데이터 조회
  async getMonthlyDashboard(params: DashboardParams): Promise<ApiResponse<DashboardResponse>> {
    console.log('-- getMonthlyDashboard');

    let queryParams: DashboardParams = {};

    if (params.year && params.month) {
      const { start, end } = DateUtils.getMonthRange(params.year, params.month);
      queryParams = {
        start_date: start,
        end_date: end,
        user_idx: params.user_idx,
        period_type: 'monthly'
      };
    } else {
      queryParams = params;
    }

    const response = await apiClient.get<any>('/dashboard', queryParams);

    // 응답 데이터 변환
    if (response.success && response.data) {
      const transformedData = this.transformDashboardData(response.data);
      return {
        ...response,
        data: transformedData
      };
    }

    return response;
  }

  // 주별 대시보드 데이터 조회
  async getWeeklyDashboard(params: DashboardParams): Promise<ApiResponse<DashboardResponse>> {
    console.log('-- getWeeklyDashboard');

    let queryParams: DashboardParams = {};

    if (params.reference_date) {
      const { start, end } = DateUtils.getWeekRange(params.reference_date);
      queryParams = {
        start_date: start,
        end_date: end,
        user_idx: params.user_idx,
        period_type: 'weekly'
      };
    } else {
      queryParams = params;
    }

    const response = await apiClient.get<any>('/dashboard', queryParams);

    // 응답 데이터 변환
    if (response.success && response.data) {
      const transformedData = this.transformDashboardData(response.data);
      return {
        ...response,
        data: transformedData
      };
    }

    return response;
  }

  // 일별 대시보드 데이터 조회
  async getDailyDashboard(params: DashboardParams): Promise<ApiResponse<DashboardResponse>> {
    console.log('-- getDailyDashboard');

    let queryParams: DashboardParams = {};

    if (params.date) {
      const { start, end } = DateUtils.getDayRange(params.date);
      queryParams = {
        start_date: start,
        end_date: end,
        user_idx: params.user_idx,
        period_type: 'daily'
      };
    } else {
      queryParams = params;
    }

    const response = await apiClient.get<any>('/dashboard', queryParams);

    // 응답 데이터 변환
    if (response.success && response.data) {
      const transformedData = this.transformDashboardData(response.data);
      return {
        ...response,
        data: transformedData
      };
    }

    return response;
  }

  // 편의 메서드들
  async getCurrentMonthDashboard(userIdx?: number): Promise<ApiResponse<DashboardResponse>> {
    const { currentMonth } = DateUtils.getCurrentPeriods();
    return this.getMonthlyDashboard({
      year: currentMonth.year,
      month: currentMonth.month,
      user_idx: userIdx
    });
  }

  async getCurrentWeekDashboard(userIdx?: number): Promise<ApiResponse<DashboardResponse>> {
    const today = new Date().toISOString().split('T')[0];
    return this.getWeeklyDashboard({
      reference_date: today,
      user_idx: userIdx
    });
  }

  async getTodayDashboard(userIdx?: number): Promise<ApiResponse<DashboardResponse>> {
    const today = new Date().toISOString().split('T')[0];
    return this.getDailyDashboard({
      date: today,
      user_idx: userIdx
    });
  }
}

export const dashboardApi = new DashboardApiService();