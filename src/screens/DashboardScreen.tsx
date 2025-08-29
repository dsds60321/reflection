import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Image,
} from 'react-native';
import { ReflectionDetailModal } from '../components/reflection/ReflectionDetailModal';
import { PraiseDetailModal } from '../components/praise/PraiseDetailModal';
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
        date: '2025년 8월 27일',
        reward: '점심 사기',
        status: 'pending' as const,
    },
    {
        id: '2',
        title: '회의 시간에 집중하지 못함',
        content: '이번 주 팀 회의에서 계속 딴생각을 했습니다. 동료들이 발표하는 동안 집중하지 못해서 중요한 내용을 놓쳤습니다. 앞으로는 회의 전에 충분한 휴식을 취하고, 메모를 적극적으로 하면서 참여하겠습니다.',
        author: '김영희',
        recipient: '팀원들',
        date: '2025년 8월 26일',
        reward: '커피 사기',
        status: 'completed' as const,
    },
    {
        id: '3',
        title: '프로젝트 지연에 대한 반성',
        content: '담당하고 있던 프로젝트의 마감일을 지키지 못했습니다. 일정 관리가 미흡했고, 중간에 발생한 문제들을 제때 공유하지 못했습니다. 앞으로는 주간 진행 상황을 정기적으로 보고하고, 문제가 생기면 즉시 상의하겠습니다.',
        author: '이민호',
        recipient: '프로젝트 팀',
        date: '2025년 8월 25일',
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
        date: '2025년 8월 27일',
        status: 'completed' as const,
    },
    {
        id: '2',
        title: '코드 리뷰가 정말 도움이 되었습니다',
        content: '코드 리뷰에서 주신 피드백이 매우 유용했습니다. 성능 개선 방법과 더 깔끔한 코드 작성법을 알게 되었습니다. 앞으로도 이런 리뷰를 통해 많이 배우고 싶습니다.',
        author: '박민준',
        recipient: '김영희',
        date: '2025년 8월 26일',
        status: 'completed' as const,
    },
    {
        id: '3',
        title: '팀워크가 훌륭해요',
        content: '어려운 상황에서도 팀원들과 잘 협력해서 문제를 해결하는 모습이 인상적이었습니다. 소통이 원활하고 서로 도와주는 분위기를 만들어주셔서 감사합니다.',
        author: '이민호',
        recipient: '팀',
        date: '2025년 8월 25일',
        status: 'pending' as const,
    },
];

const CALENDAR_DAYS = ['월', '화', '수', '목', '금', '토', '일'];
const CURRENT_MONTH = '2025년 8월';

