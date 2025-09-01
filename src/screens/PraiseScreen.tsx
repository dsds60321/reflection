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
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useColors } from '../hooks/useColors';
import { useTheme } from '../context/ThemeContext';
import { typography } from '../styles/typography';
import { dimensions } from '../styles/dimensions';
import { Calendar } from '../components/common/Calendar';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

// 칭찬 데이터
const MOCK_PRAISES = [
  {
    id: '1',
    title: '업무 중 도움을 주신 것에 대한 칭찬',
    content: '이번 프로젝트에서 정말 적극적으로 도와주셔서 덕분에 성공적으로 마무리할 수 있었습니다. 언제나 긍정적인 에너지로 팀을 이끌어주셔서 감사합니다.',
    author: '홍길동',
    recipient: '김영희님',
    date: '2025-08-27',
    displayDate: '2025년 8월 27일',
    status: 'pending' as const,
  },
  {
    id: '2',
    title: '회의 시간에 좋은 의견 제시',
    content: '이번 주 팀 회의에서 정말 좋은 아이디어를 제시해주셔서 감사했습니다. 덕분에 프로젝트 방향성을 명확히 할 수 있었어요.',
    author: '김영희',
    recipient: '팀원들',
    date: '2025-08-26',
    displayDate: '2025년 8월 26일',
    status: 'completed' as const,
  },
  {
    id: '3',
    title: '프로젝트 성공에 대한 칭찬',
    content: '담당하고 있던 프로젝트를 일정에 맞춰 완벽히 완료해주셨습니다. 중간에 발생한 문제들도 빠르게 해결해주셔서 정말 감사했습니다.',
    author: '이민호',
    recipient: '프로젝트 팀',
    date: '2025-08-25',
    displayDate: '2025년 8월 25일',
    status: 'pending' as const,
  },
  {
    id: '4',
    title: '동료와의 원활한 협업',
    content: '동료와 업무 방식에 대해 의견이 다를 때도 차분하게 이야기해주셔서 좋은 결론을 낼 수 있었습니다. 덕분에 팀워크가 더욱 좋아졌어요.',
    author: '박서준',
    recipient: '팀원들',
    date: '2025-08-24',
    displayDate: '2025년 8월 24일',
    status: 'completed' as const,
  },
  {
    id: '5',
    title: '고객 응대 칭찬',
    content: '고객의 요구사항을 정확히 파악하고 친절하게 응대해주셔서 고객 만족도가 높았습니다. 정말 프로페셔널한 모습이었어요.',
    author: '최지우',
    recipient: '고객서비스팀',
    date: '2025-08-23',
    displayDate: '2025년 8월 23일',
    status: 'pending' as const,
  },
  {
    id: '6',
    title: '코드 리뷰 감사합니다',
    content: '꼼꼼하게 코드 리뷰를 해주셔서 버그를 미리 발견할 수 있었습니다. 덕분에 팀 전체의 코드 품질이 향상되었어요.',
    author: '정한솔',
    recipient: '개발팀',
    date: '2025-08-22',
    displayDate: '2025년 8월 22일',
    status: 'completed' as const,
  },
];


// 날짜별로 칭찬을 그룹화하는 함수
const groupPraisesByDate = (praises: typeof MOCK_PRAISES) => {
  return praises.reduce((acc, praise) => {
    const date = praise.date;
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(praise);
    return acc;
  }, {} as Record<string, typeof MOCK_PRAISES>);
};

export const PraiseScreen: React.FC = () => {
  const colors = useColors();
  const { theme, toggleTheme } = useTheme();
  const navigation = useNavigation();

  // 상태 관리
  const [searchText, setSearchText] = useState('');
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [isWeekView, setIsWeekView] = useState(false);

  const handlePraiseSubmit = (formData: { title: string; content: string; recipient: string; }) => {
    console.log('새 칭찬 등록:', formData);
    // TODO: 실제 API 호출로 칭찬 저장
  };

  // 검색 및 필터링
  const filteredPraises = useMemo(() => {
    let filtered = MOCK_PRAISES;

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
  const groupedPraises = useMemo(() => {
    return groupPraisesByDate(filteredPraises);
  }, [filteredPraises]);

  // 칭찬 클릭 핸들러
  const handlePraisePress = (item: typeof MOCK_PRAISES[0]) => {
    navigation.navigate('PraiseDetail', { praise: item });
  };

  // 날짜에 칭찬이 있는지 확인하는 함수
  const hasPraisesForDate = (dateString: string) => {
    return MOCK_PRAISES.some(p => p.date === dateString);
  };

  // 검색 초기화
  const handleClearSearch = () => {
    setSearchText('');
    setSelectedDate(null);
  };

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
      subtext={`총 ${filteredPraises.length}개의 칭찬`}
      hasDataForDate={hasPraisesForDate}
      initialDate="2025-08-27"
      onWeekModeToggle={() => setIsWeekView(!isWeekView)}
      isWeekView={isWeekView}
    />
  );

  // 칭찬 아이템 렌더링
  const renderPraiseItem = (item: typeof MOCK_PRAISES[0]) => (
    <TouchableOpacity
      key={item.id}
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
          {item.author} → {item.recipient}
        </Text>
        <Text style={[styles.itemPreview, { color: colors.text.secondary }]} numberOfLines={2}>
          {item.content}
        </Text>
        <View style={styles.itemFooter}>
          <Text style={[styles.itemDate, { color: colors.text.secondary }]}>{item.displayDate}</Text>
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

  // 칭찬 목록 렌더링
  const renderPraisesList = () => {
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
      return (
        <View style={styles.listContainer}>
          <Text style={[styles.listTitle, { color: colors.text.primary }]}>
            {new Date(selectedDate).toLocaleDateString('ko-KR', { month: 'long', day: 'numeric' })}의 칭찬
          </Text>
          {filteredPraises.map(renderPraiseItem)}
        </View>
      );
    }

    // 날짜별로 그룹화하여 표시
    return (
      <View style={styles.listContainer}>
        {Object.entries(groupedPraises)
          .sort(([a], [b]) => new Date(b).getTime() - new Date(a).getTime())
          .map(([date, praises]) => (
            <View key={date} style={styles.dateGroup}>
              <Text style={[styles.dateGroupTitle, { color: colors.text.primary }]}>
                {new Date(date).toLocaleDateString('ko-KR', { month: 'long', day: 'numeric' })}
              </Text>
              {praises.map(renderPraiseItem)}
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
