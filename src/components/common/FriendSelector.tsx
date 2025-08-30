import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  ScrollView,
  Modal,
} from 'react-native';
import { useColors } from '../../hooks/useColors';
import { typography } from '../../styles/typography';
import { dimensions } from '../../styles/dimensions';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

interface Friend {
  id: string;
  name: string;
  email?: string;
}

interface FriendSelectorProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: (friends: Friend[]) => void;
  selectedFriends: Friend[];
  multiple?: boolean; // 다중 선택 여부
  title?: string;
}

const MOCK_FRIENDS: Friend[] = [
  { id: '1', name: '김영희', email: 'younghee@example.com' },
  { id: '2', name: '박민준', email: 'minjun@example.com' },
  { id: '3', name: '이서연', email: 'seoyeon@example.com' },
  { id: '4', name: '정한솔', email: 'hansol@example.com' },
  { id: '5', name: '최지우', email: 'jiwoo@example.com' },
  { id: '6', name: '강태현', email: 'taehyun@example.com' },
];

export const FriendSelector: React.FC<FriendSelectorProps> = ({
                                                                visible,
                                                                onClose,
                                                                onConfirm,
                                                                selectedFriends,
                                                                multiple = true,
                                                                title = '친구 선택',
                                                              }) => {
  const colors = useColors();
  const [searchQuery, setSearchQuery] = useState('');
  const [tempSelectedFriends, setTempSelectedFriends] = useState<Friend[]>(selectedFriends);

  const filteredFriends = useMemo(() => {
    if (!searchQuery) return MOCK_FRIENDS;
    return MOCK_FRIENDS.filter(friend =>
      friend.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  const handleFriendToggle = (friend: Friend) => {
    if (multiple) {
      setTempSelectedFriends(prev => {
        const isSelected = prev.some(f => f.id === friend.id);
        if (isSelected) {
          return prev.filter(f => f.id !== friend.id);
        } else {
          return [...prev, friend];
        }
      });
    } else {
      // 단일 선택 모드
      setTempSelectedFriends([friend]);
    }
  };

  const handleConfirm = () => {
    onConfirm(tempSelectedFriends);
    onClose();
  };

  const handleCancel = () => {
    setTempSelectedFriends(selectedFriends);
    onClose();
  };

  const isSelected = (friendId: string) => {
    return tempSelectedFriends.some(f => f.id === friendId);
  };

  const handleSelectAll = () => {
    if (tempSelectedFriends.length === filteredFriends.length) {
      setTempSelectedFriends([]);
    } else {
      setTempSelectedFriends([...filteredFriends]);
    }
  };

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <View style={[styles.container, { backgroundColor: colors.background.primary }]}>
        {/* 헤더 */}
        <View style={styles.header}>
          <TouchableOpacity onPress={handleCancel} style={styles.headerButton}>
            <Text style={[styles.cancelText, { color: colors.text.secondary }]}>취소</Text>
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: colors.text.primary }]}>
            {title}
          </Text>
          <TouchableOpacity onPress={handleConfirm} style={styles.headerButton}>
            <Text style={[styles.confirmText, { color: colors.primary.coral }]}>완료</Text>
          </TouchableOpacity>
        </View>

        {/* 선택된 친구 수 표시 */}
        {multiple && (
          <View style={styles.selectionInfo}>
            <Text style={[styles.selectionText, { color: colors.text.secondary }]}>
              {tempSelectedFriends.length}명 선택됨
            </Text>
            <TouchableOpacity onPress={handleSelectAll} style={styles.selectAllButton}>
              <Text style={[styles.selectAllText, { color: colors.primary.coral }]}>
                {tempSelectedFriends.length === filteredFriends.length ? '전체 해제' : '전체 선택'}
              </Text>
            </TouchableOpacity>
          </View>
        )}


        {/* 검색바 */}
        <View style={[styles.searchContainer, { backgroundColor: colors.background.card }]}>
          <MaterialCommunityIcons name="magnify" size={20} color={colors.text.secondary} />
          <TextInput
            style={[styles.searchInput, { color: colors.text.primary }]}
            placeholder="친구 이름 검색"
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

        {/* 친구 목록 */}
        <ScrollView style={styles.friendsList}>
          {filteredFriends.map((friend) => {
            const selected = isSelected(friend.id);
            return (
              <TouchableOpacity
                key={friend.id}
                style={[
                  styles.friendItem,
                  {
                    backgroundColor: selected ? colors.background.cardSecondary : colors.background.card,
                    borderColor: selected ? colors.primary.coral : 'transparent',
                    borderWidth: selected ? 1 : 0,
                  }
                ]}
                onPress={() => handleFriendToggle(friend)}
              >
                <View style={[styles.avatar, { backgroundColor: colors.background.cardSecondary }]}>
                  <Ionicons name="person" size={20} color={colors.text.white} />
                </View>
                <View style={styles.friendInfo}>
                  <Text style={[styles.friendName, { color: colors.text.primary }]}>
                    {friend.name}
                  </Text>
                  {friend.email && (
                    <Text style={[styles.friendEmail, { color: colors.text.secondary }]}>
                      {friend.email}
                    </Text>
                  )}
                </View>

                {/* 체크박스 또는 라디오 버튼 */}
                <View style={[
                  styles.checkContainer,
                  selected && { backgroundColor: colors.primary.coral }
                ]}>
                  {selected && (
                    <MaterialCommunityIcons
                      name="check"
                      size={16}
                      color={colors.text.white}
                    />
                  )}
                </View>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>
    </Modal>
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
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  headerButton: {
    minWidth: 60,
  },
  cancelText: {
    fontSize: typography.sizes.md,
    fontFamily: typography.fontFamily.regular,
  },
  confirmText: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.semibold,
    fontFamily: typography.fontFamily.regular,
    textAlign: 'right',
  },
  headerTitle: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.bold,
    fontFamily: typography.fontFamily.regular,
  },
  selectionInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: dimensions.spacing.lg,
    paddingVertical: dimensions.spacing.sm,
  },
  selectionText: {
    fontSize: typography.sizes.sm,
    fontFamily: typography.fontFamily.regular,
  },
  selectAllButton: {
    padding: dimensions.spacing.xs,
  },
  selectAllText: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.medium,
    fontFamily: typography.fontFamily.regular,
  },
  selectedChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: dimensions.spacing.sm,
    paddingVertical: dimensions.spacing.xs,
    borderRadius: dimensions.borderRadius.md,
    marginRight: dimensions.spacing.xs,
    gap: dimensions.spacing.xs,
    maxWidth: 120,
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
  friendsList: {
    flex: 1,
    paddingHorizontal: dimensions.spacing.lg,
  },
  friendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: dimensions.spacing.md,
    borderRadius: dimensions.borderRadius.lg,
    marginBottom: dimensions.spacing.sm,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: dimensions.spacing.md,
  },
  friendInfo: {
    flex: 1,
  },
  friendName: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.medium,
    fontFamily: typography.fontFamily.regular,
  },
  friendEmail: {
    fontSize: typography.sizes.sm,
    fontFamily: typography.fontFamily.regular,
    marginTop: 2,
  },
  checkContainer: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#E0E0E0',
    alignItems: 'center',
    justifyContent: 'center',
  },
});