export const DashboardScreen: React.FC = () => {
  const colors = useColors();
  const { theme, toggleTheme } = useTheme();
  const [activeTab, setActiveTab] = useState<'reflections' | 'praises'>('reflections');

    // 통합된 모달 상태만 유지
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedReflection, setSelectedReflection] = useState<typeof MOCK_REFLECTIONS[0] | null>(null);
    const [selectedPraise, setSelectedPraise] = useState<typeof MOCK_PRAISES[0] | null>(null);

    // 반성문 클릭 핸들러
    const handleReflectionPress = (item: typeof MOCK_REFLECTIONS[0]) => {
        setSelectedReflection(item);
        setSelectedPraise(null); // 다른 모달 데이터 초기화
        setIsModalVisible(true);
    };

    // 칭찬 클릭 핸들러
    const handlePraisePress = (item: typeof MOCK_PRAISES[0]) => {
        setSelectedPraise(item);
        setSelectedReflection(null); // 다른 모달 데이터 초기화
        setIsModalVisible(true);
    };

    // 통합 모달 닫기 핸들러
    const handleModalClose = () => {
        setIsModalVisible(false);
        setSelectedReflection(null);
        setSelectedPraise(null);
    };





    const renderProfile = () => (
    <View style={styles.profileSection}>
      <View style={styles.profileRow}>
        <View style={[styles.profileAvatar, { backgroundColor: colors.background.cardSecondary }]}>
          <Text style={styles.avatarText}><Ionicons name="person" size={30} color="#fff" style={{ margin: 10 }} /></Text>
        </View>
        <View style={[styles.addProfileButton, { backgroundColor: colors.background.cardSecondary }]}>
          <Text style={[styles.addButtonText, { color: colors.text.secondary }]}>›</Text>
        </View>
      </View>
      <Text style={[styles.profileName, { color: colors.text.primary }]}>me</Text>

      <View style={styles.profileInfo}>
        <View style={[styles.profileAvatar, { backgroundColor: colors.background.cardSecondary }]}>
          <Text style={styles.avatarText}><Ionicons name="person" size={30} color="#fff" style={{ margin: 10 }} /></Text>
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
    const today = 27;
    const completedDays = [27];
      const reflectionCount = MOCK_REFLECTIONS.filter(r => r.status === 'completed').length;
      const praiseCount = MOCK_PRAISES.filter(p => p.status === 'completed').length;

      return (
      <View style={styles.calendarSection}>
        <View style={styles.calendarHeader}>
          <TouchableOpacity>
            <Text style={[styles.navButton, { color: colors.text.primary }]}>‹</Text>
          </TouchableOpacity>
          <View style={styles.monthInfo}>
            <Text style={[styles.monthText, { color: colors.text.primary }]}>{CURRENT_MONTH}</Text>
            <View style={styles.statsRow}>
              <Text style={[styles.statItem, { color: colors.text.secondary }]}>
                <Image
                  source={require("../assets/images/devil.png")}
                  style={{width : 25,
                    height : 25,
                    marginRight : 8}}
                 />
                {reflectionCount}
              </Text>
              <Text style={[styles.statItem, { color: colors.text.secondary }]}>
                <Image
                  source={require("../assets/images/angel.png")}
                  style={{width : 25,
                    height : 25,
                    marginRight : 8}}
                />
                {praiseCount}
              </Text>
            </View>
          </View>
          <TouchableOpacity>
            <Text style={[styles.navButton, { color: colors.text.primary }]}>›</Text>
          </TouchableOpacity>
          <Text style={[styles.weekButton, { color: colors.text.secondary }]}>주</Text>
        </View>

        <View style={styles.calendarGrid}>
          <View style={styles.weekRow}>
            {CALENDAR_DAYS.map((day, index) => (
              <Text key={day} style={[
                styles.dayHeader,
                { color: index === 5 ? colors.primary.coral : index === 6 ? colors.text.secondary : colors.text.primary }
              ]}>
                {day}
              </Text>
            ))}
          </View>

          <View style={styles.datesRow}>
            {[25, 26, 27, 28, 29, 30, 31].map((date, index) => (
              <View key={date} style={styles.dateContainer}>
                <View style={[
                  styles.dateCircle,
                  date === today && { backgroundColor: colors.text.primary },
                  completedDays.includes(date) && styles.completedDate
                ]}>
                  <Text style={[
                    styles.dateText,
                    { color: date === today ? colors.text.white :
                        index === 5 ? colors.primary.coral :
                          index === 6 ? colors.text.secondary : colors.text.primary }
                  ]}>
                    {date}
                  </Text>
                  {completedDays.includes(date) && (
                    <View style={[styles.completedIndicator, { backgroundColor: colors.primary.coral }]}>
                      <Text style={styles.completedNumber}>1</Text>
                    </View>
                  )}
                </View>
              </View>
            ))}
          </View>
        </View>
      </View>
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
                <Text style={styles.itemIconText}>
                    <Image
                        source={require("../assets/images/devil.png")}
                        style={{width : 35,
                            height : 35,
                            marginRight : 8}}
                    />
                </Text>
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
                            { backgroundColor: item.status !== 'pending' ? colors.primary.coral : colors.background.cardSecondary }
                        ]}>
                            <Text style={[
                                styles.statusText,
                                { color: item.status !== 'pending' ? colors.text.white : colors.text.secondary }
                            ]}>
                                {item.status !== 'pending' ? '완료' : '대기중'}
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
                <Text style={styles.itemIconText}>
                    <Image
                        source={require("../assets/images/angel.png")}
                        style={{width : 35,
                            height : 35,
                            marginRight : 8}}
                    />
                </Text>
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


    const renderCurrentList = () => {
    if (activeTab === 'reflections') {
      return (
        <View style={styles.listContainer}>
          <View style={styles.listHeader}>
            <Text style={[styles.listTitle, { color: colors.text.primary }]}>반성문 목록</Text>
            <TouchableOpacity>
              <Text style={[styles.addButton, { color: colors.text.secondary }]}>+</Text>
            </TouchableOpacity>
          </View>
          {MOCK_REFLECTIONS.map(renderReflectionItem)}
        </View>
      );
    } else {
      return (
        <View style={styles.listContainer}>
          <View style={styles.listHeader}>
            <Text style={[styles.listTitle, { color: colors.text.primary }]}>칭찬 목록</Text>
            <TouchableOpacity>
              <Text style={[styles.addButton, { color: colors.text.secondary }]}>+</Text>
            </TouchableOpacity>
          </View>
          {MOCK_PRAISES.map(renderPraiseItem)}
        </View>
      );
    }
  };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background.primary }]}>
            <StatusBar
                barStyle={theme === 'dark' ? 'light-content' : 'dark-content'}
                backgroundColor={colors.background.primary}
            />

            <View style={styles.header}>
                <TouchableOpacity onPress={toggleTheme} style={styles.themeToggle}>
                    <Text style={[styles.themeToggleText, { color: colors.text.primary }]}>
                        {theme === 'light' ?
                            <Ionicons name="moon-outline" size={20} color="#000" style={{ margin: 10 }} />
                            : <Ionicons name="sunny-outline" size={20} color="#fff" style={{ margin: 10 }} />}
                    </Text>
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

            {/* 반성문 모달 */}
            {selectedReflection && (
                <ReflectionDetailModal
                    visible={isModalVisible}
                    onClose={handleModalClose}
                    reflection={selectedReflection}
                />
            )}

            {/* 칭찬 모달 */}
            {selectedPraise && (
                <PraiseDetailModal
                    visible={isModalVisible}
                    onClose={handleModalClose}
                    praise={selectedPraise}
                />
            )}
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
  themeToggleText: {
    fontSize: typography.sizes.lg,
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
  avatarText: {
    fontSize: typography.sizes.xl,
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

  // Calendar Section
  calendarSection: {
    marginBottom: dimensions.spacing.lg,
  },
  calendarHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: dimensions.spacing.md,
  },
  navButton: {
    fontSize: typography.sizes.xxl,
    fontWeight: typography.weights.light,
    paddingHorizontal: dimensions.spacing.md,
  },
  monthInfo: {
    flex: 1,
    alignItems: 'center',
  },
  monthText: {
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.semibold,
    marginBottom: 4,
  },
  statsRow: {
    flexDirection: 'row',
    gap: dimensions.spacing.md,
  },
  statItem: {
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.sizes.sm,
  },
  weekButton: {
    fontSize: typography.sizes.md,
    paddingHorizontal: dimensions.spacing.md,
  },
  calendarGrid: {
    gap: dimensions.spacing.sm,
  },
  weekRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: dimensions.spacing.sm,
  },
  dayHeader: {
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.medium,
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
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  completedDate: {
    // Additional styling for completed dates
  },
  dateText: {
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.medium,
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
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.bold,
  },

  // Tab Section - 작고 심플하게 변경
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
    paddingVertical: dimensions.spacing.sm, // lg에서 sm으로 변경
    borderRadius: dimensions.borderRadius.sm, // lg에서 sm으로 변경
    gap: dimensions.spacing.xs, // sm에서 xs로 변경
  },
  tabIcon: {
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.sizes.md, // lg에서 md로 변경
  },
  tabText: {
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.sizes.sm, // md에서 sm으로 변경
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
  itemIconText: {
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.sizes.lg,
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
});