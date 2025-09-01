import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
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

interface PraiseFormData {
  title: string;
  content: string;
  recipient: string;
}

interface SelectedFriend {
  id: string;
  name: string;
  email?: string;
}

export const PraiseFormScreen: React.FC = () => {
  const colors = useColors();
  const { theme } = useTheme();
  const navigation = useNavigation();
  const route = useRoute();
  const { showAlert } = useAlert();

  const { praise, mode } = route.params as {
    praise?: any;
    mode?: 'create' | 'edit'
  } || { mode: 'create' };

  // 폼 상태
  const [formData, setFormData] = useState<PraiseFormData>({
    title: '',
    content: '',
    recipient: '',
  });

  // 친구 상태
  const [selectedFriends, setSelectedFriends] = useState<Friend[]>([]);
  const [showFriendSelector, setShowFriendSelector] = useState(false);

  // 유효성 검사 상태
  const [errors, setErrors] = useState<Partial<PraiseFormData>>({});

  // 수정 모드일 때 기존 데이터 로드
  useEffect(() => {
    if (mode === 'edit' && praise) {
      setFormData({
        title: praise.title || '',
        content: praise.content || '',
        recipient: praise.recipient || '',
      });
    }
  }, [mode, praise]);

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
  const handleInputChange = (field: keyof PraiseFormData, value: string) => {
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
    const newErrors: Partial<PraiseFormData> = {};

    if (!formData.title.trim()) {
      newErrors.title = '제목을 입력해주세요';
    }

    if (!formData.content.trim()) {
      newErrors.content = '칭찬 내용을 입력해주세요';
    } else if (formData.content.trim().length < 10) {
      newErrors.content = '칭찬 내용을 10자 이상 입력해주세요';
    }

    if (!formData.recipient.trim()) {
      newErrors.recipient = '칭찬 대상을 입력해주세요';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // 제출 핸들러
  const handleSubmit = () => {
    if (validateForm()) {
      showAlert({
        title: '등록 완료',
        message: `칭찬이 성공적으로 ${mode === 'edit' ? '수정' : '등록'}되었습니다.`,
        icon: 'check-circle',
        iconColor: colors.primary.yellow,
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
    const hasChanges = formData.title || formData.content || formData.recipient;

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
              source={require("../assets/images/angel.png")}
              style={styles.previewIconImage}
            />
          </View>
          <View style={styles.previewHeaderText}>
            <Text style={[styles.previewCardTitle, { color: colors.text.primary }]}>
              {formData.title || '제목을 입력해주세요'}
            </Text>
            <Text style={[styles.previewAuthor, { color: colors.text.secondary }]}>
              나 → {formData.recipient || '칭찬 대상'}
            </Text>
          </View>
        </View>

        <Text style={[styles.previewContent, { color: colors.text.secondary }]}>
          {formData.content || '칭찬 내용을 입력해주세요...'}
        </Text>

        <View style={styles.previewFooter}>
          <Text style={[styles.previewDate, { color: colors.text.secondary }]}>
            {new Date().toLocaleDateString('ko-KR')}
          </Text>
          <View style={styles.previewActions}>
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

  // 칭찬 대상 입력 부분 렌더링
  const renderRecipientInput = () => (
    <View style={styles.inputGroup}>
      <Text style={[styles.inputLabel, { color: colors.text.primary }]}>
        칭찬 대상 <Text style={{ color: colors.primary.coral }}>*</Text>
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
          style={[styles.friendSelectButton, { backgroundColor: colors.primary.yellow }]}
        >
          <Ionicons name="people" size={16} color={colors.text.primary} />
          <Text style={[styles.friendSelectText, { color: colors.text.primary }]}>
            친구 선택
          </Text>
          {selectedFriends.length > 0 && (
            <View style={[styles.selectedCountBadge, { backgroundColor: colors.text.primary }]}>
              <Text style={[styles.selectedCountText, { color: colors.primary.yellow }]}>
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
      {/* Header */}
      <View style={[styles.header, { borderBottomColor: colors.background.cardSecondary }]}>
        <TouchableOpacity onPress={handleCancel} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.text.primary} />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <View style={[styles.iconContainer, { backgroundColor: colors.primary.yellow }]}>
            <Image
              source={require("../assets/images/angel.png")}
              style={styles.headerIcon}
            />
          </View>
          <Text style={[styles.headerTitle, { color: colors.text.primary }]}>
            {mode === 'edit' ? '칭찬 수정' : '칭찬 작성'}
          </Text>
        </View>
        <TouchableOpacity onPress={handleSubmit} style={styles.submitButton}>
          <Text style={[styles.submitButtonText, { color: colors.primary.yellow }]}>
            {mode === 'edit' ? '수정' : '등록'}
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollContainer}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Form Fields */}
        <View style={styles.formContainer}>
          {/* Title Input */}
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
              placeholder="칭찬의 제목을 입력해주세요"
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

          {/* Recipient Input */}
          {renderRecipientInput()}

          {/* Content Input */}
          <View style={styles.inputGroup}>
            <Text style={[styles.inputLabel, { color: colors.text.primary }]}>
              칭찬 내용 <Text style={{ color: colors.primary.coral }}>*</Text>
            </Text>
            <TextInput
              style={[
                styles.textInput,
                styles.textArea,
                {
                  backgroundColor: colors.background.card,
                  color: colors.text.primary,
                  borderColor: errors.content ? colors.primary.coral : 'transparent'
                }
              ]}
              placeholder="어떤 점이 좋았는지, 고마운 일은 무엇인지 자세히 적어보세요"
              placeholderTextColor={colors.text.secondary}
              value={formData.content}
              onChangeText={(text) => handleInputChange('content', text)}
              multiline
              numberOfLines={6}
              textAlignVertical="top"
              maxLength={500}
            />
            <Text style={[styles.characterCount, { color: colors.text.secondary }]}>
              {formData.content.length}/500
            </Text>
            {errors.content && (
              <Text style={[styles.errorText, { color: colors.primary.coral }]}>
                {errors.content}
              </Text>
            )}
          </View>
        </View>

        {/* Preview */}
        {renderPreview()}
      </ScrollView>

      {/* Friend Selector Modal */}
      <FriendSelector
        visible={showFriendSelector}
        onClose={() => setShowFriendSelector(false)}
        onSelect={handleFriendsSelect}
        selectedFriends={selectedFriends}
        multiSelect={true}
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
    marginRight: dimensions.spacing.sm,
  },
  headerCenter: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
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
  submitButton: {
    padding: dimensions.spacing.sm,
  },
  submitButtonText: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.semibold,
    fontFamily: typography.fontFamily.regular,
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: dimensions.spacing.xxl,
  },
  formContainer: {
    padding: dimensions.spacing.lg,
  },
  inputGroup: {
    marginBottom: dimensions.spacing.lg,
  },
  inputLabel: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.medium,
    marginBottom: dimensions.spacing.sm,
    fontFamily: typography.fontFamily.regular,
  },
  textInput: {
    fontSize: typography.sizes.md,
    padding: dimensions.spacing.md,
    borderRadius: dimensions.borderRadius.lg,
    borderWidth: 1,
    fontFamily: typography.fontFamily.regular,
  },
  textArea: {
    height: 120,
    textAlignVertical: 'top',
  },
  recipientInput: {
    flex: 1,
    minHeight: 40,
  },
  characterCount: {
    fontSize: typography.sizes.sm,
    textAlign: 'right',
    marginTop: dimensions.spacing.xs,
    fontFamily: typography.fontFamily.regular,
  },
  errorText: {
    fontSize: typography.sizes.sm,
    marginTop: dimensions.spacing.xs,
    fontFamily: typography.fontFamily.regular,
  },
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
    marginRight: dimensions.spacing.sm,
    marginBottom: dimensions.spacing.xs,
  },
  selectedFriendName: {
    fontSize: typography.sizes.sm,
    marginRight: dimensions.spacing.xs,
    fontFamily: typography.fontFamily.regular,
  },
  removeFriendButton: {
    padding: 2,
  },
  recipientInputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: dimensions.spacing.sm,
  },
  friendSelectButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: dimensions.spacing.md,
    paddingVertical: dimensions.spacing.sm,
    borderRadius: dimensions.borderRadius.md,
    gap: dimensions.spacing.xs,
  },
  friendSelectText: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.medium,
    fontFamily: typography.fontFamily.regular,
  },
  selectedCountBadge: {
    width: 18,
    height: 18,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: dimensions.spacing.xs,
  },
  selectedCountText: {
    fontSize: 10,
    fontWeight: typography.weights.bold,
    fontFamily: typography.fontFamily.regular,
  },
  previewSection: {
    padding: dimensions.spacing.lg,
    paddingTop: 0,
  },
  previewTitle: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.semibold,
    marginBottom: dimensions.spacing.sm,
    fontFamily: typography.fontFamily.regular,
  },
  previewCard: {
    padding: dimensions.spacing.md,
    borderRadius: dimensions.borderRadius.lg,
  },
  previewHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: dimensions.spacing.sm,
  },
  previewIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: dimensions.spacing.sm,
  },
  previewIconImage: {
    width: 20,
    height: 20,
  },
  previewHeaderText: {
    flex: 1,
  },
  previewCardTitle: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.semibold,
    marginBottom: 2,
    fontFamily: typography.fontFamily.regular,
  },
  previewAuthor: {
    fontSize: typography.sizes.sm,
    fontFamily: typography.fontFamily.regular,
  },
  previewContent: {
    fontSize: typography.sizes.sm,
    lineHeight: typography.sizes.sm * 1.4,
    marginBottom: dimensions.spacing.sm,
    fontFamily: typography.fontFamily.regular,
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
});