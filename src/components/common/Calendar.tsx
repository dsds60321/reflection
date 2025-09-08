import React, { useState, useMemo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { Calendar as RNCalendar, LocaleConfig } from 'react-native-calendars';
import { useColors } from '../../hooks/useColors.ts';
import { useTheme } from '../../context/ThemeContext.tsx';
import { typography } from '../../styles/typography.ts';
import { dimensions } from '../../styles/dimensions.ts';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

// 한국어 로케일 설정
LocaleConfig.locales['ko'] = {
  monthNames: [
    '1월', '2월', '3월', '4월', '5월', '6월',
    '7월', '8월', '9월', '10월', '11월', '12월'
  ],
  monthNamesShort: [
    '1월', '2월', '3월', '4월', '5월', '6월',
    '7월', '8월', '9월', '10월', '11월', '12월'
  ],
  dayNames: ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'],
  dayNamesShort: ['일', '월', '화', '수', '목', '금', '토'],
  today: '오늘'
};
LocaleConfig.defaultLocale = 'ko';

export interface CalendarProps {
  // 캘린더 타입 - 대시보드용 또는 목록용
  variant: 'dashboard' | 'list';

  // 선택된 날짜 (목록용)
  selectedDate?: string;

  // 날짜 클릭 핸들러 (목록용)
  onDatePress?: (date: string) => void;

  // 월 변경 핸들러
  onMonthChange?: (date: { year: number; month: number; dateString: string }) => void;

  // 주 변경 핸들러
  onWeekChange?: (date: { weekStart: string; weekEnd: string; referenceDate: string }) => void;

  // 통계 정보 (대시보드용)
  stats?: {
    reflectionCount: number;
    praiseCount: number;
  };

  // 서브 텍스트 (목록용)
  subtext?: string;

  // 날짜에 데이터가 있는지 확인하는 함수
  hasDataForDate?: (date: string) => boolean;

  // 완료된 날짜들 (대시보드용)
  completedDays?: string[];

  // 초기 날짜
  initialDate?: string;

  // 주 단위 보기 모드 변경 핸들러
  onWeekModeToggle?: () => void;

  // 주 단위 보기 모드 상태 (외부에서 관리)
  isWeekView?: boolean;
}

export const Calendar: React.FC<CalendarProps> = ({
                                                    variant,
                                                    selectedDate,
                                                    onDatePress,
                                                    onWeekChange,
                                                    onMonthChange,
                                                    stats,
                                                    subtext,
                                                    hasDataForDate,
                                                    completedDays = [],
                                                    initialDate = new Date().toISOString().split('T')[0],
                                                    onWeekModeToggle,
                                                    isWeekView = false,
                                                  }) => {
  const colors = useColors();
  const { theme } = useTheme();
  const [currentMonth, setCurrentMonth] = useState(initialDate);
  const [currentWeek, setCurrentWeek] = useState(new Date());

  // 오늘 날짜 색상을 테마에 맞게 계산
  const todayColors = useMemo(() => ({
    backgroundColor: theme === 'dark' ? colors.text.primary : colors.text.primary,
    textColor: theme === 'dark' ? '#000' : colors.text.white,
  }), [theme, colors]);

  // RNCalendar 테마를 동적으로 생성
  const calendarTheme = useMemo(() => ({
    backgroundColor: 'transparent',
    calendarBackground: 'transparent',
    textSectionTitleColor: colors.text.primary,
    textSectionTitleDisabledColor: colors.text.secondary,
    selectedDayBackgroundColor: colors.primary.coral,
    selectedDayTextColor: colors.text.white,
    todayTextColor: colors.primary.coral,
    dayTextColor: colors.text.primary,
    textDisabledColor: colors.text.secondary,
    dotColor: colors.primary.coral,
    selectedDotColor: colors.text.white,
    arrowColor: colors.text.primary,
    disabledArrowColor: colors.text.secondary,
    monthTextColor: colors.text.primary,
    indicatorColor: colors.primary.coral,
    textDayFontFamily: typography.fontFamily.regular,
    textMonthFontFamily: typography.fontFamily.regular,
    textDayHeaderFontFamily: typography.fontFamily.regular,
    textDayFontWeight: typography.weights.medium,
    textMonthFontWeight: typography.weights.semibold,
    textDayHeaderFontWeight: typography.weights.medium,
    textDayFontSize: typography.sizes.md,
    textMonthFontSize: typography.sizes.lg,
    textDayHeaderFontSize: typography.sizes.sm,
  }), [colors, typography]);

  // 마킹된 날짜들 생성
  const getMarkedDates = () => {
    const marked: { [key: string]: any } = {};

    // 데이터가 있는 날짜 마킹 (두 variant 모두 적용)
    if (hasDataForDate) {
      // 현재 월의 모든 날짜를 확인
      const year = parseInt(currentMonth.split('-')[0]);
      const month = parseInt(currentMonth.split('-')[1]);
      const daysInMonth = new Date(year, month, 0).getDate();

      for (let day = 1; day <= daysInMonth; day++) {
        const dateString = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
        if (hasDataForDate(dateString)) {
          marked[dateString] = {
            ...marked[dateString],
            marked: true,
            dotColor: colors.primary.coral,
          };
        }
      }
    }

    // 완료된 날짜 마킹 (대시보드용 - 추가 마킹)
    if (variant === 'dashboard') {
      completedDays.forEach(date => {
        marked[date] = {
          ...marked[date],
          marked: true,
          dotColor: colors.primary.coral,
        };
      });
    }

    // 선택된 날짜 처리 - 두 variant 모두 적용
    if (selectedDate) {
      marked[selectedDate] = {
        ...marked[selectedDate],
        selected: true,
        selectedColor: colors.primary.coral,
        selectedTextColor: colors.text.white,
      };
    }

    // 오늘 날짜 처리 - 테마에 맞는 색상 (선택된 날짜가 아닐 때만)
    const today = new Date().toISOString().split('T')[0];
    if (selectedDate !== today) {
      marked[today] = {
        ...marked[today],
        selected: true,
        selectedColor: todayColors.backgroundColor,
        selectedTextColor: todayColors.textColor,
      };
    }

    return marked;
  };

  const handleDayPress = (day: { dateString: string }) => {
    if (onDatePress) {
      onDatePress(day.dateString);
    }
  };


  const handleMonthChange = (month: { year: number; month: number; dateString: string }) => {
    setCurrentMonth(month.dateString);
    if (onMonthChange) {
      onMonthChange(month);
    }
  };

  const handleWeekToggle = () => {
    if (onWeekModeToggle) {
      onWeekModeToggle();
    }
  };

  // 주 단위 네비게이션
  const navigateWeek = (direction: 'prev' | 'next') => {
    const newWeek = new Date(currentWeek);
    newWeek.setDate(currentWeek.getDate() + (direction === 'next' ? 7 : -7));
    setCurrentWeek(newWeek);

    // 주간 변경 시 콜백 호출
    if (onWeekChange) {
      // 해당 주의 시작일과 종료일 계산
      const startOfWeek = new Date(newWeek);
      const dayOfWeek = newWeek.getDay();
      const diff = (dayOfWeek === 0 ? 7 : dayOfWeek) - 1; // 월요일 기준
      startOfWeek.setDate(newWeek.getDate() - diff);

      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(startOfWeek.getDate() + 6);

      onWeekChange({
        weekStart: startOfWeek.toISOString().split('T')[0],
        weekEnd: endOfWeek.toISOString().split('T')[0],
        referenceDate: newWeek.toISOString().split('T')[0]
      });
    }
  };


  const renderHeader = () => (
    <View style={styles.headerContainer}>
      {variant === 'dashboard' && stats && (
        <View style={styles.statsContainer}>
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Image
                source={require("../../assets/images/devil.png")}
                style={styles.statIcon}
              />
              <Text style={[styles.statText, { color: colors.text.secondary }]}>
                {stats.reflectionCount}
              </Text>
            </View>
            <View style={styles.statItem}>
              <Image
                source={require("../../assets/images/angel.png")}
                style={styles.statIcon}
              />
              <Text style={[styles.statText, { color: colors.text.secondary }]}>
                {stats.praiseCount}
              </Text>
            </View>
          </View>

          <TouchableOpacity style={styles.weekButton} onPress={handleWeekToggle}>
            <Text style={[styles.weekButtonText, { color: colors.text.secondary }]}>
              {isWeekView ? '월' : '주'}
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {variant === 'list' && (
        <View style={styles.listHeaderContainer}>
          <TouchableOpacity style={styles.weekButton} onPress={handleWeekToggle}>
            <Text style={[styles.weekButtonText, { color: colors.text.secondary }]}>
              {isWeekView ? '월' : '주'}
            </Text>
          </TouchableOpacity>

          {subtext && (
            <Text style={[styles.subtext, { color: colors.text.secondary }]}>
              {subtext}
            </Text>
          )}
        </View>
      )}
    </View>
  );

  // 커스텀 주간 캘린더
  const renderCustomWeekCalendar = () => {
    // 현재 주의 날짜들 계산
    const weekDates = [];
    const startOfWeek = new Date(currentWeek);

    // 대시보드는 월요일부터 시작, 목록은 일요일부터
    const dayOffset = variant === 'dashboard' ? 1 : 0;
    const dayOfWeek = currentWeek.getDay();
    const diff = (dayOfWeek === 0 ? 7 : dayOfWeek) - dayOffset;

    startOfWeek.setDate(currentWeek.getDate() - diff);

    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      weekDates.push(date);
    }

    const calendarDays = variant === 'dashboard' ?
      ['월', '화', '수', '목', '금', '토', '일'] :
      ['일', '월', '화', '수', '목', '금', '토'];

    const today = new Date();

    return (
      <View style={styles.customCalendar}>
        {/* 월 헤더 */}
        <View style={styles.monthHeader}>
          <TouchableOpacity onPress={() => navigateWeek('prev')}>
            <MaterialCommunityIcons name="chevron-left" size={24} color={colors.text.primary} />
          </TouchableOpacity>

          <Text style={[styles.monthText, { color: colors.text.primary }]}>
            {currentWeek.toLocaleDateString('ko-KR', { year: 'numeric', month: 'long' })}
          </Text>

          <TouchableOpacity onPress={() => navigateWeek('next')}>
            <MaterialCommunityIcons name="chevron-right" size={24} color={colors.text.primary} />
          </TouchableOpacity>
        </View>

        {/* 요일 헤더 */}
        <View style={styles.weekRow}>
          {calendarDays.map((day, index) => (
            <Text key={day} style={[
              styles.dayHeader,
              {
                color: variant === 'dashboard'
                  ? (index === 5 ? colors.primary.coral : index === 6 ? colors.text.secondary : colors.text.primary)
                  : (index === 0 || index === 6 ? colors.text.secondary : colors.text.primary)
              }
            ]}>
              {day}
            </Text>
          ))}
        </View>

        {/* 날짜들 */}
        <View style={styles.datesRow}>
          {weekDates.map((date, index) => {
            const dateString = date.toISOString().split('T')[0];
            const hasData = hasDataForDate ? hasDataForDate(dateString) : false;
            const isSelected = selectedDate === dateString;
            const isToday = date.toDateString() === today.toDateString();
            const isCompleted = completedDays.includes(dateString);

            // 두 variant 모두에서 클릭 가능하게 수정
            const DateComponent = onDatePress ? TouchableOpacity : View;
            const dateProps = onDatePress
              ? { onPress: () => onDatePress(dateString), activeOpacity: 0.7 }
              : {};

            // 날짜 배경색 계산
            let backgroundColor = 'transparent';
            let textColor = colors.text.primary;

            if (isSelected) {
              // 선택된 날짜 우선순위 1
              backgroundColor = colors.primary.coral;
              textColor = colors.text.white;
            } else if (isToday) {
              // 오늘 날짜 우선순위 2
              backgroundColor = todayColors.backgroundColor;
              textColor = todayColors.textColor;
            } else {
              // 기본 텍스트 색상
              if (variant === 'dashboard') {
                if (index === 5) textColor = colors.primary.coral; // 토요일
                else if (index === 6) textColor = colors.text.secondary; // 일요일
                else textColor = colors.text.primary; // 평일
              } else {
                if (index === 0 || index === 6) textColor = colors.text.secondary; // 주말
                else textColor = colors.text.primary; // 평일
              }
            }

            return (
              <DateComponent
                key={dateString}
                style={styles.dateContainer}
                {...dateProps}
              >
                <View style={[
                  styles.dateCircle,
                  { backgroundColor }
                ]}>
                  <Text style={[
                    styles.dateText,
                    { color: textColor }
                  ]}>
                    {date.getDate()}
                  </Text>

                  {/* 대시보드 완료 표시 (선택된 날짜가 아닐 때만) */}
                  {variant === 'dashboard' && isCompleted && !isSelected && (
                    <View style={[styles.completedIndicator, { backgroundColor: colors.primary.coral }]}>
                      <Text style={styles.completedNumber}>1</Text>
                    </View>
                  )}

                  {/* 데이터 존재 표시 - 우측 상단으로 통일 */}
                  {hasData && !isSelected && !isToday && !isCompleted && (
                    <View style={[styles.dataIndicator, { backgroundColor: colors.primary.coral }]} />
                  )}
                </View>
              </DateComponent>
            );
          })}
        </View>
      </View>
    );
  };


  return (
    <View style={styles.calendarSection}>
      {renderHeader()}

      {isWeekView ? (
        renderCustomWeekCalendar()
      ) : (
        <RNCalendar
          key={`${theme}-${colors.text.primary}`} // 테마 변경 시 리렌더링 강제
          current={currentMonth}
          onDayPress={handleDayPress}
          onMonthChange={handleMonthChange}
          markedDates={getMarkedDates()}
          markingType={'custom'}
          hideExtraDays={true}
          disableMonthChange={false}
          firstDay={variant === 'dashboard' ? 1 : 0}
          hideDayNames={false}
          showWeekNumbers={false}
          disableArrowLeft={false}
          disableArrowRight={false}
          disableAllTouchEventsForDisabledDays={true}
          enableSwipeMonths={true}
          theme={calendarTheme}
          style={styles.calendar}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  calendarSection: {
    marginBottom: dimensions.spacing.lg,
  },
  headerContainer: {
    marginBottom: dimensions.spacing.sm,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: dimensions.spacing.sm,
  },
  listHeaderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: dimensions.spacing.sm,
  },
  statsRow: {
    flexDirection: 'row',
    gap: dimensions.spacing.md,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: dimensions.spacing.xs,
  },
  statIcon: {
    width: 20,
    height: 20,
  },
  statText: {
    fontSize: typography.sizes.sm,
    fontFamily: typography.fontFamily.regular,
  },
  weekButton: {
    paddingHorizontal: dimensions.spacing.md,
    paddingVertical: dimensions.spacing.xs,
  },
  weekButtonText: {
    fontSize: typography.sizes.md,
    fontFamily: typography.fontFamily.regular,
  },
  subtext: {
    fontSize: typography.sizes.sm,
    fontFamily: typography.fontFamily.regular,
  },
  calendar: {
    paddingVertical: dimensions.spacing.sm,
  },

  // Custom Calendar Styles (for week view)
  customCalendar: {
    paddingVertical: dimensions.spacing.sm,
  },
  monthHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: dimensions.spacing.md,
  },
  monthText: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.semibold,
    fontFamily: typography.fontFamily.regular,
  },
  weekRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: dimensions.spacing.sm,
  },
  dayHeader: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.medium,
    fontFamily: typography.fontFamily.regular,
    width: 40,
    textAlign: 'center',
  },
  datesRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  dateContainer: {
    alignItems: 'center',
    width: 40,
  },
  dateCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  dateText: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.medium,
    fontFamily: typography.fontFamily.regular,
  },
  completedIndicator: {
    position: 'absolute',
    top: -4,
    right: -4,
    width: 16,
    height: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  completedNumber: {
    color: '#FFFFFF',
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.bold,
    fontFamily: typography.fontFamily.regular,
  },
  // 데이터 표시 마커를 우측 상단으로 통일
  dataIndicator: {
    position: 'absolute',
    top: -2,
    right: -2,
    width: 8,
    height: 8,
    borderRadius: 4,
  },
});
