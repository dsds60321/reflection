import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Image,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Calendar } from '../components/common/Calendar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useColors } from '../hooks/useColors';
import { useTheme } from '../context/ThemeContext';
import { typography } from '../styles/typography';
import { dimensions } from '../styles/dimensions';
import Ionicons from 'react-native-vector-icons/Ionicons';


// 반성문 관련 데이터
const MOCK_REFLECTIONS = [
  {
    id: '1',
    title: '업무 중 실수에 대한 반성',
    content: '오늘 중요한 프레젠테이션 중에 실수를 했습니다. 준비가 부족했던 것 같습니다. 다음번에는 더 철저히 준비하고, 동료들과 미리 리허설을 해보겠습니다. 이런 실수가 다시 일어나지 않도록 체크리스트를 만들어서 활용하겠습니다.',
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
    content: '이번 주 팀 회의에서 계속 딴생각을 했습니다. 동료들이 발표하는 동안 집중하지 못해서 중요한 내용을 놓쳤습니다. 앞으로는 회의 전에 충분한 휴식을 취하고, 메모를 적극적으로 하면서 참여하겠습니다.',
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
    content: '담당하고 있던 프로젝트의 마감일을 지키지 못했습니다. 일정 관리가 미흡했고, 중간에 발생한 문제들을 제때 공유하지 못했습니다. 앞으로는 주간 진행 상황을 정기적으로 보고하고, 문제가 생기면 즉시 상의하겠습니다.',
    author: '이민호',
    recipient: '프로젝트 팀',
    date: '2025-08-25',
    displayDate: '2025년 8월 25일',
    reward: '디저트 사기',
    status: 'pending' as const,
  },
];

// 칭찬 관련 데이터
const MOCK_PRAISES = [
  {
    id: '1',
    title: '프레젠테이션 너무 잘했어요!',
    content: '오늘 프레젠테이션이 정말 인상적이었습니다. 복잡한 내용을 이해하기 쉽게 설명해주셨고, 질문에 대한 답변도 명확했습니다. 덕분에 프로젝트에 대한 이해도가 높아졌습니다.',
    author: '홍길동',
    recipient: '나',
    date: '2025-08-27',
    displayDate: '2025년 8월 27일',
    status: 'completed' as const,
  },
  {
    id: '2',
    title: '코드 리뷰가 정말 도움이 되었습니다',
    content: '코드 리뷰에서 주신 피드백이 매우 유용했습니다. 성능 개선 방법과 더 깔끔한 코드 작성법을 알게 되었습니다. 앞으로도 이런 리뷰를 통해 많이 배우고 싶습니다.',
    author: '박민준',
    recipient: '김영희',
    date: '2025-08-26',
    displayDate: '2025년 8월 26일',
    status: 'completed' as const,
  },
  {
    id: '3',
    title: '팀워크가 훌륭해요',
    content: '어려운 상황에서도 팀원들과 잘 협력해서 문제를 해결하는 모습이 인상적이었습니다. 소통이 원활하고 서로 도와주는 분위기를 만들어주셔서 감사합니다.',
    author: '이민호',
    recipient: '팀',
    date: '2025-08-25',
    displayDate: '2025년 8월 25일',
    status: 'pending' as const,
  },
];

export const DashboardScreen: React.FC = () => {
  const colors = useColors();
  const { theme, toggleTheme } = useTheme();
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState<'reflections' | 'praises'>('reflections');
  const [isWeekView, setIsWeekView] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

// 반성문 클릭 핸들러
  const handleReflectionPress = (item: typeof MOCK_REFLECTIONS[0]) => {
    navigation.navigate('ReflectionDetail', { reflection: item });
  };

  // 칭찬 클릭 핸들러
  const handlePraisePress = (item: typeof MOCK_PRAISES[0]) => {
    navigation.navigate('PraiseDetail', { praise: item });
  };

  const filteredReflections = useMemo(() => {
    if (!selectedDate) return MOCK_REFLECTIONS;
    return MOCK_REFLECTIONS.filter(reflection => reflection.date === selectedDate);
  }, [selectedDate]);

  const filteredPraises = useMemo(() => {
    if (!selectedDate) return MOCK_PRAISES;
    return MOCK_PRAISES.filter(praise => praise.date === selectedDate);
  }, [selectedDate]);

// 4. 날짜에 데이터가 있는지 확인하는 함수
  const hasDataForDate = (dateString: string) => {
    const hasReflections = MOCK_REFLECTIONS.some(r => r.date === dateString);
    const hasPraises = MOCK_PRAISES.some(p => p.date === dateString);
    return hasReflections || hasPraises;
  };

// 5. 날짜 클릭 핸들러
  const handleDatePress = (dateString: string) => {
    setSelectedDate(selectedDate === dateString ? null : dateString);
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
    const completedDays = ['2025-08-27'];
    const reflectionCount = MOCK_REFLECTIONS.filter(r => r.status === 'completed').length;
    const praiseCount = MOCK_PRAISES.filter(p => p.status === 'completed').length;

    return (
      <Calendar
        variant="dashboard"
        selectedDate={selectedDate} // 추가
        onDatePress={handleDatePress} // 추가
        stats={{
          reflectionCount,
          praiseCount,
        }}
        completedDays={completedDays}
        hasDataForDate={hasDataForDate} // 추가
        onMonthChange={(month) => {
          console.log('Dashboard month changed to:', month);
        }}
        initialDate="2025-08-27"
        onWeekModeToggle={() => setIsWeekView(!isWeekView)}
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
        <Text style={[styles.itemAuthor, { color: colors.text.secondary }]}>{item.author}</Text>
        <View style={styles.itemFooter}>
          <Text style={[styles.itemDate, { color: colors.text.secondary }]}>{item.date}</Text>
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
        <View style={styles.itemFooter}>
          <Text style={[styles.itemDate, { color: colors.text.secondary }]}>{item.date}</Text>
          <View style={[
            styles.statusChip,
            { backgroundColor: item.status === 'completed' ? colors.primary.yellow : colors.background.cardSecondary }
          ]}>
            <Text style={[
              styles.statusText,
              { color: item.status === 'completed' ? colors.text.primary : colors.text.secondary }
            ]}>
              {item.status === 'completed' ? '전달됨' : '대기중'}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

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

    // 데이터가 없을 때
    if (currentItems.length === 0) {
      return (
        <View style={styles.emptyState}>
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
          ? filteredReflections.map(renderReflectionItem)
          : filteredPraises.map(renderPraiseItem)
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