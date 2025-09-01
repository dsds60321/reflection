import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useColors } from '../hooks/useColors';
import { typography } from '../styles/typography';
import { dimensions } from '../styles/dimensions';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

// 공지사항 데이터
const NOTICES = [
  {
    id: '1',
    title: '앱 업데이트 안내 (v1.0.0)',
    content: '새로운 기능이 추가되었습니다.\n\n• 칭찬하기 기능 추가\n• 반성문 템플릿 기능\n• 알림 설정 개선\n• 성능 최적화',
    date: '2025-08-27',
    isImportant: true,
    isNew: true,
  },
  {
    id: '2',
    title: '서비스 점검 완료 안내',
    content: '8월 25일 진행된 서비스 점검이 완료되었습니다.\n\n점검 내용:\n• 서버 안정성 개선\n• 데이터 백업 시스템 강화\n\n이용에 불편을 드려 죄송합니다.',
    date: '2025-08-25',
    isImportant: false,
    isNew: false,
  },
  {
    id: '3',
    title: '개인정보 처리방침 개정 안내',
    content: '개인정보 처리방침이 개정되었습니다.\n\n주요 변경사항:\n• 개인정보 수집 항목 명시\n• 제3자 제공 관련 내용 추가\n• 개인정보 보관기간 명확화\n\n자세한 내용은 앱 내 개인정보 처리방침을 확인해주세요.',
    date: '2025-08-20',
    isImportant: true,
    isNew: false,
  },
  {
    id: '4',
    title: '친구 초대 이벤트 종료',
    content: '친구 초대 이벤트가 8월 15일을 끝으로 종료되었습니다.\n\n참여해주신 모든 분들께 감사드립니다.\n새로운 이벤트는 추후 공지를 통해 안내드리겠습니다.',
    date: '2025-08-15',
    isImportant: false,
    isNew: false,
  },
  {
    id: '5',
    title: '서비스 오픈 안내',
    content: '반성문 앱이 정식으로 오픈되었습니다!\n\n주요 기능:\n• 반성문 작성 및 관리\n• 친구와 반성문 공유\n• 캘린더를 통한 일정 관리\n• 테마 설정\n\n많은 이용 부탁드립니다.',
    date: '2025-08-01',
    isImportant: true,
    isNew: false,
  },
];

export const NoticeScreen: React.FC = () => {
  const colors = useColors();
  const navigation = useNavigation();

  const renderNoticeItem = ({ item }: { item: typeof NOTICES[0] }) => (
    <TouchableOpacity
      style={[styles.noticeItem, { backgroundColor: colors.background.card }]}
      onPress={() => navigation.navigate('NoticeDetail', { notice: item })}
    >
      <View style={styles.noticeHeader}>
        <View style={styles.noticeTitleContainer}>
          {item.isImportant && (
            <View style={[styles.importantBadge, { backgroundColor: colors.primary.coral }]}>
              <Text style={[styles.importantText, { color: colors.text.white }]}>중요</Text>
            </View>
          )}
          {item.isNew && (
            <View style={[styles.newBadge, { backgroundColor: colors.primary.yellow }]}>
              <Text style={[styles.newText, { color: colors.text.primary }]}>NEW</Text>
            </View>
          )}
          <Text
            style={[styles.noticeTitle, { color: colors.text.primary }]}
            numberOfLines={1}
          >
            {item.title}
          </Text>
        </View>
        <Ionicons name="chevron-forward" size={16} color={colors.text.secondary} />
      </View>

      <Text
        style={[styles.noticeContent, { color: colors.text.secondary }]}
        numberOfLines={2}
      >
        {item.content}
      </Text>

      <Text style={[styles.noticeDate, { color: colors.text.secondary }]}>
        {item.date}
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background.primary }]}>
      {/* Header */}
      <View style={[styles.header, { borderBottomColor: colors.background.cardSecondary }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.text.primary} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text.primary }]}>공지사항</Text>
        <View style={styles.headerRight} />
      </View>

      {/* Notice List */}
      <FlatList
        data={NOTICES}
        keyExtractor={(item) => item.id}
        renderItem={renderNoticeItem}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
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
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: dimensions.spacing.lg,
    borderBottomWidth: 1,
  },
  backButton: {
    padding: dimensions.spacing.xs,
  },
  headerTitle: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.semibold,
    fontFamily: typography.fontFamily.regular,
  },
  headerRight: {
    width: 32,
  },
  listContainer: {
    padding: dimensions.spacing.lg,
  },
  noticeItem: {
    padding: dimensions.spacing.md,
    borderRadius: dimensions.borderRadius.lg,
  },
  noticeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: dimensions.spacing.sm,
  },
  noticeTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: dimensions.spacing.sm,
  },
  importantBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginRight: dimensions.spacing.xs,
  },
  importantText: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.bold,
    fontFamily: typography.fontFamily.regular,
  },
  newBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginRight: dimensions.spacing.xs,
  },
  newText: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.bold,
    fontFamily: typography.fontFamily.regular,
  },
  noticeTitle: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.medium,
    fontFamily: typography.fontFamily.regular,
    flex: 1,
  },
  noticeContent: {
    fontSize: typography.sizes.sm,
    lineHeight: typography.sizes.sm * 1.4,
    marginBottom: dimensions.spacing.sm,
    fontFamily: typography.fontFamily.regular,
  },
  noticeDate: {
    fontSize: typography.sizes.xs,
    fontFamily: typography.fontFamily.regular,
  },
  separator: {
    height: dimensions.spacing.sm,
  },
});