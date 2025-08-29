import React from 'react';
import {
  View,
  Text,
  Modal,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Image,
} from 'react-native';
import { useColors } from '../../hooks/useColors';
import { typography } from '../../styles/typography';
import { dimensions } from '../../styles/dimensions';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

interface PraiseDetailModalProps {
  visible: boolean;
  onClose: () => void;
  praise: {
    id: string;
    title: string;
    content: string;
    author: string;
    recipient: string;
    date: string;
    status: 'completed' | 'pending';
  };
}

export const PraiseDetailModal: React.FC<PraiseDetailModalProps> = ({
                                                                      visible,
                                                                      onClose,
                                                                      praise,
                                                                    }) => {
  const colors = useColors();

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={[styles.modalContainer, { backgroundColor: colors.background.primary }]}>
        {/* Header */}
        <View style={[styles.header, { borderBottomColor: colors.background.cardSecondary }]}>
          <View style={styles.headerLeft}>
            <View style={[styles.iconContainer, { backgroundColor: colors.primary.yellow }]}>
              <Image
                source={require("../../assets/images/angel.png")}
                style={styles.headerIcon}
              />
            </View>
            <Text style={[styles.headerTitle, { color: colors.text.primary }]}>칭찬</Text>
          </View>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Ionicons name="close" size={24} color={colors.text.primary} />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Title Section */}
          <View style={styles.section}>
            <Text style={[styles.sectionLabel, { color: colors.text.secondary }]}>제목</Text>
            <Text style={[styles.title, { color: colors.text.primary }]}>{praise.title}</Text>
          </View>

          {/* Author Section */}
          <View style={styles.section}>
            <Text style={[styles.sectionLabel, { color: colors.text.secondary }]}>글쓴이</Text>
            <View style={styles.authorContainer}>
              <View style={[styles.authorAvatar, { backgroundColor: colors.background.cardSecondary }]}>
                <Ionicons name="person" size={20} color={colors.text.white} />
              </View>
              <Text style={[styles.authorName, { color: colors.text.primary }]}>{praise.author}</Text>
            </View>
          </View>

          {/* Recipient Section */}
          <View style={styles.section}>
            <Text style={[styles.sectionLabel, { color: colors.text.secondary }]}>대상</Text>
            <Text style={[styles.recipientText, { color: colors.text.primary }]}>{praise.recipient}</Text>
          </View>

          {/* Content Section */}
          <View style={styles.section}>
            <Text style={[styles.sectionLabel, { color: colors.text.secondary }]}>내용</Text>
            <View style={[styles.contentContainer, { backgroundColor: colors.background.card }]}>
              <Text style={[styles.contentText, { color: colors.text.primary }]}>
                {praise.content}
              </Text>
            </View>
          </View>

          {/* Status Section */}
          <View style={styles.section}>
            <Text style={[styles.sectionLabel, { color: colors.text.secondary }]}>상태</Text>
            <View style={[
              styles.statusContainer,
              { backgroundColor: praise.status === 'completed' ? colors.primary.yellow : colors.background.cardSecondary }
            ]}>
              <MaterialCommunityIcons
                name={praise.status === 'completed' ? "check-circle" : "clock-outline"}
                size={16}
                color={praise.status === 'completed' ? colors.text.primary : colors.text.secondary}
              />
              <Text style={[
                styles.statusText,
                { color: praise.status === 'completed' ? colors.text.primary : colors.text.secondary }
              ]}>
                {praise.status === 'completed' ? '전달됨' : '대기중'}
              </Text>
            </View>
          </View>

          {/* Date Section */}
          <View style={[styles.section, styles.lastSection]}>
            <Text style={[styles.sectionLabel, { color: colors.text.secondary }]}>날짜</Text>
            <Text style={[styles.dateText, { color: colors.text.primary }]}>{praise.date}</Text>
          </View>
        </ScrollView>

        {/* Footer Actions */}
        <View style={[styles.footer, { borderTopColor: colors.background.cardSecondary }]}>
          <TouchableOpacity style={[styles.actionButton, styles.editButton, { borderColor: colors.primary.coral }]}>
            <MaterialCommunityIcons name="pencil" size={16} color={colors.primary.coral} />
            <Text style={[styles.actionButtonText, { color: colors.primary.coral }]}>수정</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.actionButton, styles.deleteButton, { borderColor: colors.text.secondary }]}>
            <MaterialCommunityIcons name="delete-outline" size={16} color={colors.text.secondary} />
            <Text style={[styles.actionButtonText, { color: colors.text.secondary }]}>삭제</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: dimensions.spacing.lg,
    borderBottomWidth: 1,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
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
  closeButton: {
    padding: dimensions.spacing.xs,
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
  editButton: {
    // 편집 버튼 스타일
  },
  deleteButton: {
    // 삭제 버튼 스타일
  },
  actionButtonText: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.medium,
    marginLeft: dimensions.spacing.xs,
    fontFamily: typography.fontFamily.regular,
  },
});