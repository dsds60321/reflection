import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  StatusBar,
  RefreshControl,
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
import { Friend, Contact, InviteMethod } from '../types/friends';

// 목업 데이터
const MOCK_FRIENDS: Friend[] = [
  {
    id: '1',
    name: '김영희',
    email: 'younghee@example.com',
    isRegistered: true,
    status: 'accepted',
    addedAt: '2025-08-20',
  },
  {
    id: '2',
    name: '박민준',
    phone: '010-1234-5678',
    isRegistered: true,
    status: 'accepted',
    addedAt: '2025-08-18',
  },
  {
    id: '3',
    name: '이서연',
    email: 'seoyeon@example.com',
    isRegistered: false,
    status: 'pending',
    addedAt: '2025-08-15',
  },
];

const MOCK_CONTACTS: Contact[] = [
  {
    id: '1',
    name: '홍길동',
    phone: '010-9876-5432',
    isRegistered: false,
    isInvited: false,
  },
  {
    id: '2',
    name: '최지우',
    email: 'jiwoo@example.com',
    phone: '010-5555-1234',
    isRegistered: true,
    isInvited: false,
  },
  {
    id: '3',
    name: '정한솔',
    phone: '010-7777-8888',
    isRegistered: false,
    isInvited: true,
  },
];

