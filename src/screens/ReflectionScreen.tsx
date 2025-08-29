import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Image,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useColors } from '../hooks/useColors.ts';
import { useTheme } from '../context/ThemeContext.tsx';
import { typography } from '../styles/typography.ts';
import { dimensions } from '../styles/dimensions.ts';
import { ReflectionDetailModal } from '../components/reflection/ReflectionDetailModal.tsx';
import { Calendar } from '../components/common/Calendar.tsx';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { ReflectionFormModal } from '../components/reflection/ReflectionFormModal.tsx';

// 더 많은 반성문 데이터
const MOCK_REFLECTIONS = [
  {
    id: '1',
    title: '업무 중 실수에 대한 반성',
    content: '오늘 중요한 프레젠테이션 중에 실수를 했습니다. 준비가 부족했던 것 같습니다. 다음번에는 더 철저히 준비하고, 동료들과 미리 리허설을 해보겠습니다.',
    author: '홍길동',
    recipient: '팀장님',
    date: '2025-08-27',
    displayDate: '2025년 8월 27일',
    reward: '점심 사기',
    status: 'pending' as const,
  },
  {
    id: '2',
    title: '회의 시간에 집중하지 못함',
    content: '이번 주 팀 회의에서 계속 딴생각을 했습니다. 동료들이 발표하는 동안 집중하지 못해서 중요한 내용을 놓쳤습니다.',
    author: '김영희',
    recipient: '팀원들',
    date: '2025-08-26',
    displayDate: '2025년 8월 26일',
    reward: '커피 사기',
    status: 'completed' as const,
  },
  {
    id: '3',
    title: '프로젝트 지연에 대한 반성',
    content: '담당하고 있던 프로젝트의 마감일을 지키지 못했습니다. 일정 관리가 미흡했고, 중간에 발생한 문제들을 제때 공유하지 못했습니다.',
    author: '이민호',
    recipient: '프로젝트 팀',
    date: '2025-08-25',
    displayDate: '2025년 8월 25일',
    reward: '디저트 사기',
    status: 'pending' as const,
  },
  {
    id: '4',
    title: '동료와의 의견 충돌',
    content: '동료와 업무 방식에 대해 의견이 달라서 감정적으로 대응했습니다. 더 차분하게 이야기했어야 했는데 후회됩니다.',
    author: '박서준',
    recipient: '팀원들',
    date: '2025-08-24',
    displayDate: '2025년 8월 24일',
    reward: '간식 사기',
    status: 'completed' as const,
  },
  {
    id: '5',
    title: '고객 응대 실수',
    content: '고객의 요구사항을 제대로 파악하지 못해서 잘못된 정보를 전달했습니다. 더 신중하게 확인하고 답변했어야 했습니다.',
    author: '최지우',
    recipient: '고객',
    date: '2025-08-23',
    displayDate: '2025년 8월 23일',
    reward: '음료 사기',
    status: 'pending' as const,
  },
  {
    id: '6',
    title: '코드 리뷰 부족',
    content: '급하다는 이유로 코드 리뷰를 대충했습니다. 그 결과 나중에 버그가 발견되어 팀에 피해를 주었습니다.',
    author: '정한솔',
    recipient: '개발팀',
    date: '2025-08-22',
    displayDate: '2025년 8월 22일',
    reward: '치킨 사기',
    status: 'completed' as const,
  },
];

// 날짜별로 반성문을 그룹화하는 함수
const groupReflectionsByDate = (reflections: typeof MOCK_REFLECTIONS) => {
  return reflections.reduce((acc, reflection) => {
    const date = reflection.date;
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(reflection);
    return acc;
  }, {} as Record<string, typeof MOCK_REFLECTIONS>);
};

