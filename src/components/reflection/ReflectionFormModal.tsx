import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  ScrollView,
  StyleSheet,
  Alert,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useColors } from '../../hooks/useColors';
import { useTheme } from '../../context/ThemeContext';
import { typography } from '../../styles/typography';
import { dimensions } from '../../styles/dimensions';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

interface ReflectionFormData {
  title: string;
  content: string;
  recipient: string;
  reward: string;
}

interface ReflectionFormModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (data: ReflectionFormData) => void;
}

export const ReflectionFormModal: React.FC<ReflectionFormModalProps> = ({
                                                                          visible,
                                                                          onClose,
                                                                          onSubmit,
                                                                        }) => {
  const colors = useColors();
  const { theme } = useTheme();

  // 폼 상태
  const [formData, setFormData] = useState<ReflectionFormData>({
    title: '',
    content: '',
    recipient: '',
    reward: '',
  });

  // 유효성 검사 상태
  const [errors, setErrors] = useState<Partial<ReflectionFormData>>({});

  // 입력값 변경 핸들러
  const handleInputChange = (field: keyof ReflectionFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // 입력 시 해당 필드의 에러 제거
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
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
      onSubmit(formData);
      handleReset();
      onClose();
    }
  };

  // 폼 초기화
  const handleReset = () => {
    setFormData({
      title: '',
      content: '',
      recipient: '',
      reward: '',
    });
    setErrors({});
  };

  // 취소 핸들러
  const handleCancel = () => {
    if (formData.title || formData.content || formData.recipient || formData.reward) {
      Alert.alert(
        '작성 취소',
        '작성 중인 내용이 사라집니다. 계속하시겠습니까?',
        [
          { text: '계속 작성', style: 'cancel' },
          {
            text: '취소',
            style: 'destructive',
            onPress: () => {
              handleReset();
              onClose();
            }
          },
        ]
      );
    } else {
      onClose();
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
              source={require("../../assets/images/devil.png")}
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

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
    >
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background.primary }]}>
        {/* 헤더 */}
        <View style={styles.header}>
          <TouchableOpacity onPress={handleCancel} style={styles.headerButton}>
            <MaterialCommunityIcons name="close" size={24} color={colors.text.primary} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: colors.text.primary }]}>반성문 작성</Text>
          <TouchableOpacity
            onPress={handleSubmit}
            style={[
              styles.headerButton,
              styles.submitButton,
              { backgroundColor: colors.primary.coral }
            ]}
          >
            <Text style={[styles.submitButtonText, { color: colors.text.white }]}>등록</Text>
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

              {/* 전달 대상 입력 */}
              <View style={styles.inputGroup}>
                <Text style={[styles.inputLabel, { color: colors.text.primary }]}>
                  전달 대상 <Text style={{ color: colors.primary.coral }}>*</Text>
                </Text>
                <TextInput
                  style={[
                    styles.textInput,
                    {
                      backgroundColor: colors.background.card,
                      color: colors.text.primary,
                      borderColor: errors.recipient ? colors.primary.coral : 'transparent'
                    }
                  ]}
                  placeholder="누구에게 전달할까요? (예: 팀장님, 동료들)"
                  placeholderTextColor={colors.text.secondary}
                  value={formData.recipient}
                  onChangeText={(text) => handleInputChange('recipient', text)}
                  maxLength={30}
                />
                {errors.recipient && (
                  <Text style={[styles.errorText, { color: colors.primary.coral }]}>
                    {errors.recipient}
                  </Text>
                )}
              </View>

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
      </SafeAreaView>
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

  // 폼 섹션
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

  // 미리보기 섹션
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
});