import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useAlert } from '../context/AlertContext';
import { useColors } from '../hooks/useColors';
import { typography } from '../styles/typography';
import { dimensions } from '../styles/dimensions';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

interface ReflectionDetailScreenProps {
  route: {
    params: {
      reflection: {
        id: string;
        title: string;
        content: string;
        author: string;
        recipient?: string;
        date: string;
        reward?: string;
        status: 'completed' | 'pending';
      };
    };
  };
}

export const ReflectionDetailScreen: React.FC = () => {
  const colors = useColors();
  const navigation = useNavigation();
  const route = useRoute();
  const { reflection } = route.params as { reflection: any };
  const { showAlert } = useAlert();

  const handleEdit = () => {
    navigation.navigate('ReflectionForm', { reflection, mode: 'edit' });
  };

  const handleDelete = () => {
    showAlert({
      title: '반성문 삭제',
      message: '이 반성문을 삭제하시겠습니까?\n삭제된 내용은 복구할 수 없습니다.',
      icon: 'delete',
      iconColor: colors.primary.coral,
      buttons: [
        { text: '취소', style: 'cancel' },
        {
          text: '삭제',
          style: 'destructive',
          onPress: () => {
            console.log('Delete reflection:', reflection.id);
            navigation.goBack();
          },
        },
      ],
    });
  };


  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background.primary }]}>
      {/* Header */}
      <View style={[styles.header, { borderBottomColor: colors.background.cardSecondary }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.text.primary} />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <View style={[styles.iconContainer, { backgroundColor: colors.primary.yellow }]}>
            <Image
              source={require("../assets/images/devil.png")}
              style={styles.headerIcon}
            />
          </View>
          <Text style={[styles.headerTitle, { color: colors.text.primary }]}>반성문</Text>
        </View>
        <View style={styles.headerRight} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Title Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionLabel, { color: colors.text.secondary }]}>제목</Text>
          <Text style={[styles.title, { color: colors.text.primary }]}>{reflection.title}</Text>
        </View>

        {/* Author Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionLabel, { color: colors.text.secondary }]}>글쓴이</Text>
          <View style={styles.authorContainer}>
            <View style={[styles.authorAvatar, { backgroundColor: colors.background.cardSecondary }]}>
              <Ionicons name="person" size={20} color={colors.text.white} />
            </View>
            <Text style={[styles.authorName, { color: colors.text.primary }]}>{reflection.author}</Text>
          </View>
        </View>

        {/* Recipient Section */}
        {reflection.recipient && (
          <View style={styles.section}>
            <Text style={[styles.sectionLabel, { color: colors.text.secondary }]}>대상</Text>
            <Text style={[styles.recipientText, { color: colors.text.primary }]}>{reflection.recipient}</Text>
          </View>
        )}

        {/* Content Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionLabel, { color: colors.text.secondary }]}>내용</Text>
          <View style={[styles.contentContainer, { backgroundColor: colors.background.card }]}>
            <Text style={[styles.contentText, { color: colors.text.primary }]}>
              {reflection.content}
            </Text>
          </View>
        </View>

        {/* Reward Section */}
        {reflection.reward && (
          <View style={styles.section}>
            <Text style={[styles.sectionLabel, { color: colors.text.secondary }]}>보상</Text>
            <View style={[styles.rewardContainer, { backgroundColor: colors.background.card }]}>
              <MaterialCommunityIcons name="gift" size={20} color={colors.primary.coral} />
              <Text style={[styles.rewardText, { color: colors.text.primary }]}>{reflection.reward}</Text>
            </View>
          </View>
        )}

        {/* Status Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionLabel, { color: colors.text.secondary }]}>상태</Text>
          <View style={[
            styles.statusContainer,
            { backgroundColor: reflection.status === 'completed' ? colors.primary.coral : colors.background.cardSecondary }
          ]}>
            <MaterialCommunityIcons
              name={reflection.status === 'completed' ? "check-circle" : "clock-outline"}
              size={16}
              color={reflection.status === 'completed' ? colors.text.white : colors.text.secondary}
            />
            <Text style={[
              styles.statusText,
              { color: reflection.status === 'completed' ? colors.text.white : colors.text.secondary }
            ]}>
              {reflection.status === 'completed' ? '완료됨' : '대기중'}
            </Text>
          </View>
        </View>

        {/* Date Section */}
        <View style={[styles.section, styles.lastSection]}>
          <Text style={[styles.sectionLabel, { color: colors.text.secondary }]}>날짜</Text>
          <Text style={[styles.dateText, { color: colors.text.primary }]}>{reflection.date}</Text>
        </View>
      </ScrollView>

      {/* Footer Actions */}
      <View style={[styles.footer, { borderTopColor: colors.background.cardSecondary }]}>
        <TouchableOpacity
          style={[styles.actionButton, styles.editButton, { borderColor: colors.primary.coral }]}
          onPress={handleEdit}
        >
          <MaterialCommunityIcons name="pencil" size={16} color={colors.primary.coral} />
          <Text style={[styles.actionButtonText, { color: colors.primary.coral }]}>수정</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, styles.deleteButton, { borderColor: colors.text.secondary }]}
          onPress={handleDelete}
        >
          <MaterialCommunityIcons name="delete-outline" size={16} color={colors.text.secondary} />
          <Text style={[styles.actionButtonText, { color: colors.text.secondary }]}>삭제</Text>
        </TouchableOpacity>
      </View>
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
    marginRight: dimensions.spacing.sm,
  },
  headerCenter: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  headerRight: {
    width: 40, // backButton과 같은 너비로 중앙 정렬
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: dimensions.spacing.sm,
  },
  headerIcon: {
    width: 24,
    height: 24,
  },
  headerTitle: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.semibold,
    fontFamily: typography.fontFamily.regular,
  },
  content: {
    flex: 1,
    padding: dimensions.spacing.lg,
  },
  section: {
    marginBottom: dimensions.spacing.xl,
  },
  lastSection: {
    marginBottom: dimensions.spacing.lg,
  },
  sectionLabel: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.medium,
    marginBottom: dimensions.spacing.sm,
    fontFamily: typography.fontFamily.regular,
  },
  title: {
    fontSize: typography.sizes.xl,
    fontWeight: typography.weights.semibold,
    lineHeight: typography.sizes.xl * 1.4,
    fontFamily: typography.fontFamily.regular,
  },
  authorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  authorAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: dimensions.spacing.sm,
  },
  authorName: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.medium,
    fontFamily: typography.fontFamily.regular,
  },
  recipientText: {
    fontSize: typography.sizes.md,
    fontFamily: typography.fontFamily.regular,
  },
  contentContainer: {
    padding: dimensions.spacing.md,
    borderRadius: dimensions.borderRadius.lg,
    minHeight: 120,
  },
  contentText: {
    fontSize: typography.sizes.md,
    lineHeight: typography.sizes.md * 1.6,
    fontFamily: typography.fontFamily.regular,
  },
  rewardContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: dimensions.spacing.md,
    borderRadius: dimensions.borderRadius.lg,
  },
  rewardText: {
    fontSize: typography.sizes.md,
    marginLeft: dimensions.spacing.sm,
    fontFamily: typography.fontFamily.regular,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: dimensions.spacing.md,
    paddingVertical: dimensions.spacing.sm,
    borderRadius: dimensions.borderRadius.md,
    alignSelf: 'flex-start',
  },
  statusText: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.medium,
    marginLeft: dimensions.spacing.xs,
    fontFamily: typography.fontFamily.regular,
  },
  dateText: {
    fontSize: typography.sizes.md,
    fontFamily: typography.fontFamily.regular,
  },
  footer: {
    flexDirection: 'row',
    padding: dimensions.spacing.lg,
    gap: dimensions.spacing.md,
    borderTopWidth: 1,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: dimensions.spacing.md,
    borderRadius: dimensions.borderRadius.lg,
    borderWidth: 1,
  },
  editButton: {},
  deleteButton: {},
  actionButtonText: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.medium,
    marginLeft: dimensions.spacing.xs,
    fontFamily: typography.fontFamily.regular,
  },
});