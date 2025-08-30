import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  TextInput,
  Share,
  Clipboard,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useColors } from '../hooks/useColors';
import { useAlert } from '../context/AlertContext';
import { typography } from '../styles/typography';
import { dimensions } from '../styles/dimensions';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

export const InviteFriendScreen: React.FC = () => {
  const colors = useColors();
  const navigation = useNavigation();
  const route = useRoute();
  const { showAlert } = useAlert();
  const { contact } = route.params as { contact: any };

  const [message, setMessage] = useState(
    `안녕하세요! 반성문과 칭찬을 주고받을 수 있는 앱을 사용해보세요. 함께 더 나은 사람이 되어봐요!`
  );

  const inviteLink = 'https://reflection-app.com/invite/abc123';

  const handleInviteViaMethod = async (method: string) => {
    const fullMessage = `${message}\n\n다운로드 링크: ${inviteLink}`;

    try {
      switch (method) {
        case 'sms':
          // SMS 앱 열기 (실제로는 react-native-sms나 Linking 사용)
          console.log('SMS 초대:', fullMessage);
          break;
        case 'email':
          // 이메일 앱 열기
          console.log('이메일 초대:', fullMessage);
          break;
        case 'share':
          await Share.share({
            message: fullMessage,
            title: '반성문 앱 초대',
          });
          break;
        case 'copy':
          await Clipboard.setString(fullMessage);
          showAlert({
            message: '초대 메시지가 클립보드에 복사되었습니다.',
            icon: 'check',
            iconColor: colors.primary.coral,
          });
          break;
      }
    } catch (error) {
      showAlert({
        title: '오류',
        message: '초대를 보내는 중 오류가 발생했습니다.',
        icon: 'alert-circle',
        iconColor: colors.primary.coral,
      });
    }
  };

  const inviteMethods = [
    { key: 'sms', label: '문자 메시지', icon: 'message-text', color: '#34C759' },
    { key: 'email', label: '이메일', icon: 'email', color: '#007AFF' },
    { key: 'share', label: '공유하기', icon: 'share-variant', color: colors.primary.coral },
    { key: 'copy', label: '링크 복사', icon: 'content-copy', color: colors.text.secondary },
  ];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background.primary }]}>
      {/* 헤더 */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.text.primary} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text.primary }]}>친구 초대</Text>
        <View style={styles.headerRight} />
      </View>

      <ScrollView style={styles.content}>
        {/* 초대 대상 정보 */}
        <View style={[styles.contactCard, { backgroundColor: colors.background.card }]}>
          <View style={[styles.contactAvatar, { backgroundColor: colors.background.cardSecondary }]}>
            <Ionicons name="person" size={24} color={colors.text.white} />
          </View>
          <View style={styles.contactInfo}>
            <Text style={[styles.contactName, { color: colors.text.primary }]}>
              {contact.name}
            </Text>
            <Text style={[styles.contactDetail, { color: colors.text.secondary }]}>
              {contact.email || contact.phone}
            </Text>
          </View>
        </View>

        {/* 메시지 편집 */}
        <View style={styles.messageSection}>
          <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>
            초대 메시지
          </Text>
          <TextInput
            style={[
              styles.messageInput,
              {
                backgroundColor: colors.background.card,
                color: colors.text.primary,
                borderColor: colors.background.cardSecondary,
              }
            ]}
            multiline
            numberOfLines={4}
            value={message}
            onChangeText={setMessage}
            textAlignVertical="top"
          />
        </View>

        {/* 초대 링크 */}
        <View style={styles.linkSection}>
          <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>
            초대 링크
          </Text>
          <View style={[styles.linkContainer, { backgroundColor: colors.background.card }]}>
            <Text style={[styles.linkText, { color: colors.text.secondary }]} numberOfLines={1}>
              {inviteLink}
            </Text>
            <TouchableOpacity
              onPress={() => handleInviteViaMethod('copy')}
              style={styles.copyButton}
            >
              <MaterialCommunityIcons name="content-copy" size={20} color={colors.primary.coral} />
            </TouchableOpacity>
          </View>
        </View>

        {/* 초대 방법들 */}
        <View style={styles.methodsSection}>
          <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>
            초대 방법 선택
          </Text>
          {inviteMethods.map((method) => (
            <TouchableOpacity
              key={method.key}
              style={[styles.methodButton, { backgroundColor: colors.background.card }]}
              onPress={() => handleInviteViaMethod(method.key)}
            >
              <View style={[styles.methodIcon, { backgroundColor: method.color }]}>
                <MaterialCommunityIcons name={method.icon} size={20} color="#fff" />
              </View>
              <Text style={[styles.methodLabel, { color: colors.text.primary }]}>
                {method.label}
              </Text>
              <MaterialCommunityIcons
                name="chevron-right"
                size={20}
                color={colors.text.secondary}
              />
            </TouchableOpacity>
          ))}
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
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: dimensions.spacing.lg,
    paddingVertical: dimensions.spacing.md,
  },
  backButton: {
    padding: dimensions.spacing.xs,
  },
  headerTitle: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.bold,
    fontFamily: typography.fontFamily.regular,
  },
  headerRight: {
    width: 40,
  },
  content: {
    flex: 1,
    paddingHorizontal: dimensions.spacing.lg,
  },
  contactCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: dimensions.spacing.lg,
    borderRadius: dimensions.borderRadius.lg,
    marginBottom: dimensions.spacing.xl,
  },
  contactAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: dimensions.spacing.md,
  },
  contactInfo: {
    flex: 1,
  },
  contactName: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.semibold,
    fontFamily: typography.fontFamily.regular,
    marginBottom: dimensions.spacing.xs,
  },
  contactDetail: {
    fontSize: typography.sizes.sm,
    fontFamily: typography.fontFamily.regular,
  },
  messageSection: {
    marginBottom: dimensions.spacing.xl,
  },
  sectionTitle: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.semibold,
    fontFamily: typography.fontFamily.regular,
    marginBottom: dimensions.spacing.md,
  },
  messageInput: {
    borderRadius: dimensions.borderRadius.lg,
    padding: dimensions.spacing.md,
    fontSize: typography.sizes.md,
    fontFamily: typography.fontFamily.regular,
    borderWidth: 1,
    minHeight: 100,
  },
  linkSection: {
    marginBottom: dimensions.spacing.xl,
  },
  linkContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: dimensions.spacing.md,
    borderRadius: dimensions.borderRadius.lg,
  },
  linkText: {
    flex: 1,
    fontSize: typography.sizes.sm,
    fontFamily: typography.fontFamily.regular,
    marginRight: dimensions.spacing.md,
  },
  copyButton: {
    padding: dimensions.spacing.sm,
  },
  methodsSection: {
    marginBottom: dimensions.spacing.xl,
  },
  methodButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: dimensions.spacing.md,
    borderRadius: dimensions.borderRadius.lg,
    marginBottom: dimensions.spacing.sm,
  },
  methodIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: dimensions.spacing.md,
  },
  methodLabel: {
    flex: 1,
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.medium,
    fontFamily: typography.fontFamily.regular,
  },
});