/**
 * timestamp 타입을 위한 날짜 유틸리티
 * DB의 timestamp 컬럼에 대한 BETWEEN 절 처리용
 */
export class DateUtils {
  // 월별 날짜 범위 (해당 월의 첫째 날 00:00:00 ~ 마지막 날 23:59:59)
  static getMonthRange(year: number, month: number): { start: string; end: string } {
    // 월의 첫째 날 00:00:00
    const startDate = new Date(year, month - 1, 1, 0, 0, 0, 0);

    // 월의 마지막 날 23:59:59.999
    const endDate = new Date(year, month, 0, 23, 59, 59, 999);

    return {
      start: this.formatTimestamp(startDate),
      end: this.formatTimestamp(endDate)
    };
  }

  // 주별 날짜 범위 (월요일 00:00:00 ~ 일요일 23:59:59)
  static getWeekRange(referenceDate: string): { start: string; end: string } {
    const date = new Date(referenceDate);

    // 해당 주의 월요일 찾기 (한국 기준)
    const dayOfWeek = date.getDay(); // 0: 일요일, 1: 월요일, ... , 6: 토요일
    const monday = new Date(date);
    monday.setDate(date.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1));
    monday.setHours(0, 0, 0, 0);

    // 해당 주의 일요일
    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);
    sunday.setHours(23, 59, 59, 999);

    return {
      start: this.formatTimestamp(monday),
      end: this.formatTimestamp(sunday)
    };
  }

  // 특정 날짜의 범위 (해당 날짜 00:00:00 ~ 23:59:59)
  static getDayRange(date: string): { start: string; end: string } {
    const targetDate = new Date(date);

    const startDate = new Date(targetDate);
    startDate.setHours(0, 0, 0, 0);

    const endDate = new Date(targetDate);
    endDate.setHours(23, 59, 59, 999);

    return {
      start: this.formatTimestamp(startDate),
      end: this.formatTimestamp(endDate)
    };
  }

  // Date 객체를 timestamp 문자열로 변환 (YYYY-MM-DD HH:mm:ss)
  static formatTimestamp(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  }

  // YYYY-MM-DD 형식을 timestamp로 변환
  static dateStringToTimestamp(dateString: string, isEndOfDay = false): string {
    const date = new Date(dateString);

    if (isEndOfDay) {
      date.setHours(23, 59, 59, 999);
    } else {
      date.setHours(0, 0, 0, 0);
    }

    return this.formatTimestamp(date);
  }

  // 현재 월/주 정보
  static getCurrentPeriods(): {
    currentMonth: { year: number; month: number; range: { start: string; end: string } };
    currentWeek: { range: { start: string; end: string } };
    today: { range: { start: string; end: string } };
  } {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1;
    const today = now.toISOString().split('T')[0];

    return {
      currentMonth: {
        year,
        month,
        range: this.getMonthRange(year, month)
      },
      currentWeek: {
        range: this.getWeekRange(today)
      },
      today: {
        range: this.getDayRange(today)
      }
    };
  }

  // 두 날짜 사이의 월 수 계산
  static getMonthsBetween(startDate: string, endDate: string): { year: number; month: number }[] {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const months = [];

    let current = new Date(start.getFullYear(), start.getMonth(), 1);

    while (current <= end) {
      months.push({
        year: current.getFullYear(),
        month: current.getMonth() + 1
      });
      current.setMonth(current.getMonth() + 1);
    }

    return months;
  }
}