export const ReflectionScreen: React.FC = () => {
  const colors = useColors();
  const { theme, toggleTheme } = useTheme();

  // 상태 관리
  const [searchText, setSearchText] = useState('');
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedReflection, setSelectedReflection] = useState<typeof MOCK_REFLECTIONS[0] | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isFormModalVisible, setIsFormModalVisible] = useState(false); // 추가
  const [isWeekView, setIsWeekView] = useState(false); // 주/월 단위 보기 상태 추가


  const handleReflectionSubmit = (formData: { title: string; content: string; recipient: string; reward: string; }) => {
    console.log('새 반성문 등록:', formData);
    // TODO: 실제 API 호출로 반성문 저장
    // 성공적으로 저장되면 목록을 새로고침하거나 상태를 업데이트
  };

  // 검색 및 필터링
  const filteredReflections = useMemo(() => {
    let filtered = MOCK_REFLECTIONS;

    // 텍스트 검색
    if (searchText) {
      filtered = filtered.filter(item =>
        item.title.toLowerCase().includes(searchText.toLowerCase()) ||
        item.content.toLowerCase().includes(searchText.toLowerCase()) ||
        item.author.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    // 날짜 필터링
    if (selectedDate) {
      filtered = filtered.filter(item => item.date === selectedDate);
    }

    return filtered;
  }, [searchText, selectedDate]);

  // 날짜별 그룹화
  const groupedReflections = useMemo(() => {
    return groupReflectionsByDate(filteredReflections);
  }, [filteredReflections]);

  // 반성문 클릭 핸들러
  const handleReflectionPress = (item: typeof MOCK_REFLECTIONS[0]) => {
    setSelectedReflection(item);
    setIsModalVisible(true);
  };

  // 모달 닫기 핸들러
  const handleModalClose = () => {
    setIsModalVisible(false);
    setSelectedReflection(null);
  };

  // 날짜에 반성문이 있는지 확인하는 함수
  const hasReflectionsForDate = (dateString: string) => {
    return MOCK_REFLECTIONS.some(r => r.date === dateString);
  };

  // 검색 초기화
  const handleClearSearch = () => {
    setSearchText('');
    setSelectedDate(null);
  };

  // 헤더 렌더링
  const renderHeader = () => (
    <View style={styles.header}>
      <Text style={[styles.headerTitle, { color: colors.text.primary }]}>반성문</Text>
      <View style={styles.headerActions}>
        <TouchableOpacity
          onPress={() => setIsFormModalVisible(true)}
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
          placeholder="제목, 내용, 작성자로 검색..."
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
      onDatePress={(dateString) => {
        setSelectedDate(selectedDate === dateString ? null : dateString);
      }}
      onMonthChange={(month) => {
        console.log('Month changed to:', month);
      }}
      subtext={`총 ${filteredReflections.length}개의 반성문`}
      hasDataForDate={hasReflectionsForDate}
      initialDate="2025-08-27"
      onWeekModeToggle={() => setIsWeekView(!isWeekView)}
      isWeekView={isWeekView}
    />
  );



  // 반성문 아이템 렌더링
  const renderReflectionItem = (item: typeof MOCK_REFLECTIONS[0]) => (
    <TouchableOpacity
      key={item.id}
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
          {item.author} → {item.recipient}
        </Text>
        <Text style={[styles.itemPreview, { color: colors.text.secondary }]} numberOfLines={2}>
          {item.content}
        </Text>
        <View style={styles.itemFooter}>
          <Text style={[styles.itemDate, { color: colors.text.secondary }]}>{item.displayDate}</Text>
          <View style={styles.itemActions}>
            <View style={[styles.actionChip, { backgroundColor: colors.background.cardSecondary }]}>
              <Text style={[styles.actionText, { color: colors.text.secondary }]}>{item.reward}</Text>
            </View>
            <View style={[
              styles.statusChip,
              { backgroundColor: item.status === 'completed' ? colors.primary.coral : colors.background.cardSecondary }
            ]}>
              <Text style={[
                styles.statusText,
                { color: item.status === 'completed' ? colors.text.white : colors.text.secondary }
              ]}>
                {item.status === 'completed' ? '완료' : '대기중'}
              </Text>
            </View>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  // 반성문 목록 렌더링
  const renderReflectionsList = () => {
    if (filteredReflections.length === 0) {
      return (
        <View style={styles.emptyState}>
          <MaterialCommunityIcons name="emoticon-sad-outline" size={64} color={colors.text.secondary} />
          <Text style={[styles.emptyStateText, { color: colors.text.secondary }]}>
            {searchText || selectedDate ? '검색 결과가 없습니다' : '반성문이 없습니다'}
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
      // 선택된 날짜의 반성문만 표시
      return (
        <View style={styles.listContainer}>
          <Text style={[styles.listTitle, { color: colors.text.primary }]}>
            {new Date(selectedDate).toLocaleDateString('ko-KR', { month: 'long', day: 'numeric' })}의 반성문
          </Text>
          {filteredReflections.map(renderReflectionItem)}
        </View>
      );
    }

    // 날짜별로 그룹화하여 표시
    return (
      <View style={styles.listContainer}>
        {Object.entries(groupedReflections)
          .sort(([a], [b]) => new Date(b).getTime() - new Date(a).getTime())
          .map(([date, reflections]) => (
            <View key={date} style={styles.dateGroup}>
              <Text style={[styles.dateGroupTitle, { color: colors.text.primary }]}>
                {new Date(date).toLocaleDateString('ko-KR', { month: 'long', day: 'numeric' })}
              </Text>
              {reflections.map(renderReflectionItem)}
            </View>
          ))}
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
          {renderReflectionsList()}
        </View>
      </ScrollView>

      {/* 반성문 상세 모달 */}
      {selectedReflection && (
        <ReflectionDetailModal
          visible={isModalVisible}
          onClose={handleModalClose}
          reflection={selectedReflection}
        />
      )}

      {/* 반성문 등록 폼 모달 */}
      <ReflectionFormModal
        visible={isFormModalVisible}
        onClose={() => setIsFormModalVisible(false)}
        onSubmit={handleReflectionSubmit}
      />
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
  actionChip: {
    paddingHorizontal: dimensions.spacing.sm,
    paddingVertical: dimensions.spacing.xs,
    borderRadius: dimensions.borderRadius.sm,
  },
  actionText: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.medium,
    fontFamily: typography.fontFamily.regular,
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