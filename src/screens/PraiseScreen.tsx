import React, { useState, useMemo, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Image,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useColors } from '../hooks/useColors';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { typography } from '../styles/typography';
import { dimensions } from '../styles/dimensions';
import { Calendar } from '../components/common/Calendar';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {
  praiseApi,
  Praise
} from '../service/PraiseApiService';

export const PraiseScreen: React.FC = () => {
  const colors = useColors();
  const { theme, toggleTheme } = useTheme();
  const navigation = useNavigation();
  const { user } = useAuth();

  // 상태 관리
  const [searchText, setSearchText] = useState('');
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [isWeekView, setIsWeekView] = useState(false);
  const [praises, setPraises] = useState<Praise[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentPeriod, setCurrentPeriod] = useState({
    year: new Date().getFullYear(),
    month: new Date().getMonth() + 1,
    weekReference: new Date().toISOString().split('T')[0]
  });

  // 월별 데이터 로드
  const loadMonthlyData = useCallback(async (year: number, month: number) => {
    setLoading(true);
    try {
      const response = await praiseApi.getMonthlyPraises({
        year,
        month,
      });

      console.log('---- monthly praise response', response);

      if (response.success) {
        // data가 배열인 경우와 객체인 경우 모두 처리
        if (Array.isArray(response.data)) {
          setPraises(response.data);
          console.log('월별 칭찬 데이터 로드 완료 (배열):', {
            period: `${year}-${month}`,
            count: response.data.length,
          });
        } else if (response.data && response.data.praises) {
          setPraises(response.data.praises);
          console.log('월별 칭찬 데이터 로드 완료 (객체):', {
            period: `${year}-${month}`,
            count: response.data.total_count || response.data.praises.length,
            range: response.data.period_info
          });
        } else {
          // 데이터가 없는 경우
          setPraises([]);
          console.log('월별 칭찬 데이터 없음:', {
            period: `${year}-${month}`,
            message: response.message || '데이터가 없습니다.'
          });
        }
      } else {
        console.error('월별 칭찬 데이터 로드 실패:', response.error);
        setPraises([]);
      }
    } catch (error) {
      console.error('월별 칭찬 API 요청 실패:', error);
      setPraises([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // 주별 데이터 로드
  const loadWeeklyData = useCallback(async (referenceDate: string) => {
    setLoading(true);
    try {
      const response = await praiseApi.getWeeklyPraises({
        reference_date: referenceDate,
      });

      console.log('---- weekly praise response', response);

      if (response.success) {
        // data가 배열인 경우와 객체인 경우 모두 처리
        if (Array.isArray(response.data)) {
          setPraises(response.data);
          console.log('주별 칭찬 데이터 로드 완료 (배열):', {
            reference: referenceDate,
            count: response.data.length,
          });
        } else if (response.data && response.data.praises) {
          setPraises(response.data.praises);
          console.log('주별 칭찬 데이터 로드 완료 (객체):', {
            reference: referenceDate,
            count: response.data.total_count || response.data.praises.length,
            range: response.data.period_info
          });
        } else {
          // 데이터가 없는 경우
          setPraises([]);
          console.log('주별 칭찬 데이터 없음:', {
            reference: referenceDate,
            message: response.message || '데이터가 없습니다.'
          });
        }
      } else {
        console.error('주별 칭찬 데이터 로드 실패:', response.error);
        setPraises([]);
      }
    } catch (error) {
      console.error('주별 칭찬 API 요청 실패:', error);
      setPraises([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // 일별 데이터 로드
  const loadDailyData = useCallback(async (date: string) => {
    setLoading(true);
    try {
      const response = await praiseApi.getDailyPraises({
        date
      });

      console.log('---- daily praise response', response);

      if (response.success) {
        // data가 배열인 경우와 객체인 경우 모두 처리
        if (Array.isArray(response.data)) {
          setPraises(response.data);
          console.log('일별 칭찬 데이터 로드 완료 (배열):', {
            date,
            count: response.data.length,
          });
        } else if (response.data && response.data.praises) {
          setPraises(response.data.praises);
          console.log('일별 칭찬 데이터 로드 완료 (객체):', {
            date,
            count: response.data.total_count || response.data.praises.length
          });
        } else {
          // 데이터가 없는 경우
          setPraises([]);
          console.log('일별 칭찬 데이터 없음:', {
            date,
            message: response.message || '데이터가 없습니다.'
          });
        }
      } else {
        console.error('일별 칭찬 데이터 로드 실패:', response.error);
        setPraises([]);
      }
    } catch (error) {
      console.error('일별 칭찬 API 요청 실패:', error);
      setPraises([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // 초기 데이터 로드
  useEffect(() => {
    loadMonthlyData(currentPeriod.year, currentPeriod.month);
  }, [loadMonthlyData, currentPeriod.year, currentPeriod.month]);

  // 주간 변경 핸들러
  const handleWeekChange = useCallback(
    async (weekInfo: { weekStart: string; weekEnd: string; referenceDate: string }) => {
      console.log('주간 변경 >>>> :', weekInfo);

      try {
        const response = await praiseApi.getWeeklyPraises({
          reference_date: weekInfo.referenceDate
        });

        console.log('---- weekly praise response', response);

        if (response.success) {
          // data가 배열인 경우와 객체인 경우 모두 처리
          if (Array.isArray(response.data)) {
            setPraises(response.data);
            console.log('주간 변경 - 칭찬 데이터 로드 완료 (배열):', {
              reference: weekInfo.referenceDate,
              weekRange: `${weekInfo.weekStart} ~ ${weekInfo.weekEnd}`,
              count: response.data.length,
            });
          } else if (response.data && response.data.praises) {
            setPraises(response.data.praises);
            console.log('주간 변경 - 칭찬 데이터 로드 완료 (객체):', {
              reference: weekInfo.referenceDate,
              weekRange: `${weekInfo.weekStart} ~ ${weekInfo.weekEnd}`,
              count: response.data.total_count || response.data.praises.length,
              range: response.data.period_info
            });
          } else {
            // 데이터가 없는 경우
            setPraises([]);
            console.log('주간 변경 - 칭찬 데이터 없음:', {
              reference: weekInfo.referenceDate,
              message: response.message || '데이터가 없습니다.'
            });
          }
        } else {
          console.error('주간 변경 - 칭찬 데이터 로드 실패:', response.error);
          setPraises([]);
        }
      } catch (error) {
        console.error('주간 변경 - 칭찬 API 요청 실패:', error);
        setPraises([]);
      }

      // 현재 기간 업데이트
      setCurrentPeriod(prev => ({
        ...prev,
        weekReference: weekInfo.referenceDate,
      }));

      // 선택된 날짜 초기화
      setSelectedDate(null);
    },
    []
  );

  // 월 변경 핸들러
  const handleMonthChange = useCallback(
    async (month: { year: number; month: number; dateString: string }) => {
      console.log('월 변경 >>>> :', month);

      // 월간 모드일 때만 월별 데이터 로드
      if (!isWeekView) {
        try {
          const response = await praiseApi.getMonthlyPraises({
            year: month.year,
            month: month.month,
          });

          console.log('---- monthly praise response', response);

          if (response.success) {
            // data가 배열인 경우와 객체인 경우 모두 처리
            if (Array.isArray(response.data)) {
              setPraises(response.data);
              console.log('월 변경 - 칭찬 데이터 로드 완료 (배열):', {
                period: `${month.year}-${month.month}`,
                count: response.data.length,
              });
            } else if (response.data && response.data.praises) {
              setPraises(response.data.praises);
              console.log('월 변경 - 칭찬 데이터 로드 완료 (객체):', {
                period: `${month.year}-${month.month}`,
                count: response.data.total_count || response.data.praises.length,
              });
            } else {
              // 데이터가 없는 경우
              setPraises([]);
              console.log('월 변경 - 칭찬 데이터 없음:', {
                period: `${month.year}-${month.month}`,
                message: response.message || '데이터가 없습니다.'
              });
            }
          } else {
            console.error('월 변경 - 칭찬 데이터 로드 실패:', response.error);
            setPraises([]);
          }
        } catch (error) {
          console.error('월 변경 - 칭찬 API 요청 실패:', error);
          setPraises([]);
        }
      }

      setCurrentPeriod({
        year: month.year,
        month: month.month,
        weekReference: month.dateString,
      });

      // 선택된 날짜 초기화
      setSelectedDate(null);

      // 주간 모드일 때는 해당 월의 첫 주 데이터 로드
      if (isWeekView) {
        const firstDayOfMonth = `${month.year}-${month.month
          .toString()
          .padStart(2, '0')}-01`;
        loadWeeklyData(firstDayOfMonth);
      }
    },
    [isWeekView, loadWeeklyData]
  );

  // 날짜 선택 핸들러
  const handleDatePress = useCallback((dateString: string) => {
    console.log('날짜 선택:', dateString);

    if (selectedDate === dateString) {
      // 같은 날짜 다시 클릭 시 선택 해제하고 원래 모드로 복귀
      setSelectedDate(null);

      if (isWeekView) {
        loadWeeklyData(currentPeriod.weekReference);
      } else {
        loadMonthlyData(currentPeriod.year, currentPeriod.month);
      }
    } else {
      // 새 날짜 선택 시 해당 일의 데이터만 로드
      setSelectedDate(dateString);
      loadDailyData(dateString);
    }
  }, [selectedDate, isWeekView, currentPeriod, loadWeeklyData, loadMonthlyData, loadDailyData]);

  // 주/월 모드 토글 핸들러
  const handleWeekModeToggle = useCallback(() => {
    console.log('주/월 모드 토글:', !isWeekView ? '주간' : '월간');

    const newIsWeekView = !isWeekView;
    setIsWeekView(newIsWeekView);
    setSelectedDate(null);

    if (newIsWeekView) {
      // 주간 모드로 전환
      loadWeeklyData(currentPeriod.weekReference);
    } else {
      // 월간 모드로 전환
      loadMonthlyData(currentPeriod.year, currentPeriod.month);
    }
  }, [isWeekView, currentPeriod, loadWeeklyData, loadMonthlyData]);

  // 검색 필터링
  const filteredPraises = useMemo(() => {
    if (!searchText.trim()) return praises;

    const searchLower = searchText.toLowerCase();
    return praises.filter(item =>
      item.title.toLowerCase().includes(searchLower) ||
      item.content.toLowerCase().includes(searchLower) ||
      item.author_name?.toLowerCase().includes(searchLower) ||
      item.recipient.toLowerCase().includes(searchLower)
    );
  }, [praises, searchText]);

  // 날짜에 칭찬이 있는지 확인하는 함수
  const hasPraisesForDate = useCallback((dateString: string) => {
    return praises.some(p => {
      const praiseDate = p.createdAt ? p.createdAt.split('T')[0] : '';
      return praiseDate === dateString;
    });
  }, [praises]);

  // 검색 초기화
  const handleClearSearch = () => {
    setSearchText('');
    setSelectedDate(null);

    if (isWeekView) {
      loadWeeklyData(currentPeriod.weekReference);
    } else {
      loadMonthlyData(currentPeriod.year, currentPeriod.month);
    }
  };

  // 칭찬 클릭 핸들러
  const handlePraisePress = (item: Praise) => {
    navigation.navigate('PraiseDetail', { praise: item });
  };

  // 날짜별로 칭찬을 그룹화하는 함수
  const groupPraisesByDate = useMemo(() => {
    return filteredPraises.reduce((acc, praise) => {
      // createdAt에서 날짜 부분만 추출
      const date = praise.createdAt ? praise.createdAt.split('T')[0] : '';
      if (date && !acc[date]) {
        acc[date] = [];
      }
      if (date) {
        acc[date].push(praise);
      }
      return acc;
    }, {} as Record<string, Praise[]>);
  }, [filteredPraises]);

  // 헤더 렌더링
  const renderHeader = () => (
    <View style={styles.header}>
      <Text style={[styles.headerTitle, { color: colors.text.primary }]}>칭찬하기</Text>
      <View style={styles.headerActions}>
        <TouchableOpacity
          onPress={() => navigation.navigate('PraiseForm', { mode: 'create' })}
          style={[styles.addButton, { backgroundColor: colors.primary.coral }]}
        >
          <MaterialCommunityIcons name="plus" size={20} color={colors.text.white} />
        </TouchableOpacity>
        <TouchableOpacity onPress={toggleTheme} style={styles.themeToggle}>
          {theme === 'light' ?
            <Ionicons name="moon-outline" size={20} color={colors.text.primary} />
            : <Ionicons name="sunny-outline" size={20} color={colors.text.primary} />}
        </TouchableOpacity>
      </View>
    </View>
  );

  // 검색 바 렌더링
  const renderSearchBar = () => (
    <View style={styles.searchSection}>
      <View style={[styles.searchContainer, { backgroundColor: colors.background.card }]}>
        <MaterialCommunityIcons name="magnify" size={20} color={colors.text.secondary} />
        <TextInput
          style={[styles.searchInput, { color: colors.text.primary }]}
          placeholder="제목, 내용, 작성자, 대상자로 검색..."
          placeholderTextColor={colors.text.secondary}
          value={searchText}
          onChangeText={setSearchText}
        />
        {(searchText || selectedDate) && (
          <TouchableOpacity onPress={handleClearSearch} style={styles.clearButton}>
            <MaterialCommunityIcons name="close-circle" size={20} color={colors.text.secondary} />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  // 캘린더 렌더링
  const renderCalendar = () => (
    <Calendar
      variant="list"
      selectedDate={selectedDate}
      onDatePress={handleDatePress}
      onMonthChange={handleMonthChange}
      onWeekChange={handleWeekChange}
      subtext={`총 ${filteredPraises.length}개의 칭찬`}
      hasDataForDate={hasPraisesForDate}
      initialDate={`${currentPeriod.year}-${currentPeriod.month.toString().padStart(2, '0')}-01`}
      onWeekModeToggle={handleWeekModeToggle}
      isWeekView={isWeekView}
    />
  );

  // 칭찬 아이템 렌더링 - key prop을 인덱스와 함께 처리
  const renderPraiseItem = (item: Praise, index: number) => {
    const createdDate = new Date(item.createdAt);
    const displayDate = createdDate.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    // 고유한 key 생성
    const uniqueKey = item.idx ? `praise-${item.idx}` : `praise-${item.title}-${index}`;

    return (
      <TouchableOpacity
        key={uniqueKey}
        style={[styles.listItem, { backgroundColor: colors.background.card }]}
        onPress={() => handlePraisePress(item)}
        activeOpacity={0.7}
      >
        <View style={[styles.itemIcon, { backgroundColor: colors.primary.yellow }]}>
          <Image
            source={require("../assets/images/angel.png")}
            style={styles.itemIconImage}
          />
        </View>
        <View style={styles.itemContent}>
          <Text style={[styles.itemTitle, { color: colors.text.primary }]}>{item.title}</Text>
          <Text style={[styles.itemAuthor, { color: colors.text.secondary }]}>
            {item.author_name || '나'} → {item.recipients?.join(',')}
          </Text>
          <Text style={[styles.itemPreview, { color: colors.text.secondary }]} numberOfLines={2}>
            {item.content}
          </Text>
          <View style={styles.itemFooter}>
            <Text style={[styles.itemDate, { color: colors.text.secondary }]}>{displayDate}</Text>
            <View style={styles.itemActions}>
              <View style={[
                styles.statusChip,
                { backgroundColor: item.status === 'completed' ? colors.primary.coral : colors.background.cardSecondary }
              ]}>
                <Text style={[
                  styles.statusText,
                  { color: item.status === 'completed' ? colors.text.white : colors.text.secondary }
                ]}>
                  {item.status === 'completed' ? '전달됨' : '대기중'}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  // 칭찬 목록 렌더링
  const renderPraisesList = () => {
    if (loading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary.coral} />
          <Text style={[styles.loadingText, { color: colors.text.secondary }]}>
            칭찬을 불러오는 중...
          </Text>
        </View>
      );
    }

    if (filteredPraises.length === 0) {
      return (
        <View style={styles.emptyState}>
          <MaterialCommunityIcons name="emoticon-happy-outline" size={64} color={colors.text.secondary} />
          <Text style={[styles.emptyStateText, { color: colors.text.secondary }]}>
            {searchText || selectedDate ? '검색 결과가 없습니다' : '칭찬이 없습니다'}
          </Text>
          {(searchText || selectedDate) && (
            <TouchableOpacity onPress={handleClearSearch} style={styles.clearFilterButton}>
              <Text style={[styles.clearFilterText, { color: colors.primary.coral }]}>필터 초기화</Text>
            </TouchableOpacity>
          )}
        </View>
      );
    }

    if (selectedDate) {
      // 선택된 날짜의 칭찬만 표시
      const selectedDateDisplay = new Date(selectedDate).toLocaleDateString('ko-KR', {
        month: 'long',
        day: 'numeric'
      });

      return (
        <View style={styles.listContainer}>
          <Text style={[styles.listTitle, { color: colors.text.primary }]}>
            {selectedDateDisplay}의 칭찬
          </Text>
          {filteredPraises.map((item, index) => renderPraiseItem(item, index))}
        </View>
      );
    }

    // 날짜별로 그룹화하여 표시
    return (
      <View style={styles.listContainer}>
        {Object.entries(groupPraisesByDate)
          .sort(([a], [b]) => new Date(b).getTime() - new Date(a).getTime())
          .map(([date, praises]) => {
            const dateDisplay = new Date(date).toLocaleDateString('ko-KR', {
              month: 'long',
              day: 'numeric'
            });

            return (
              <View key={`date-group-${date}`} style={styles.dateGroup}>
                <Text style={[styles.dateGroupTitle, { color: colors.text.primary }]}>
                  {dateDisplay} ({praises.length}개)
                </Text>
                {praises.map((item, index) => renderPraiseItem(item, index))}
              </View>
            );
          })}
      </View>
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background.primary }]}>
      <StatusBar
        barStyle={theme === 'dark' ? 'light-content' : 'dark-content'}
        backgroundColor={colors.background.primary}
      />

      {renderHeader()}

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          {renderSearchBar()}
          {renderCalendar()}
          {renderPraisesList()}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: dimensions.spacing.lg,
    paddingVertical: dimensions.spacing.md,
  },
  headerTitle: {
    fontSize: typography.sizes.xl,
    fontWeight: typography.weights.bold,
    fontFamily: typography.fontFamily.regular,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: dimensions.spacing.sm,
  },
  addButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  themeToggle: {
    padding: dimensions.spacing.sm,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingHorizontal: dimensions.spacing.lg,
  },
  searchSection: {
    marginBottom: dimensions.spacing.lg,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: dimensions.spacing.md,
    paddingVertical: dimensions.spacing.sm,
    borderRadius: dimensions.borderRadius.lg,
    gap: dimensions.spacing.sm,
  },
  searchInput: {
    flex: 1,
    fontSize: typography.sizes.md,
    fontFamily: typography.fontFamily.regular,
  },
  clearButton: {
    padding: dimensions.spacing.xs,
  },

  // Loading
  loadingContainer: {
    alignItems: 'center',
    paddingVertical: dimensions.spacing.xl,
  },
  loadingText: {
    marginTop: dimensions.spacing.md,
    fontSize: typography.sizes.md,
    fontFamily: typography.fontFamily.regular,
  },

  // List Section
  listContainer: {
    marginBottom: dimensions.spacing.xl,
  },
  listTitle: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.semibold,
    fontFamily: typography.fontFamily.regular,
    marginBottom: dimensions.spacing.md,
  },
  dateGroup: {
    marginBottom: dimensions.spacing.lg,
  },
  dateGroupTitle: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.semibold,
    fontFamily: typography.fontFamily.regular,
    marginBottom: dimensions.spacing.sm,
  },
  listItem: {
    flexDirection: 'row',
    padding: dimensions.spacing.md,
    borderRadius: dimensions.borderRadius.lg,
    marginBottom: dimensions.spacing.sm,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  itemIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: dimensions.spacing.md,
  },
  itemIconImage: {
    width: 28,
    height: 28,
  },
  itemContent: {
    flex: 1,
  },
  itemTitle: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.semibold,
    fontFamily: typography.fontFamily.regular,
    marginBottom: dimensions.spacing.xs,
  },
  itemAuthor: {
    fontSize: typography.sizes.sm,
    fontFamily: typography.fontFamily.regular,
    marginBottom: dimensions.spacing.xs,
  },
  itemPreview: {
    fontSize: typography.sizes.sm,
    fontFamily: typography.fontFamily.regular,
    lineHeight: typography.sizes.sm * 1.4,
    marginBottom: dimensions.spacing.sm,
  },
  itemFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemDate: {
    fontSize: typography.sizes.xs,
    fontFamily: typography.fontFamily.regular,
  },
  itemActions: {
    flexDirection: 'row',
    gap: dimensions.spacing.xs,
  },
  statusChip: {
    paddingHorizontal: dimensions.spacing.sm,
    paddingVertical: dimensions.spacing.xs,
    borderRadius: dimensions.borderRadius.sm,
  },
  statusText: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.medium,
    fontFamily: typography.fontFamily.regular,
  },

  // Empty State
  emptyState: {
    alignItems: 'center',
    paddingVertical: dimensions.spacing.xl,
  },
  emptyStateText: {
    fontSize: typography.sizes.md,
    fontFamily: typography.fontFamily.regular,
    marginTop: dimensions.spacing.md,
    marginBottom: dimensions.spacing.lg,
  },
  clearFilterButton: {
    paddingHorizontal: dimensions.spacing.lg,
    paddingVertical: dimensions.spacing.sm,
  },
  clearFilterText: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.medium,
    fontFamily: typography.fontFamily.regular,
  },
});