export const FriendsScreen: React.FC = () => {
  const colors = useColors();
  const { theme } = useTheme();
  const navigation = useNavigation();
  const { showAlert } = useAlert();

  const [activeTab, setActiveTab] = useState<'friends' | 'invite'>('friends');
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [friends] = useState<Friend[]>(MOCK_FRIENDS);
  const [contacts] = useState<Contact[]>(MOCK_CONTACTS);

  // 검색 필터링
  const filteredFriends = useMemo(() => {
    if (!searchQuery) return friends;
    return friends.filter(friend =>
      friend.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      friend.email?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [friends, searchQuery]);

  const filteredContacts = useMemo(() => {
    if (!searchQuery) return contacts;
    return contacts.filter(contact =>
      contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.phone?.includes(searchQuery)
    );
  }, [contacts, searchQuery]);

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  };

  const handleInviteFriend = (contact: Contact) => {
    navigation.navigate('InviteFriend', { contact });
  };

  const handleAddFriend = (contact: Contact) => {
    showAlert({
      title: '친구 추가',
      message: `${contact.name}님을 친구로 추가하시겠습니까?`,
      icon: 'account-plus',
      iconColor: colors.primary.coral,
      buttons: [
        { text: '취소', style: 'cancel' },
        {
          text: '추가',
          onPress: () => {
            console.log('Add friend:', contact);
          },
        },
      ],
    });
  };

  // 헤더 렌더링
  const renderHeader = () => (
    <View style={styles.header}>
      <Text style={[styles.headerTitle, { color: colors.text.primary }]}>친구</Text>
      <TouchableOpacity
        onPress={() => navigation.navigate('FriendRequests')}
        style={styles.requestButton}
      >
        <Ionicons name="person-add" size={20} color={colors.text.primary} />
        <View style={[styles.badge, { backgroundColor: colors.primary.coral }]}>
          <Text style={[styles.badgeText, { color: colors.text.white }]}>2</Text>
        </View>
      </TouchableOpacity>
    </View>
  );

  // 검색바 렌더링
  const renderSearchBar = () => (
    <View style={[styles.searchContainer, { backgroundColor: colors.background.card }]}>
      <MaterialCommunityIcons name="magnify" size={20} color={colors.text.secondary} />
      <TextInput
        style={[styles.searchInput, { color: colors.text.primary }]}
        placeholder="친구 이름이나 연락처 검색"
        placeholderTextColor={colors.text.secondary}
        value={searchQuery}
        onChangeText={setSearchQuery}
      />
      {searchQuery.length > 0 && (
        <TouchableOpacity onPress={() => setSearchQuery('')}>
          <MaterialCommunityIcons name="close-circle" size={20} color={colors.text.secondary} />
        </TouchableOpacity>
      )}
    </View>
  );

  // 탭 네비게이션 렌더링
  const renderTabNavigation = () => (
    <View style={[styles.tabContainer, { backgroundColor: colors.background.cardSecondary }]}>
      <TouchableOpacity
        style={[
          styles.tabButton,
          activeTab === 'friends' && { backgroundColor: colors.background.card }
        ]}
        onPress={() => setActiveTab('friends')}
      >
        <Text style={[
          styles.tabText,
          { color: activeTab === 'friends' ? colors.text.primary : colors.text.secondary }
        ]}>
          친구 ({friends.filter(f => f.status === 'accepted').length})
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.tabButton,
          activeTab === 'invite' && { backgroundColor: colors.background.card }
        ]}
        onPress={() => setActiveTab('invite')}
      >
        <Text style={[
          styles.tabText,
          { color: activeTab === 'invite' ? colors.text.primary : colors.text.secondary }
        ]}>
          초대하기
        </Text>
      </TouchableOpacity>
    </View>
  );

  // 친구 아이템 렌더링
  const renderFriendItem = (friend: Friend) => (
    <TouchableOpacity
      key={friend.id}
      style={[styles.listItem, { backgroundColor: colors.background.card }]}
      onPress={() => navigation.navigate('FriendProfile', { friend })}
    >
      <View style={[styles.avatar, { backgroundColor: colors.background.cardSecondary }]}>
        {friend.avatar ? (
          <Image source={{ uri: friend.avatar }} style={styles.avatarImage} />
        ) : (
          <Ionicons name="person" size={20} color={colors.text.white} />
        )}
      </View>

      <View style={styles.itemContent}>
        <Text style={[styles.itemName, { color: colors.text.primary }]}>{friend.name}</Text>
        <Text style={[styles.itemSubtext, { color: colors.text.secondary }]}>
          {friend.email || friend.phone}
        </Text>
      </View>

      <View style={styles.itemActions}>
        {friend.status === 'pending' ? (
          <View style={[styles.statusChip, { backgroundColor: colors.background.cardSecondary }]}>
            <Text style={[styles.statusText, { color: colors.text.secondary }]}>대기중</Text>
          </View>
        ) : (
          <TouchableOpacity style={styles.moreButton}>
            <MaterialCommunityIcons name="dots-vertical" size={20} color={colors.text.secondary} />
          </TouchableOpacity>
        )}
      </View>
    </TouchableOpacity>
  );

  // 연락처 아이템 렌더링
  const renderContactItem = (contact: Contact) => (
    <TouchableOpacity
      key={contact.id}
      style={[styles.listItem, { backgroundColor: colors.background.card }]}
    >
      <View style={[styles.avatar, { backgroundColor: colors.background.cardSecondary }]}>
        <Ionicons name="person" size={20} color={colors.text.white} />
      </View>

      <View style={styles.itemContent}>
        <Text style={[styles.itemName, { color: colors.text.primary }]}>{contact.name}</Text>
        <Text style={[styles.itemSubtext, { color: colors.text.secondary }]}>
          {contact.email || contact.phone}
        </Text>
        {contact.isRegistered && (
          <Text style={[styles.registeredText, { color: colors.primary.coral }]}>
            앱 사용 중
          </Text>
        )}
      </View>

      <View style={styles.itemActions}>
        {contact.isInvited ? (
          <View style={[styles.statusChip, { backgroundColor: colors.background.cardSecondary }]}>
            <Text style={[styles.statusText, { color: colors.text.secondary }]}>초대됨</Text>
          </View>
        ) : contact.isRegistered ? (
          <TouchableOpacity
            style={[styles.addButton, { borderColor: colors.primary.coral }]}
            onPress={() => handleAddFriend(contact)}
          >
            <Text style={[styles.addButtonText, { color: colors.primary.coral }]}>추가</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={[styles.inviteButton, { backgroundColor: colors.primary.coral }]}
            onPress={() => handleInviteFriend(contact)}
          >
            <Text style={[styles.inviteButtonText, { color: colors.text.white }]}>초대</Text>
          </TouchableOpacity>
        )}
      </View>
    </TouchableOpacity>
  );

  // 빠른 초대 버튼들 렌더링
  const renderQuickInvite = () => {
    const inviteMethods: InviteMethod[] = [
      { type: 'sms', label: '문자', icon: 'message-text', color: '#34C759' },
      { type: 'email', label: '이메일', icon: 'email', color: '#007AFF' },
      { type: 'kakao', label: '카카오톡', icon: 'chat', color: '#FEE500' },
      { type: 'facebook', label: '페이스북', icon: 'facebook', color: '#1877F2' },
    ];

    return (
      <View style={styles.quickInviteSection}>
        <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>빠른 초대</Text>
        <View style={styles.quickInviteGrid}>
          {inviteMethods.map((method) => (
            <TouchableOpacity
              key={method.type}
              style={[styles.quickInviteButton, { backgroundColor: colors.background.card }]}
              onPress={() => handleQuickInvite(method.type)}
            >
              <View style={[styles.quickInviteIcon, { backgroundColor: method.color }]}>
                <MaterialCommunityIcons name={method.icon} size={24} color="#fff" />
              </View>
              <Text style={[styles.quickInviteLabel, { color: colors.text.primary }]}>
                {method.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    );
  };

  const handleQuickInvite = (type: string) => {
    navigation.navigate('QuickInvite', { type });
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background.primary }]}>
      <StatusBar
        barStyle={theme === 'dark' ? 'light-content' : 'dark-content'}
        backgroundColor={colors.background.primary}
      />

      {renderHeader()}
      {renderSearchBar()}
      {renderTabNavigation()}

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={colors.primary.coral}
          />
        }
      >
        {activeTab === 'invite' && renderQuickInvite()}

        <View style={styles.listSection}>
          {activeTab === 'friends' ? (
            <>
              {filteredFriends.length > 0 ? (
                filteredFriends.map(renderFriendItem)
              ) : (
                <View style={styles.emptyState}>
                  <MaterialCommunityIcons name="account-group" size={64} color={colors.text.secondary} />
                  <Text style={[styles.emptyText, { color: colors.text.secondary }]}>
                    {searchQuery ? '검색 결과가 없습니다' : '아직 친구가 없습니다'}
                  </Text>
                  <Text style={[styles.emptySubtext, { color: colors.text.secondary }]}>
                    친구를 초대해보세요!
                  </Text>
                </View>
              )}
            </>
          ) : (
            <>
              {filteredContacts.length > 0 ? (
                filteredContacts.map(renderContactItem)
              ) : (
                <View style={styles.emptyState}>
                  <MaterialCommunityIcons name="contacts" size={64} color={colors.text.secondary} />
                  <Text style={[styles.emptyText, { color: colors.text.secondary }]}>
                    연락처가 없습니다
                  </Text>
                  <TouchableOpacity
                    style={[styles.syncButton, { backgroundColor: colors.primary.coral }]}
                    onPress={() => {/* 연락처 동기화 */}}
                  >
                    <Text style={[styles.syncButtonText, { color: colors.text.white }]}>
                      연락처 불러오기
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
            </>
          )}
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
  requestButton: {
    position: 'relative',
    padding: dimensions.spacing.sm,
  },
  badge: {
    position: 'absolute',
    top: 2,
    right: 2,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.bold,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: dimensions.spacing.lg,
    marginBottom: dimensions.spacing.md,
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
  tabContainer: {
    flexDirection: 'row',
    marginHorizontal: dimensions.spacing.lg,
    borderRadius: dimensions.borderRadius.sm,
    padding: 4,
    marginBottom: dimensions.spacing.lg,
  },
  tabButton: {
    flex: 1,
    paddingVertical: dimensions.spacing.sm,
    paddingHorizontal: dimensions.spacing.md,
    borderRadius: dimensions.borderRadius.sm,
    alignItems: 'center',
  },
  tabText: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.medium,
    fontFamily: typography.fontFamily.regular,
  },
  scrollView: {
    flex: 1,
  },
  quickInviteSection: {
    paddingHorizontal: dimensions.spacing.lg,
    marginBottom: dimensions.spacing.xl,
  },
  sectionTitle: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.semibold,
    fontFamily: typography.fontFamily.regular,
    marginBottom: dimensions.spacing.md,
  },
  quickInviteGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: dimensions.spacing.md,
  },
  quickInviteButton: {
    width: '22%',
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: dimensions.borderRadius.lg,
    padding: dimensions.spacing.sm,
  },
  quickInviteIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: dimensions.spacing.xs,
  },
  quickInviteLabel: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.medium,
    fontFamily: typography.fontFamily.regular,
    textAlign: 'center',
  },
  listSection: {
    paddingHorizontal: dimensions.spacing.lg,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: dimensions.spacing.md,
    borderRadius: dimensions.borderRadius.lg,
    marginBottom: dimensions.spacing.sm,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: dimensions.spacing.md,
  },
  avatarImage: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  itemContent: {
    flex: 1,
  },
  itemName: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.semibold,
    fontFamily: typography.fontFamily.regular,
    marginBottom: 2,
  },
  itemSubtext: {
    fontSize: typography.sizes.sm,
    fontFamily: typography.fontFamily.regular,
  },
  registeredText: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.medium,
    fontFamily: typography.fontFamily.regular,
    marginTop: 2,
  },
  itemActions: {
    alignItems: 'center',
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
  addButton: {
    borderWidth: 1,
    borderRadius: dimensions.borderRadius.md,
    paddingHorizontal: dimensions.spacing.md,
    paddingVertical: dimensions.spacing.xs,
  },
  addButtonText: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.medium,
    fontFamily: typography.fontFamily.regular,
  },
  inviteButton: {
    borderRadius: dimensions.borderRadius.md,
    paddingHorizontal: dimensions.spacing.md,
    paddingVertical: dimensions.spacing.xs,
  },
  inviteButtonText: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.medium,
    fontFamily: typography.fontFamily.regular,
  },
  moreButton: {
    padding: dimensions.spacing.xs,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: dimensions.spacing.xl * 2,
  },
  emptyText: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.medium,
    fontFamily: typography.fontFamily.regular,
    marginTop: dimensions.spacing.md,
    marginBottom: dimensions.spacing.xs,
  },
  emptySubtext: {
    fontSize: typography.sizes.sm,
    fontFamily: typography.fontFamily.regular,
    marginBottom: dimensions.spacing.lg,
  },
  syncButton: {
    borderRadius: dimensions.borderRadius.lg,
    paddingHorizontal: dimensions.spacing.lg,
    paddingVertical: dimensions.spacing.md,
  },
  syncButtonText: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.semibold,
    fontFamily: typography.fontFamily.regular,
  },
});