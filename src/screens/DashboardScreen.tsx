import React, { useState, useMemo, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Image,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Calendar } from '../components/common/Calendar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useColors } from '../hooks/useColors';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { typography } from '../styles/typography';
import { dimensions } from '../styles/dimensions';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {
  dashboardApi,
  DashboardReflection,
  DashboardPraise
} from '../service/DashboardApiService';

export const DashboardScreen: React.FC = () => {
  const colors = useColors();
  const { theme, toggleTheme } = useTheme();
  const navigation = useNavigation();
  const { user } = useAuth();

  // 상태 관리
  const [activeTab, setActiveTab] = useState<'reflections' | 'praises'>('reflections');
  const [isWeekView, setIsWeekView] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [reflections, setReflections] = useState<DashboardReflection[]>([]);
  const [praises, setPraises] = useState<DashboardPraise[]>([]);
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
      const response = await dashboardApi.getMonthlyDashboard({
        year,
        month,
      });

      console.log('---- monthly dashboard response', response);

      if (response.success && response.data) {
        setReflections(response.data.reflectionList || []);
        setPraises(response.data.praiseList || []);
        console.log('월별 대시보드 데이터 로드 완료:', {
          period: `${year}-${month}`,
          reflections: response.data.reflectionList?.length || 0,
          praises: response.data.praiseList?.length || 0,
        });
      } else {
        console.error('월별 대시보드 데이터 로드 실패:', response.error);
        setReflections([]);
        setPraises([]);
      }
    } catch (error) {
      console.error('월별 대시보드 API 요청 실패:', error);
      setReflections([]);
      setPraises([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // 주별 데이터 로드
  const loadWeeklyData = useCallback(async (referenceDate: string) => {
    setLoading(true);
    try {
      const response = await dashboardApi.getWeeklyDashboard({
        reference_date: referenceDate,
      });

      console.log('---- weekly dashboard response', response);

      if (response.success && response.data) {
        setReflections(response.data.reflectionList || []);
        setPraises(response.data.praiseList || []);
        console.log('주별 대시보드 데이터 로드 완료:', {
          reference: referenceDate,
          reflections: response.data.reflectionList?.length || 0,
          praises: response.data.praiseList?.length || 0,
        });
      } else {
        console.error('주별 대시보드 데이터 로드 실패:', response.error);
        setReflections([]);
        setPraises([]);
      }
    } catch (error) {
      console.error('주별 대시보드 API 요청 실패:', error);
      setReflections([]);
      setPraises([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // 일별 데이터 로드
  const loadDailyData = useCallback(async (date: string) => {
    setLoading(true);
    try {
      const response = await dashboardApi.getDailyDashboard({
        date
      });

      console.log('---- daily dashboard response', response);

      if (response.success && response.data) {
        setReflections(response.data.reflectionList || []);
        setPraises(response.data.praiseList || []);
        console.log('일별 대시보드 데이터 로드 완료:', {
          date,
          reflections: response.data.reflectionList?.length || 0,
          praises: response.data.praiseList?.length || 0,
        });
      } else {
        console.error('일별 대시보드 데이터 로드 실패:', response.error);
        setReflections([]);
        setPraises([]);
      }
    } catch (error) {
      console.error('일별 대시보드 API 요청 실패:', error);
      setReflections([]);
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
        const response = await dashboardApi.getWeeklyDashboard({
          reference_date: weekInfo.referenceDate
        });

        console.log('---- weekly dashboard response', response);

        if (response.success && response.data) {
          setReflections(response.data.reflectionList || []);
          setPraises(response.data.praiseList || []);
          console.log('주간 변경 - 대시보드 데이터 로드 완료:', {
            reference: weekInfo.referenceDate,
            weekRange: `${weekInfo.weekStart} ~ ${weekInfo.weekEnd}`,
            reflections: response.data.reflectionList?.length || 0,
            praises: response.data.praiseList?.length || 0,
          });
        } else {
          console.error('주간 변경 - 대시보드 데이터 로드 실패:', response.error);
          setReflections([]);
          setPraises([]);
        }
      } catch (error) {
        console.error('주간 변경 - 대시보드 API 요청 실패:', error);
        setReflections([]);
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
          const response = await dashboardApi.getMonthlyDashboard({
            year: month.year,
            month: month.month,
          });

          console.log('---- monthly dashboard response', response);

          if (response.success && response.data) {
            setReflections(response.data.reflectionList || []);
            setPraises(response.data.praiseList || []);
            console.log('월 변경 - 대시보드 데이터 로드 완료:', {
              period: `${month.year}-${month.month}`,
              reflections: response.data.reflectionList?.length || 0,
              praises: response.data.praiseList?.length || 0,
            });
          } else {
            console.error('월 변경 - 대시보드 데이터 로드 실패:', response.error);
            setReflections([]);
            setPraises([]);
          }
        } catch (error) {
          console.error('월 변경 - 대시보드 API 요청 실패:', error);
          setReflections([]);
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

  // 필터링된 데이터
  const filteredReflections = useMemo(() => {
    if (!selectedDate) return reflections;
    return reflections.filter(reflection => {
      const reflectionDate = reflection.createdAt ? reflection.createdAt.split('T')[0] : '';
      return reflectionDate === selectedDate;
    });
  }, [reflections, selectedDate]);

  const filteredPraises = useMemo(() => {
    if (!selectedDate) return praises;
    return praises.filter(praise => {
      const praiseDate = praise.createdAt ? praise.createdAt.split('T')[0] : '';
      return praiseDate === selectedDate;
    });
  }, [praises, selectedDate]);

  // 날짜에 데이터가 있는지 확인하는 함수
  const hasDataForDate = useCallback((dateString: string) => {
    const hasReflections = reflections.some(r => {
      const reflectionDate = r.createdAt ? r.createdAt.split('T')[0] : '';
      return reflectionDate === dateString;
    });
    const hasPraises = praises.some(p => {
      const praiseDate = p.createdAt ? p.createdAt.split('T')[0] : '';
      return praiseDate === dateString;
    });
    return hasReflections || hasPraises;
  }, [reflections, praises]);

  // 반성문/칭찬 클릭 핸들러
  const handleReflectionPress = (item: DashboardReflection) => {
    navigation.navigate('ReflectionDetail', { reflection: item });
  };

  const handlePraisePress = (item: DashboardPraise) => {
    navigation.navigate('PraiseDetail', { praise: item });
  };

  const renderProfile = () => (
    <View style={styles.profileSection}>
      <View style={styles.profileRow}>
        <View style={[styles.profileAvatar, { backgroundColor: colors.background.cardSecondary }]}>
          <Ionicons name="person" size={30} color="#fff" />
        </View>
        <View style={[styles.addProfileButton, { backgroundColor: colors.background.cardSecondary }]}>
          <Text style={[styles.addButtonText, { color: colors.text.secondary }]}>›</Text>
        </View>
      </View>
      <Text style={[styles.profileName, { color: colors.text.primary }]}>me</Text>

      <View style={styles.profileInfo}>
        <View style={[styles.profileAvatar, { backgroundColor: colors.background.cardSecondary }]}>
          <Ionicons name="person" size={30} color="#fff" />
        </View>
        <View style={styles.profileDetails}>
          <Text style={[styles.profileTitle, { color: colors.text.primary }]}>me</Text>
          <Text style={[styles.profileSubtitle, { color: colors.text.secondary }]}>
            프로필에 자기소개를 입력해보세요
          </Text>
        </View>
        <TouchableOpacity style={styles.editButton}>
          <View style={[styles.editIcon, { borderColor: colors.primary.coral }]}>
            <Text style={[styles.editIconText, { color: colors.primary.coral }]}>+</Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderCalendar = () => {
    const completedReflections = reflections.filter(r => r.status === 'approved').length;
    const completedPraises = praises.filter(p => p.status === 'approved').length;

    return (
      <Calendar
        variant="dashboard"
        selectedDate={selectedDate}
        onDatePress={handleDatePress}
        onMonthChange={handleMonthChange}
        onWeekChange={handleWeekChange}
        stats={{
          reflectionCount: completedReflections,
          praiseCount: completedPraises,
        }}
        hasDataForDate={hasDataForDate}
        initialDate={`${currentPeriod.year}-${currentPeriod.month.toString().padStart(2, '0')}-01`}
        onWeekModeToggle={handleWeekModeToggle}
        isWeekView={isWeekView}
      />
    );
  };

  const renderTabNavigation = () => (
    <View style={styles.tabSection}>
      <View style={[styles.tabContainer, { backgroundColor: colors.background.cardSecondary }]}>
        <TouchableOpacity
          style={[
            styles.tabButton,
            activeTab === 'reflections' && { backgroundColor: colors.background.card }
          ]}
          onPress={() => setActiveTab('reflections')}
        >
          <Text style={[
            styles.tabText,
            { color: activeTab === 'reflections' ? colors.text.primary : colors.text.secondary }
          ]}>
            반성문
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.tabButton,
            activeTab === 'praises' && { backgroundColor: colors.background.card }
          ]}
          onPress={() => setActiveTab('praises')}
        >
          <Text style={[
            styles.tabText,
            { color: activeTab === 'praises' ? colors.text.primary : colors.text.secondary }
          ]}>
            칭찬
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderReflectionItem = (item: DashboardReflection, index: number) => {
    const createdDate = new Date(item.createdAt);
    const displayDate = createdDate.toLocaleDateString('ko-KR');
    const uniqueKey = `reflection-${item.title}-${index}`;

    return (
      <TouchableOpacity
        key={uniqueKey}
        style={[styles.listItem, { backgroundColor: colors.background.card }]}
        onPress={() => handleReflectionPress(item)}
        activeOpacity={0.7}
      >
        <View style={[styles.itemIcon, { backgroundColor: colors.primary.yellow }]}>
          <Image
            source={require("../assets/images/devil.png")}
            style={styles.itemIconImage}
          />
        </View>
        <View style={styles.itemContent}>
          <Text style={[styles.itemTitle, { color: colors.text.primary }]}>{item.title}</Text>
          <Text style={[styles.itemAuthor, { color: colors.text.secondary }]}>
            나 → {item.recipients?.join(', ')}
          </Text>
          <View style={styles.itemFooter}>
            <Text style={[styles.itemDate, { color: colors.text.secondary }]}>{displayDate}</Text>
            <View style={styles.itemActions}>
              <View style={[styles.actionChip, { backgroundColor: colors.background.cardSecondary }]}>
                <Text style={[styles.actionText, { color: colors.text.secondary }]}>{item.reward}</Text>
              </View>
              <View style={[
                styles.statusChip,
                { backgroundColor: item.status === 'approved' ? colors.primary.coral : colors.background.cardSecondary }
              ]}>
                <Text style={[
                  styles.statusText,
                  { color: item.status === 'approved' ? colors.text.white : colors.text.secondary }
                ]}>
                  {item.status === 'approved' ? '완료' : '대기중'}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const renderPraiseItem = (item: DashboardPraise, index: number) => {
    const createdDate = new Date(item.createdAt);
    const displayDate = createdDate.toLocaleDateString('ko-KR');
    const uniqueKey = `praise-${item.title}-${index}`;

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
            나 → {item.recipients?.join(', ')}
          </Text>
          <View style={styles.itemFooter}>
            <Text style={[styles.itemDate, { color: colors.text.secondary }]}>{displayDate}</Text>
            <View style={[
              styles.statusChip,
              { backgroundColor: item.status === 'approved' ? colors.primary.yellow : colors.background.cardSecondary }
            ]}>
              <Text style={[
                styles.statusText,
                { color: item.status === 'approved' ? colors.text.primary : colors.text.secondary }
              ]}>
                {item.status === 'approved' ? '전달됨' : '대기중'}
              </Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const renderListHeader = () => (
    <View style={styles.listHeader}>
      <Text style={[styles.listTitle, { color: colors.text.primary }]}>
        {selectedDate && (
          <Text style={[styles.datePrefix, { color: colors.primary.coral }]}>
            {new Date(selectedDate).toLocaleDateString('ko-KR', { month: 'long', day: 'numeric' })}
          </Text>
        )}
        {activeTab === 'reflections' ? '반성문 목록' : '칭찬 목록'}
      </Text>
      <TouchableOpacity
        onPress={() => {
          if (activeTab === 'reflections') {
            navigation.navigate('ReflectionForm', { mode: 'create' });
          } else {
            navigation.navigate('PraiseForm', { mode: 'create' });
          }
        }}
      >
        <Text style={[styles.addButton, { color: colors.text.secondary }]}>+</Text>
      </TouchableOpacity>
    </View>
  );

  const renderCurrentList = () => {
    const currentItems = activeTab === 'reflections' ? filteredReflections : filteredPraises;

    if (loading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary.coral} />
          <Text style={[styles.loadingText, { color: colors.text.secondary }]}>
            데이터를 불러오는 중...
          </Text>
        </View>
      );
    }

    // 데이터가 없을 때
    if (currentItems.length === 0) {
      return (
        <View style={styles.emptyState}>
          <MaterialCommunityIcons
            name={activeTab === 'reflections' ? 'emoticon-sad-outline' : 'emoticon-happy-outline'}
            size={64}
            color={colors.text.secondary}
          />
          <Text style={[styles.emptyStateText, { color: colors.text.secondary }]}>
            {selectedDate
              ? `선택한 날짜에 ${activeTab === 'reflections' ? '반성문' : '칭찬'}이 없습니다`
              : `${activeTab === 'reflections' ? '반성문' : '칭찬'}이 없습니다`
            }
          </Text>
          {selectedDate && (
            <TouchableOpacity onPress={() => setSelectedDate(null)} style={styles.clearFilterButton}>
              <Text style={[styles.clearFilterText, { color: colors.primary.coral }]}>전체 보기</Text>
            </TouchableOpacity>
          )}
        </View>
      );
    }

    return (
      <View style={styles.listContainer}>
        {renderListHeader()}
        {activeTab === 'reflections'
          ? filteredReflections.map((item, index) => renderReflectionItem(item, index))
          : filteredPraises.map((item, index) => renderPraiseItem(item, index))
        }
      </View>
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background.primary }]}>
      <StatusBar
        barStyle={theme === 'dark' ? 'light-content' : 'dark-content'}
        backgroundColor={colors.background.primary}
      />

      <View style={styles.header}>
        <TouchableOpacity onPress={toggleTheme} style={styles.themeToggle}>
          {theme === 'light' ?
            <Ionicons name="moon-outline" size={20} color="#000" />
            : <Ionicons name="sunny-outline" size={20} color="#fff" />}
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          {renderProfile()}
          {renderCalendar()}
          {renderTabNavigation()}
          {renderCurrentList()}
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
    justifyContent: 'flex-end',
    paddingHorizontal: dimensions.spacing.md,
    paddingVertical: dimensions.spacing.sm,
  },
  themeToggle: {
    padding: dimensions.spacing.sm,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingHorizontal: dimensions.spacing.md,
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

  // Profile Section
  profileSection: {
    marginBottom: dimensions.spacing.xl,
  },
  profileRow: {
    flexDirection: 'row',
    gap: dimensions.spacing.md,
    marginBottom: dimensions.spacing.sm,
  },
  profileAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addProfileButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButtonText: {
    fontSize: typography.sizes.xxl,
    fontWeight: typography.weights.light,
    fontFamily: typography.fontFamily.regular,
  },
  profileName: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.medium,
    fontFamily: typography.fontFamily.regular,
    marginBottom: dimensions.spacing.lg,
  },
  profileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: dimensions.spacing.md,
  },
  profileDetails: {
    flex: 1,
  },
  profileTitle: {
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.semibold,
    marginBottom: 2,
  },
  profileSubtitle: {
    fontSize: typography.sizes.sm,
    fontFamily: typography.fontFamily.regular,
  },
  editButton: {
    padding: dimensions.spacing.xs,
  },
  editIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 1,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
  },
  editIconText: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.bold,
  },

  // Tab Section
  tabSection: {
    alignItems: 'center',
    marginBottom: dimensions.spacing.md,
  },
  tabContainer: {
    flexDirection: 'row',
    borderRadius: dimensions.borderRadius.sm,
    padding: 4,
    width: '40%',
    alignSelf: 'flex-start',
  },
  tabButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: dimensions.spacing.sm,
    borderRadius: dimensions.borderRadius.sm,
    gap: dimensions.spacing.xs,
  },
  tabText: {
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.medium,
  },

  // List Section
  listContainer: {
    gap: dimensions.spacing.md,
    marginBottom: dimensions.spacing.xl,
  },
  listHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: dimensions.spacing.sm,
  },
  listTitle: {
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.semibold,
  },
  addButton: {
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.sizes.xl,
    fontWeight: typography.weights.light,
  },
  listItem: {
    flexDirection: 'row',
    padding: dimensions.spacing.md,
    borderRadius: dimensions.borderRadius.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
    marginBottom: dimensions.spacing.sm,
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
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.semibold,
    marginBottom: dimensions.spacing.xs,
  },
  itemAuthor: {
    fontSize: typography.sizes.sm,
    marginBottom: dimensions.spacing.sm,
  },
  itemFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemDate: {
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.sizes.xs,
  },
  itemActions: {
    flexDirection: 'row',
    gap: dimensions.spacing.xs,
  },
  actionChip: {
    paddingHorizontal: dimensions.spacing.sm,
    paddingVertical: dimensions.spacing.xs,
    borderRadius: dimensions.borderRadius.sm,
  },
  actionText: {
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.medium,
  },
  statusChip: {
    paddingHorizontal: dimensions.spacing.sm,
    paddingVertical: dimensions.spacing.xs,
    borderRadius: dimensions.borderRadius.sm,
  },
  statusText: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.medium,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: dimensions.spacing.xl,
  },
  emptyStateText: {
    fontSize: typography.sizes.md,
    fontFamily: typography.fontFamily.regular,
    textAlign: 'center',
    marginTop: dimensions.spacing.md,
    marginBottom: dimensions.spacing.md,
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
  datePrefix: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.semibold,
    fontFamily: typography.fontFamily.regular,
  },
});