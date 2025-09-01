import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useColors } from '../hooks/useColors';
import { useAlert } from '../context/AlertContext';
import { typography } from '../styles/typography';
import { dimensions } from '../styles/dimensions';
import Ionicons from 'react-native-vector-icons/Ionicons';

export const EditProfileScreen: React.FC = () => {
  const colors = useColors();
  const navigation = useNavigation();
  const { showAlert } = useAlert();

  const [formData, setFormData] = useState({
    name: '홍길동',
    email: 'hong@example.com',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState<any>({});

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev: any) => ({ ...prev, [field]: undefined }));
    }
  };

  const validateForm = () => {
    const newErrors: any = {};

    if (!formData.name.trim()) {
      newErrors.name = '이름을 입력해주세요';
    }

    if (!formData.email.trim()) {
      newErrors.email = '이메일을 입력해주세요';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = '올바른 이메일 형식을 입력해주세요';
    }

    if (formData.newPassword) {
      if (!formData.currentPassword) {
        newErrors.currentPassword = '현재 비밀번호를 입력해주세요';
      }
      if (formData.newPassword.length < 6) {
        newErrors.newPassword = '새 비밀번호는 6자 이상이어야 합니다';
      }
      if (formData.newPassword !== formData.confirmPassword) {
        newErrors.confirmPassword = '비밀번호가 일치하지 않습니다';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (validateForm()) {
      showAlert({
        title: '저장 완료',
        message: '프로필이 성공적으로 수정되었습니다.',
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

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background.primary }]}>
      {/* Header */}
      <View style={[styles.header, { borderBottomColor: colors.background.cardSecondary }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.text.primary} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text.primary }]}>계정 수정</Text>
        <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
          <Text style={[styles.saveButtonText, { color: colors.primary.coral }]}>저장</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {/* Profile Image */}
        <View style={styles.profileSection}>
          <View style={[styles.profileImageContainer, { backgroundColor: colors.background.cardSecondary }]}>
            <Ionicons name="person" size={40} color={colors.text.secondary} />
          </View>
          <TouchableOpacity style={[styles.changePhotoButton, { backgroundColor: colors.primary.coral }]}>
            <Text style={[styles.changePhotoText, { color: colors.text.white }]}>사진 변경</Text>
          </TouchableOpacity>
        </View>

        {/* Form */}
        <View style={styles.formContainer}>
          {/* Name */}
          <View style={styles.inputGroup}>
            <Text style={[styles.inputLabel, { color: colors.text.primary }]}>이름</Text>
            <TextInput
              style={[
                styles.textInput,
                {
                  backgroundColor: colors.background.card,
                  color: colors.text.primary,
                  borderColor: errors.name ? colors.primary.coral : 'transparent'
                }
              ]}
              placeholder="이름을 입력하세요"
              placeholderTextColor={colors.text.secondary}
              value={formData.name}
              onChangeText={(text) => handleInputChange('name', text)}
            />
            {errors.name && (
              <Text style={[styles.errorText, { color: colors.primary.coral }]}>
                {errors.name}
              </Text>
            )}
          </View>

          {/* Email */}
          <View style={styles.inputGroup}>
            <Text style={[styles.inputLabel, { color: colors.text.primary }]}>이메일</Text>
            <TextInput
              style={[
                styles.textInput,
                {
                  backgroundColor: colors.background.card,
                  color: colors.text.primary,
                  borderColor: errors.email ? colors.primary.coral : 'transparent'
                }
              ]}
              placeholder="이메일을 입력하세요"
              placeholderTextColor={colors.text.secondary}
              value={formData.email}
              onChangeText={(text) => handleInputChange('email', text)}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            {errors.email && (
              <Text style={[styles.errorText, { color: colors.primary.coral }]}>
                {errors.email}
              </Text>
            )}
          </View>

          {/* Password Section */}
          <View style={styles.passwordSection}>
            <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>비밀번호 변경</Text>

            <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, { color: colors.text.primary }]}>현재 비밀번호</Text>
              <TextInput
                style={[
                  styles.textInput,
                  {
                    backgroundColor: colors.background.card,
                    color: colors.text.primary,
                    borderColor: errors.currentPassword ? colors.primary.coral : 'transparent'
                  }
                ]}
                placeholder="현재 비밀번호를 입력하세요"
                placeholderTextColor={colors.text.secondary}
                value={formData.currentPassword}
                onChangeText={(text) => handleInputChange('currentPassword', text)}
                secureTextEntry
              />
              {errors.currentPassword && (
                <Text style={[styles.errorText, { color: colors.primary.coral }]}>
                  {errors.currentPassword}
                </Text>
              )}
            </View>

            <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, { color: colors.text.primary }]}>새 비밀번호</Text>
              <TextInput
                style={[
                  styles.textInput,
                  {
                    backgroundColor: colors.background.card,
                    color: colors.text.primary,
                    borderColor: errors.newPassword ? colors.primary.coral : 'transparent'
                  }
                ]}
                placeholder="새 비밀번호를 입력하세요"
                placeholderTextColor={colors.text.secondary}
                value={formData.newPassword}
                onChangeText={(text) => handleInputChange('newPassword', text)}
                secureTextEntry
              />
              {errors.newPassword && (
                <Text style={[styles.errorText, { color: colors.primary.coral }]}>
                  {errors.newPassword}
                </Text>
              )}
            </View>

            <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, { color: colors.text.primary }]}>새 비밀번호 확인</Text>
              <TextInput
                style={[
                  styles.textInput,
                  {
                    backgroundColor: colors.background.card,
                    color: colors.text.primary,
                    borderColor: errors.confirmPassword ? colors.primary.coral : 'transparent'
                  }
                ]}
                placeholder="새 비밀번호를 다시 입력하세요"
                placeholderTextColor={colors.text.secondary}
                value={formData.confirmPassword}
                onChangeText={(text) => handleInputChange('confirmPassword', text)}
                secureTextEntry
              />
              {errors.confirmPassword && (
                <Text style={[styles.errorText, { color: colors.primary.coral }]}>
                  {errors.confirmPassword}
                </Text>
              )}
            </View>
          </View>
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
  saveButton: {
    padding: dimensions.spacing.xs,
  },
  saveButtonText: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.semibold,
    fontFamily: typography.fontFamily.regular,
  },
  scrollContainer: {
    flex: 1,
  },
  profileSection: {
    alignItems: 'center',
    paddingVertical: dimensions.spacing.xl,
  },
  profileImageContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: dimensions.spacing.md,
  },
  changePhotoButton: {
    paddingHorizontal: dimensions.spacing.md,
    paddingVertical: dimensions.spacing.sm,
    borderRadius: dimensions.borderRadius.md,
  },
  changePhotoText: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.medium,
    fontFamily: typography.fontFamily.regular,
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
  errorText: {
    fontSize: typography.sizes.sm,
    marginTop: dimensions.spacing.xs,
    fontFamily: typography.fontFamily.regular,
  },
  passwordSection: {
    marginTop: dimensions.spacing.lg,
    paddingTop: dimensions.spacing.lg,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  sectionTitle: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.semibold,
    marginBottom: dimensions.spacing.lg,
    fontFamily: typography.fontFamily.regular,
  },
});