import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Switch,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useColors } from '../hooks/useColors';
import { useTheme } from '../context/ThemeContext';
import { useAlert } from '../context/AlertContext';
import { typography } from '../styles/typography';
import { dimensions } from '../styles/dimensions';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

// 사용자 정보 (임시 데이터)
const USER_INFO = {
  name: '홍길동',
  email: 'hong@example.com',
  profileImage: null, // null일 때 기본 아바타 표시
  joinDate: '2024.01.15',
};

// 앱 버전 정보
const APP_VERSION = '1.0.0';

export const MyScreen: React.FC = () => {
  const colors = useColors();
  const { theme, toggleTheme } = useTheme();
  const navigation = useNavigation();
  const { showAlert } = useAlert();

  // 알림 설정 상태
  const [pushNotification, setPushNotification] = useState(true);
  const [praiseNotification, setPraiseNotification] = useState(true);
  const [reflectionNotification, setReflectionNotification] = useState(false);
  const [friendNotification, setFriendNotification] = useState(true);

  // 계정 수정 핸들러
  const handleEditProfile = () => {
    navigation.navigate('EditProfile');
  };

  // 공지사항 핸들러
  const handleNotice = () => {
    navigation.navigate('Notice');
  };

  // 로그아웃 핸들러
  const handleLogout = () => {
    showAlert({
      title: '로그아웃',
      message: '정말로 로그아웃 하시겠습니까?',
      icon: 'log-out-outline',
      iconColor: colors.primary.coral,
      buttons: [
        { text: '취소', style: 'cancel' },
        {
          text: '로그아웃',
          style: 'destructive',
          onPress: () => {
            console.log('User logged out');
            // TODO: 실제 로그아웃 로직 구현
          },
        },
      ],
    });
  };

  // 회원탈퇴 핸들러
  const handleDeleteAccount = () => {
    showAlert({
      title: '회원탈퇴',
      message: '정말로 회원탈퇴를 하시겠습니까?\n탈퇴 후에는 모든 데이터가 삭제되며 복구할 수 없습니다.',
      icon: 'warning',
      iconColor: colors.primary.coral,
      buttons: [
        { text: '취소', style: 'cancel' },
        {
          text: '탈퇴하기',
          style: 'destructive',
          onPress: () => {
            console.log('Account deletion requested');
            // TODO: 실제 회원탈퇴 로직 구현
          },
        },
      ],
    });
  };

  // 프로필 섹션 렌더링
  const renderProfileSection = () => (
    <View style={[styles.section, { backgroundColor: colors.background.card }]}>
      <View style={styles.profileContainer}>
        <View style={[styles.profileImageContainer, { backgroundColor: colors.background.cardSecondary }]}>
          {USER_INFO.profileImage ? (
            <Image source={{ uri: USER_INFO.profileImage }} style={styles.profileImage} />
          ) : (
            <Ionicons name="person" size={32} color={colors.text.secondary} />
          )}
        </View>
        <View style={styles.profileInfo}>
          <Text style={[styles.profileName, { color: colors.text.primary }]}>
            {USER_INFO.name}
          </Text>
          <Text style={[styles.profileEmail, { color: colors.text.secondary }]}>
            {USER_INFO.email}
          </Text>
          <Text style={[styles.profileJoinDate, { color: colors.text.secondary }]}>
            가입일: {USER_INFO.joinDate}
          </Text>
        </View>
        <TouchableOpacity
          onPress={handleEditProfile}
          style={[styles.editButton, { borderColor: colors.primary.coral }]}
        >
          <MaterialCommunityIcons name="pencil" size={16} color={colors.primary.coral} />
          <Text style={[styles.editButtonText, { color: colors.primary.coral }]}>수정</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  // 알림 설정 섹션 렌더링
  const renderNotificationSection = () => (
    <View style={styles.sectionContainer}>
      <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>알림 설정</Text>
      <View style={[styles.section, { backgroundColor: colors.background.card }]}>
        {/* 전체 푸시 알림 */}
        <View style={styles.settingItem}>
          <View style={styles.settingLeft}>
            <View style={[styles.settingIcon, { backgroundColor: colors.primary.coral }]}>
              <Ionicons name="notifications" size={16} color={colors.text.white} />
            </View>
            <Text style={[styles.settingTitle, { color: colors.text.primary }]}>
              푸시 알림
            </Text>
          </View>
          <Switch
            value={pushNotification}
            onValueChange={setPushNotification}
            trackColor={{ false: colors.background.cardSecondary, true: colors.primary.coral }}
            thumbColor={colors.text.white}
          />
        </View>

        <View style={[styles.separator, { backgroundColor: colors.background.cardSecondary }]} />

        {/* 칭찬 알림 */}
        <View style={styles.settingItem}>
          <View style={styles.settingLeft}>
            <View style={[styles.settingIcon, { backgroundColor: colors.primary.yellow }]}>
              <Ionicons name="gift" size={16} color={colors.text.primary} />
            </View>
            <Text style={[styles.settingTitle, { color: colors.text.primary }]}>
              칭찬 알림
            </Text>
          </View>
          <Switch
            value={praiseNotification && pushNotification}
            onValueChange={setPraiseNotification}
            disabled={!pushNotification}
            trackColor={{ false: colors.background.cardSecondary, true: colors.primary.yellow }}
            thumbColor={colors.text.white}
          />
        </View>

        <View style={[styles.separator, { backgroundColor: colors.background.cardSecondary }]} />

        {/* 반성문 알림 */}
        <View style={styles.settingItem}>
          <View style={styles.settingLeft}>
            <View style={[styles.settingIcon, { backgroundColor: colors.primary.purple }]}>
              <Ionicons name="document-text" size={16} color={colors.text.white} />
            </View>
            <Text style={[styles.settingTitle, { color: colors.text.primary }]}>
              반성문 알림
            </Text>
          </View>
          <Switch
            value={reflectionNotification && pushNotification}
            onValueChange={setReflectionNotification}
            disabled={!pushNotification}
            trackColor={{ false: colors.background.cardSecondary, true: colors.primary.purple }}
            thumbColor={colors.text.white}
          />
        </View>

        <View style={[styles.separator, { backgroundColor: colors.background.cardSecondary }]} />

        {/* 친구 알림 */}
        <View style={styles.settingItem}>
          <View style={styles.settingLeft}>
            <View style={[styles.settingIcon, { backgroundColor: colors.primary.orange }]}>
              <Ionicons name="people" size={16} color={colors.text.white} />
            </View>
            <Text style={[styles.settingTitle, { color: colors.text.primary }]}>
              친구 알림
            </Text>
          </View>
          <Switch
            value={friendNotification && pushNotification}
            onValueChange={setFriendNotification}
            disabled={!pushNotification}
            trackColor={{ false: colors.background.cardSecondary, true: colors.primary.orange }}
            thumbColor={colors.text.white}
          />
        </View>
      </View>
    </View>
  );

  // 앱 설정 섹션 렌더링
  const renderAppSection = () => (
    <View style={styles.sectionContainer}>
      <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>앱 설정</Text>
      <View style={[styles.section, { backgroundColor: colors.background.card }]}>
        {/* 다크모드 */}
        <View style={styles.settingItem}>
          <View style={styles.settingLeft}>
            <View style={[styles.settingIcon, { backgroundColor: colors.text.primary }]}>
              <Ionicons
                name={theme === 'light' ? 'moon' : 'sunny'}
                size={16}
                color={colors.background.card}
              />
            </View>
            <Text style={[styles.settingTitle, { color: colors.text.primary }]}>
              다크모드
            </Text>
          </View>
          <Switch
            value={theme === 'dark'}
            onValueChange={toggleTheme}
            trackColor={{ false: colors.background.cardSecondary, true: colors.text.primary }}
            thumbColor={colors.text.white}
          />
        </View>

        <View style={[styles.separator, { backgroundColor: colors.background.cardSecondary }]} />

        {/* 공지사항 */}
        <TouchableOpacity style={styles.settingItem} onPress={handleNotice}>
          <View style={styles.settingLeft}>
            <View style={[styles.settingIcon, { backgroundColor: colors.primary.peach }]}>
              <Ionicons name="megaphone" size={16} color={colors.text.primary} />
            </View>
            <Text style={[styles.settingTitle, { color: colors.text.primary }]}>
              공지사항
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={colors.text.secondary} />
        </TouchableOpacity>

        <View style={[styles.separator, { backgroundColor: colors.background.cardSecondary }]} />

        {/* 버전 정보 */}
        <View style={styles.settingItem}>
          <View style={styles.settingLeft}>
            <View style={[styles.settingIcon, { backgroundColor: colors.background.cardSecondary }]}>
              <Ionicons name="information-circle" size={16} color={colors.text.secondary} />
            </View>
            <Text style={[styles.settingTitle, { color: colors.text.primary }]}>
              버전 정보
            </Text>
          </View>
          <Text style={[styles.versionText, { color: colors.text.secondary }]}>
            v{APP_VERSION}
          </Text>
        </View>
      </View>
    </View>
  );

  // 계정 관리 섹션 렌더링
  const renderAccountSection = () => (
    <View style={styles.sectionContainer}>
      <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>계정 관리</Text>
      <View style={[styles.section, { backgroundColor: colors.background.card }]}>
        {/* 로그아웃 */}
        <TouchableOpacity style={styles.settingItem} onPress={handleLogout}>
          <View style={styles.settingLeft}>
            <View style={[styles.settingIcon, { backgroundColor: colors.text.secondary }]}>
              <Ionicons name="log-out-outline" size={16} color={colors.text.white} />
            </View>
            <Text style={[styles.settingTitle, { color: colors.text.primary }]}>
              로그아웃
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={colors.text.secondary} />
        </TouchableOpacity>

        <View style={[styles.separator, { backgroundColor: colors.background.cardSecondary }]} />

        {/* 회원탈퇴 */}
        <TouchableOpacity style={styles.settingItem} onPress={handleDeleteAccount}>
          <View style={styles.settingLeft}>
            <View style={[styles.settingIcon, { backgroundColor: colors.primary.coral }]}>
              <Ionicons name="person-remove" size={16} color={colors.text.white} />
            </View>
            <Text style={[styles.settingTitle, { color: colors.primary.coral }]}>
              회원탈퇴
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={colors.text.secondary} />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background.primary }]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: colors.text.primary }]}>설정</Text>
      </View>

      <ScrollView
        style={styles.scrollContainer}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {renderProfileSection()}
        {renderNotificationSection()}
        {renderAppSection()}
        {renderAccountSection()}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: dimensions.spacing.lg,
    paddingVertical: dimensions.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: 'transparent',
  },
  headerTitle: {
    fontSize: typography.sizes.xl,
    fontWeight: typography.weights.bold,
    fontFamily: typography.fontFamily.regular,
    textAlign: 'center',
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: dimensions.spacing.xxl,
  },
  section: {
    borderRadius: dimensions.borderRadius.lg,
    marginHorizontal: dimensions.spacing.lg,
    overflow: 'hidden',
  },
  sectionContainer: {
    marginBottom: dimensions.spacing.lg,
  },
  sectionTitle: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.semibold,
    marginHorizontal: dimensions.spacing.lg,
    marginBottom: dimensions.spacing.sm,
    fontFamily: typography.fontFamily.regular,
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: dimensions.spacing.lg,
  },
  profileImageContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: dimensions.spacing.md,
  },
  profileImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.semibold,
    marginBottom: 2,
    fontFamily: typography.fontFamily.regular,
  },
  profileEmail: {
    fontSize: typography.sizes.sm,
    marginBottom: 2,
    fontFamily: typography.fontFamily.regular,
  },
  profileJoinDate: {
    fontSize: typography.sizes.xs,
    fontFamily: typography.fontFamily.regular,
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: dimensions.spacing.sm,
    paddingVertical: dimensions.spacing.xs,
    borderRadius: dimensions.borderRadius.md,
    borderWidth: 1,
    gap: 4,
  },
  editButtonText: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.medium,
    fontFamily: typography.fontFamily.regular,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: dimensions.spacing.lg,
    paddingVertical: dimensions.spacing.md,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingIcon: {
    width: 28,
    height: 28,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: dimensions.spacing.sm,
  },
  settingTitle: {
    fontSize: typography.sizes.md,
    fontFamily: typography.fontFamily.regular,
    flex: 1,
  },
  separator: {
    height: 1,
    marginLeft: dimensions.spacing.lg + 28 + dimensions.spacing.sm,
  },
  versionText: {
    fontSize: typography.sizes.sm,
    fontFamily: typography.fontFamily.regular,
  },
});