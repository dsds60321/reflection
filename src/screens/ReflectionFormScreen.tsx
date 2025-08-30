import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useColors } from '../hooks/useColors';
import { useAlert } from '../context/AlertContext';
import { FriendSelector } from '../components/common/FriendSelector';
import { useTheme } from '../context/ThemeContext';
import { typography } from '../styles/typography';
import { dimensions } from '../styles/dimensions';
import Ionicons from 'react-native-vector-icons/Ionicons';

interface ReflectionFormData {
  title: string;
  content: string;
  recipient: string;
  reward: string;
}

interface SelectedFriend {
  id: string;
  name: string;
  email?: string;
}


export const ReflectionFormScreen: React.FC = () => {
  const colors = useColors();
  const { theme } = useTheme();
  const navigation = useNavigation();
  const route = useRoute();
  const { showAlert } = useAlert();

  const { reflection, mode } = route.params as {
    reflection?: any;
    mode?: 'create' | 'edit'
  } || { mode: 'create' };

  // 폼 상태
  const [formData, setFormData] = useState<ReflectionFormData>({
    title: '',
    content: '',
    recipient: '',
    reward: '',
  });

  // 친구 상태
  const [selectedFriends, setSelectedFriends] = useState<Friend[]>([]);
  const [showFriendSelector, setShowFriendSelector] = useState(false);

  // 유효성 검사 상태
  const [errors, setErrors] = useState<Partial<ReflectionFormData>>({});


  // 수정 모드일 때 기존 데이터 로드
  useEffect(() => {
    if (mode === 'edit' && reflection) {
      setFormData({
        title: reflection.title || '',
        content: reflection.content || '',
        recipient: reflection.recipient || '',
        reward: reflection.reward || '',
      });
    }
  }, [mode, reflection]);

  // 친구 선택 시 recipient 자동 설정
  useEffect(() => {
    if (selectedFriends.length > 0) {
      const recipientNames = selectedFriends.map(f => f.name).join(', ');
      setFormData(prev => ({
        ...prev,
        recipient: recipientNames
      }));
      // recipient 에러 제거
      if (errors.recipient) {
        setErrors(prev => ({ ...prev, recipient: undefined }));
      }
    } else {
      setFormData(prev => ({
        ...prev,
        recipient: ''
      }));
    }
  }, [selectedFriends, errors.recipient]);



  // 입력값 변경 핸들러
  const handleInputChange = (field: keyof ReflectionFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // 입력 시 해당 필드의 에러 제거
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  // 친구 선택 핸들러
  const handleFriendsSelect = (friends: Friend[]) => {
    setSelectedFriends(friends);
  };


  // recipient 직접 입력 시 선택된 친구 초기화
  const handleRecipientChange = (text: string) => {
    handleInputChange('recipient', text);
    // 직접 입력된 텍스트가 선택된 친구들과 다르면 친구 선택 초기화
    const currentNames = selectedFriends.map(f => f.name).join(', ');
    if (text !== currentNames) {
      setSelectedFriends([]);
    }
  };

  // 선택된 친구 제거
  const removeFriend = (friendId: string) => {
    setSelectedFriends(prev => prev.filter(f => f.id !== friendId));
  };


  // 유효성 검사
  const validateForm = (): boolean => {
    const newErrors: Partial<ReflectionFormData> = {};

    if (!formData.title.trim()) {
      newErrors.title = '제목을 입력해주세요';
    }

    if (!formData.content.trim()) {
      newErrors.content = '반성 내용을 입력해주세요';
    } else if (formData.content.trim().length < 10) {
      newErrors.content = '반성 내용을 10자 이상 입력해주세요';
    }

    if (!formData.recipient.trim()) {
      newErrors.recipient = '전달 대상을 입력해주세요';
    }

    if (!formData.reward.trim()) {
      newErrors.reward = '보상을 입력해주세요';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // 제출 핸들러
  const handleSubmit = () => {
    if (validateForm()) {
      showAlert({
        title: '등록 완료',
        message: `반성문이 성공적으로 ${mode === 'edit' ? '수정' : '등록'}되었습니다.`,
        icon: 'check-circle',
        iconColor: colors.primary.coral,
        buttons: [
          {
            text: '확인',
            onPress: () => navigation.goBack(),
          },
        ],
      });
    }
  };


  // 취소 핸들러
  const handleCancel = () => {
    const hasChanges = formData.title || formData.content || formData.recipient || formData.reward;

    if (hasChanges) {
      showAlert({
        title: '작성 취소',
        message: '작성 중인 내용이 사라집니다. 계속하시겠습니까?',
        icon: 'alert-circle',
        iconColor: colors.text.secondary,
        buttons: [
          { text: '계속 작성', style: 'cancel' },
          {
            text: '취소',
            style: 'destructive',
            onPress: () => navigation.goBack(),
          },
        ],
      });
    } else {
      navigation.goBack();
    }
  };


  // 미리보기 렌더링
  const renderPreview = () => (
    <View style={styles.previewSection}>
      <Text style={[styles.previewTitle, { color: colors.text.primary }]}>미리보기</Text>
      <View style={[styles.previewCard, { backgroundColor: colors.background.card }]}>
        <View style={styles.previewHeader}>
          <View style={[styles.previewIcon, { backgroundColor: colors.primary.yellow }]}>
            <Image
              source={require("../assets/images/devil.png")}
              style={styles.previewIconImage}
            />
          </View>
          <View style={styles.previewHeaderText}>
            <Text style={[styles.previewCardTitle, { color: colors.text.primary }]}>
              {formData.title || '제목을 입력해주세요'}
            </Text>
            <Text style={[styles.previewAuthor, { color: colors.text.secondary }]}>
              나 → {formData.recipient || '전달 대상'}
            </Text>
          </View>
        </View>

        <Text style={[styles.previewContent, { color: colors.text.secondary }]}>
          {formData.content || '반성 내용을 입력해주세요...'}
        </Text>

        <View style={styles.previewFooter}>
          <Text style={[styles.previewDate, { color: colors.text.secondary }]}>
            {new Date().toLocaleDateString('ko-KR')}
          </Text>
          <View style={styles.previewActions}>
            <View style={[styles.previewChip, { backgroundColor: colors.background.cardSecondary }]}>
              <Text style={[styles.previewChipText, { color: colors.text.secondary }]}>
                {formData.reward || '보상'}
              </Text>
            </View>
            <View style={[styles.previewStatusChip, { backgroundColor: colors.background.cardSecondary }]}>
              <Text style={[styles.previewStatusText, { color: colors.text.secondary }]}>
                대기중
              </Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );

  // 전달 대상 입력 부분 렌더링
  const renderRecipientInput = () => (
    <View style={styles.inputGroup}>
      <Text style={[styles.inputLabel, { color: colors.text.primary }]}>
        전달 대상 <Text style={{ color: colors.primary.coral }}>*</Text>
      </Text>

      {/* 선택된 친구들 표시 */}
      {selectedFriends.length > 0 && (
        <View style={styles.selectedFriendsContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.selectedFriendsScroll}>
            {selectedFriends.map((friend) => (
              <View key={friend.id} style={[styles.selectedFriendChip, { backgroundColor: colors.background.card }]}>
                <Text style={[styles.selectedFriendName, { color: colors.text.primary }]}>
                  {friend.name}
                </Text>
                <TouchableOpacity
                  onPress={() => removeFriend(friend.id)}
                  style={styles.removeFriendButton}
                >
                  <Ionicons name="close-circle" size={16} color={colors.text.secondary} />
                </TouchableOpacity>
              </View>
            ))}
          </ScrollView>
        </View>
      )}

      {/* 입력 필드와 친구 선택 버튼 */}
      <View style={styles.recipientInputContainer}>
        <TextInput
          style={[
            styles.textInput,
            styles.recipientInput,
            {
              backgroundColor: colors.background.card,
              color: colors.text.primary,
              borderColor: errors.recipient ? colors.primary.coral : 'transparent'
            }
          ]}
          placeholder="직접 입력하거나 친구 선택"
          placeholderTextColor={colors.text.secondary}
          value={formData.recipient}
          onChangeText={handleRecipientChange}
          maxLength={100}
          multiline
        />
        <TouchableOpacity
          onPress={() => setShowFriendSelector(true)}
          style={[styles.friendSelectButton, { backgroundColor: colors.primary.coral }]}
        >
          <Ionicons name="people" size={16} color={colors.text.white} />
          <Text style={[styles.friendSelectText, { color: colors.text.white }]}>
            친구 선택
          </Text>
          {selectedFriends.length > 0 && (
            <View style={[styles.selectedCountBadge, { backgroundColor: colors.text.white }]}>
              <Text style={[styles.selectedCountText, { color: colors.primary.coral }]}>
                {selectedFriends.length}
              </Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      {errors.recipient && (
        <Text style={[styles.errorText, { color: colors.primary.coral }]}>
          {errors.recipient}
        </Text>
      )}
    </View>
  );


  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background.primary }]}>
      {/* 헤더 */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleCancel} style={styles.headerButton}>
          <Ionicons name="arrow-back" size={24} color={colors.text.primary} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text.primary }]}>
          {mode === 'edit' ? '반성문 수정' : '반성문 작성'}
        </Text>
        <TouchableOpacity
          onPress={handleSubmit}
          style={[
            styles.headerButton,
            styles.submitButton,
            { backgroundColor: colors.primary.coral }
          ]}
        >
          <Text style={[styles.submitButtonText, { color: colors.text.white }]}>
            {mode === 'edit' ? '수정' : '등록'}
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.content}>
          {/* 폼 섹션 */}
          <View style={styles.formSection}>
            {/* 제목 입력 */}
            <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, { color: colors.text.primary }]}>
                제목 <Text style={{ color: colors.primary.coral }}>*</Text>
              </Text>
              <TextInput
                style={[
                  styles.textInput,
                  {
                    backgroundColor: colors.background.card,
                    color: colors.text.primary,
                    borderColor: errors.title ? colors.primary.coral : 'transparent'
                  }
                ]}
                placeholder="반성문 제목을 입력해주세요"
                placeholderTextColor={colors.text.secondary}
                value={formData.title}
                onChangeText={(text) => handleInputChange('title', text)}
                maxLength={50}
              />
              {errors.title && (
                <Text style={[styles.errorText, { color: colors.primary.coral }]}>
                  {errors.title}
                </Text>
              )}
            </View>

            {/* 전달 대상 입력 - 수정된 부분 */}
            {renderRecipientInput()}

            {/* 보상 입력 */}
            <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, { color: colors.text.primary }]}>
                보상 <Text style={{ color: colors.primary.coral }}>*</Text>
              </Text>
              <TextInput
                style={[
                  styles.textInput,
                  {
                    backgroundColor: colors.background.card,
                    color: colors.text.primary,
                    borderColor: errors.reward ? colors.primary.coral : 'transparent'
                  }
                ]}
                placeholder="어떤 보상을 할까요? (예: 점심 사기, 커피 사기)"
                placeholderTextColor={colors.text.secondary}
                value={formData.reward}
                onChangeText={(text) => handleInputChange('reward', text)}
                maxLength={20}
              />
              {errors.reward && (
                <Text style={[styles.errorText, { color: colors.primary.coral }]}>
                  {errors.reward}
                </Text>
              )}
            </View>

            {/* 반성 내용 입력 */}
            <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, { color: colors.text.primary }]}>
                반성 내용 <Text style={{ color: colors.primary.coral }}>*</Text>
              </Text>
              <TextInput
                style={[
                  styles.textArea,
                  {
                    backgroundColor: colors.background.card,
                    color: colors.text.primary,
                    borderColor: errors.content ? colors.primary.coral : 'transparent'
                  }
                ]}
                placeholder="무엇을 반성하고, 어떻게 개선할 것인지 구체적으로 작성해주세요&#10;(최소 10자 이상)"
                placeholderTextColor={colors.text.secondary}
                value={formData.content}
                onChangeText={(text) => handleInputChange('content', text)}
                multiline
                numberOfLines={6}
                textAlignVertical="top"
                maxLength={500}
              />
              <View style={styles.textCountContainer}>
                {errors.content && (
                  <Text style={[styles.errorText, { color: colors.primary.coral }]}>
                    {errors.content}
                  </Text>
                )}
                <Text style={[styles.textCount, { color: colors.text.secondary }]}>
                  {formData.content.length}/500
                </Text>
              </View>
            </View>
          </View>

          {/* 미리보기 섹션 */}
          {renderPreview()}
        </View>

      </ScrollView>

      {/* 친구 선택 모달 */}
      <FriendSelector
        visible={showFriendSelector}
        onClose={() => setShowFriendSelector(false)}
        onConfirm={handleFriendsSelect}
        selectedFriends={selectedFriends}
        multiple={true}
        title="반성문 전달 대상 선택"
      />
    </SafeAreaView>
  );
};

const additionalStyles = StyleSheet.create({
  selectedFriendsContainer: {
    marginBottom: dimensions.spacing.sm,
  },
  selectedFriendsScroll: {
    maxHeight: 80,
  },
  selectedFriendChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: dimensions.spacing.sm,
    paddingVertical: dimensions.spacing.xs,
    borderRadius: dimensions.borderRadius.md,
    marginRight: dimensions.spacing.xs,
    marginBottom: dimensions.spacing.xs,
    gap: dimensions.spacing.xs,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.1)',
  },
  selectedFriendName: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.medium,
    fontFamily: typography.fontFamily.regular,
  },
  selectedCountBadge: {
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedCountText: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.bold,
    fontFamily: typography.fontFamily.regular,
  },
});


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
    padding: dimensions.spacing.sm,
    minWidth: 40,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.bold,
    fontFamily: typography.fontFamily.regular,
  },
  submitButton: {
    borderRadius: dimensions.borderRadius.md,
    paddingHorizontal: dimensions.spacing.lg,
  },
  submitButtonText: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.semibold,
    fontFamily: typography.fontFamily.regular,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: dimensions.spacing.lg,
  },
  formSection: {
    marginBottom: dimensions.spacing.xl,
  },
  inputGroup: {
    marginBottom: dimensions.spacing.lg,
  },
  inputLabel: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.semibold,
    fontFamily: typography.fontFamily.regular,
    marginBottom: dimensions.spacing.sm,
  },
  textInput: {
    borderRadius: dimensions.borderRadius.md,
    paddingHorizontal: dimensions.spacing.md,
    paddingVertical: dimensions.spacing.sm,
    fontSize: typography.sizes.md,
    fontFamily: typography.fontFamily.regular,
    borderWidth: 1,
    minHeight: 48,
  },
  textArea: {
    borderRadius: dimensions.borderRadius.md,
    paddingHorizontal: dimensions.spacing.md,
    paddingVertical: dimensions.spacing.sm,
    fontSize: typography.sizes.md,
    fontFamily: typography.fontFamily.regular,
    borderWidth: 1,
    minHeight: 120,
  },
  recipientInputContainer: {
    flexDirection: 'row',
    gap: dimensions.spacing.sm,
  },
  recipientInput: {
    flex: 1,
  },
  friendSelectButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: dimensions.spacing.md,
    paddingVertical: dimensions.spacing.sm,
    borderRadius: dimensions.borderRadius.md,
    gap: dimensions.spacing.xs,
    minHeight: 48,
  },
  friendSelectText: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.medium,
    fontFamily: typography.fontFamily.regular,
  },
  selectedFriendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: dimensions.spacing.md,
    borderRadius: dimensions.borderRadius.md,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  selectedFriendInfo: {
    flex: 1,
  },
  selectedFriendName: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.medium,
    fontFamily: typography.fontFamily.regular,
  },
  selectedFriendEmail: {
    fontSize: typography.sizes.sm,
    fontFamily: typography.fontFamily.regular,
    marginTop: 2,
  },
  removeFriendButton: {
    padding: dimensions.spacing.xs,
  },

  textCountContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: dimensions.spacing.xs,
  },
  textCount: {
    fontSize: typography.sizes.sm,
    fontFamily: typography.fontFamily.regular,
  },
  errorText: {
    fontSize: typography.sizes.sm,
    fontFamily: typography.fontFamily.regular,
    marginTop: dimensions.spacing.xs,
  },
  previewSection: {
    marginBottom: dimensions.spacing.xl,
  },
  previewTitle: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.semibold,
    fontFamily: typography.fontFamily.regular,
    marginBottom: dimensions.spacing.md,
  },
  previewCard: {
    padding: dimensions.spacing.md,
    borderRadius: dimensions.borderRadius.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  previewHeader: {
    flexDirection: 'row',
    marginBottom: dimensions.spacing.sm,
  },
  previewIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: dimensions.spacing.md,
  },
  previewIconImage: {
    width: 28,
    height: 28,
  },
  previewHeaderText: {
    flex: 1,
  },
  previewCardTitle: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.semibold,
    fontFamily: typography.fontFamily.regular,
    marginBottom: dimensions.spacing.xs,
  },
  previewAuthor: {
    fontSize: typography.sizes.sm,
    fontFamily: typography.fontFamily.regular,
  },
  previewContent: {
    fontSize: typography.sizes.sm,
    fontFamily: typography.fontFamily.regular,
    lineHeight: typography.sizes.sm * 1.4,
    marginBottom: dimensions.spacing.sm,
    minHeight: 40,
  },
  previewFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  previewDate: {
    fontSize: typography.sizes.xs,
    fontFamily: typography.fontFamily.regular,
  },
  previewActions: {
    flexDirection: 'row',
    gap: dimensions.spacing.xs,
  },
  previewChip: {
    paddingHorizontal: dimensions.spacing.sm,
    paddingVertical: dimensions.spacing.xs,
    borderRadius: dimensions.borderRadius.sm,
  },
  previewChipText: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.medium,
    fontFamily: typography.fontFamily.regular,
  },
  previewStatusChip: {
    paddingHorizontal: dimensions.spacing.sm,
    paddingVertical: dimensions.spacing.xs,
    borderRadius: dimensions.borderRadius.sm,
  },
  previewStatusText: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.medium,
    fontFamily: typography.fontFamily.regular,
  },
  ...additionalStyles,
});