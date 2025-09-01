import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  StatusBar,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
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
import { useAuth } from '../context/AuthContext.tsx';

export const LoginScreen: React.FC = () => {
  const colors = useColors();
  const { theme } = useTheme();
  const navigation = useNavigation();
  const { login } = useAuth();
  const { showAlert } = useAlert();


  // 폼 상태
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  // UI 상태
  // UI 상태
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
  }>({});


  // 입력값 변경 핸들러
  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // 에러 제거
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  // 유효성 검사
  const validateForm = () => {
    const newErrors: typeof errors = {};

    if (!formData.email.trim()) {
      newErrors.email = '이메일을 입력해주세요';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = '올바른 이메일 형식을 입력해주세요';
    }

    if (!formData.password.trim()) {
      newErrors.password = '비밀번호를 입력해주세요';
    } else if (formData.password.length < 6) {
      newErrors.password = '비밀번호는 6자 이상이어야 합니다';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // 로그인 핸들러
  const handleLogin = async () => {
    if (!validateForm()) return;

    setIsLoading(true);

    try {
      const result = await login(formData.email, formData.password);

      if (result.success) {
        showAlert({
          title: '로그인 성공',
          message: '환영합니다!',
          icon: 'check-circle',
          iconColor: colors.primary.coral,
          buttons: [{ text: '확인' }],
        });
        // AuthContext에서 자동으로 인증 상태가 변경되어 메인 화면으로 이동됨
      } else {
        showAlert({
          title: '로그인 실패',
          message: result.message,
          icon: 'alert-circle',
          iconColor: colors.primary.coral,
          buttons: [{ text: '확인' }],
        });
      }
    } catch (error) {
      showAlert({
        title: '오류 발생',
        message: '로그인 중 오류가 발생했습니다. 다시 시도해주세요.',
        icon: 'alert-circle',
        iconColor: colors.primary.coral,
        buttons: [{ text: '확인' }],
      });
    } finally {
      setIsLoading(false);
    }
  };

  // 회원가입 화면 이동
  const handleSignUp = () => {
    navigation.navigate('SignUp');
  };

  // 비밀번호 찾기
  const handleForgotPassword = () => {
    showAlert({
      title: '비밀번호 찾기',
      message: '등록된 이메일로 비밀번호 재설정 링크를 보내드릴까요?',
      icon: 'mail',
      iconColor: colors.primary.coral,
      buttons: [
        { text: '취소', style: 'cancel' },
        {
          text: '전송',
          onPress: () => {
            showAlert({
              title: '이메일 전송 완료',
              message: '비밀번호 재설정 링크를 이메일로 보내드렸습니다.',
              icon: 'check-circle',
              iconColor: colors.primary.coral,
              buttons: [{ text: '확인' }],
            });
          },
        },
      ],
    });
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background.primary }]}>
      <StatusBar
        barStyle={theme === 'dark' ? 'light-content' : 'dark-content'}
        backgroundColor={colors.background.primary}
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* 로고 섹션 */}
          <View style={styles.logoSection}>
            <View style={[styles.logoContainer, { backgroundColor: colors.primary.yellow }]}>
              <View style={styles.logoIcons}>
                <Image
                  source={require("../assets/images/post.png")}
                  style={[styles.logoIcon]}
                />
              </View>
            </View>
            <Text style={[styles.appTitle, { color: colors.text.primary }]}>
              반성문
            </Text>
            <Text style={[styles.appSubtitle, { color: colors.text.secondary }]}>
              더 나은 나를 위한 성찰의 시간
            </Text>
          </View>

          {/* 로그인 폼 */}
          <View style={styles.formSection}>
            {/* 이메일 입력 */}
            <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, { color: colors.text.primary }]}>
                이메일
              </Text>
              <View style={[
                styles.inputContainer,
                {
                  backgroundColor: colors.background.card,
                  borderColor: errors.email ? colors.primary.coral : 'transparent',
                }
              ]}>
                <MaterialCommunityIcons
                  name="email-outline"
                  size={20}
                  color={colors.text.secondary}
                  style={styles.inputIcon}
                />
                <TextInput
                  style={[styles.textInput, { color: colors.text.primary }]}
                  placeholder="이메일을 입력하세요"
                  placeholderTextColor={colors.text.secondary}
                  value={formData.email}
                  onChangeText={(text) => handleInputChange('email', text)}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  editable={!isLoading}
                />
              </View>
              {errors.email && (
                <Text style={[styles.errorText, { color: colors.primary.coral }]}>
                  {errors.email}
                </Text>
              )}
            </View>

            {/* 비밀번호 입력 */}
            <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, { color: colors.text.primary }]}>
                비밀번호
              </Text>
              <View style={[
                styles.inputContainer,
                {
                  backgroundColor: colors.background.card,
                  borderColor: errors.password ? colors.primary.coral : 'transparent',
                }
              ]}>
                <MaterialCommunityIcons
                  name="lock-outline"
                  size={20}
                  color={colors.text.secondary}
                  style={styles.inputIcon}
                />
                <TextInput
                  style={[styles.textInput, { color: colors.text.primary }]}
                  placeholder="비밀번호를 입력하세요"
                  placeholderTextColor={colors.text.secondary}
                  value={formData.password}
                  onChangeText={(text) => handleInputChange('password', text)}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                  autoCorrect={false}
                  editable={!isLoading}
                />
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                  style={styles.passwordToggle}
                  disabled={isLoading}
                >
                  <Ionicons
                    name={showPassword ? "eye-off-outline" : "eye-outline"}
                    size={20}
                    color={colors.text.secondary}
                  />
                </TouchableOpacity>
              </View>
              {errors.password && (
                <Text style={[styles.errorText, { color: colors.primary.coral }]}>
                  {errors.password}
                </Text>
              )}
            </View>

            {/* 비밀번호 찾기 */}
            <TouchableOpacity
              style={styles.forgotPassword}
              onPress={handleForgotPassword}
              disabled={isLoading}
            >
              <Text style={[styles.forgotPasswordText, { color: colors.text.secondary }]}>
                비밀번호를 잊으셨나요?
              </Text>
            </TouchableOpacity>

            {/* 로그인 버튼 */}
            <TouchableOpacity
              style={[
                styles.loginButton,
                { backgroundColor: colors.primary.coral },
                isLoading && styles.disabledButton
              ]}
              onPress={handleLogin}
              disabled={isLoading}
            >
              {isLoading ? (
                <View style={styles.loadingContainer}>
                  <MaterialCommunityIcons
                    name="loading"
                    size={20}
                    color={colors.text.white}
                    style={styles.loadingIcon}
                  />
                  <Text style={[styles.loginButtonText, { color: colors.text.white }]}>
                    로그인 중...
                  </Text>
                </View>
              ) : (
                <Text style={[styles.loginButtonText, { color: colors.text.white }]}>
                  로그인
                </Text>
              )}
            </TouchableOpacity>
          </View>

          {/* 회원가입 섹션 */}
          <View style={styles.signUpSection}>
            <Text style={[styles.signUpPrompt, { color: colors.text.secondary }]}>
              아직 계정이 없으신가요?
            </Text>
            <TouchableOpacity
              onPress={handleSignUp}
              disabled={isLoading}
            >
              <Text style={[styles.signUpLink, { color: colors.primary.coral }]}>
                회원가입
              </Text>
            </TouchableOpacity>
          </View>

          {/* 테스트 계정 안내 */}
          <View style={[styles.testAccountInfo, { backgroundColor: colors.background.card }]}>
            <MaterialCommunityIcons
              name="information-outline"
              size={16}
              color={colors.text.secondary}
            />
            <Text style={[styles.testAccountText, { color: colors.text.secondary }]}>
              테스트 계정: user@example.com / 123456
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: dimensions.spacing.lg,
    paddingBottom: dimensions.spacing.xl,
  },

  // 로고 섹션
  logoSection: {
    alignItems: 'center',
    paddingTop: dimensions.spacing.xxl,
    paddingBottom: dimensions.spacing.xl,
  },
  logoContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: dimensions.spacing.lg,
    position: 'relative',
  },
  logoIcons: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoIcon: {
    width: 80,
    height: 80,
  },
  leftIcon: {
    marginRight: 4,
  },
  rightIcon: {
    marginLeft: 4,
  },
  appTitle: {
    fontSize: typography.sizes.xxl,
    fontWeight: typography.weights.bold,
    fontFamily: typography.fontFamily.regular,
    marginBottom: dimensions.spacing.xs,
  },
  appSubtitle: {
    fontSize: typography.sizes.md,
    fontFamily: typography.fontFamily.regular,
    textAlign: 'center',
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
    fontWeight: typography.weights.medium,
    fontFamily: typography.fontFamily.regular,
    marginBottom: dimensions.spacing.sm,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: dimensions.spacing.md,
    paddingVertical: dimensions.spacing.sm,
    borderRadius: dimensions.borderRadius.lg,
    borderWidth: 1,
  },
  inputIcon: {
    marginRight: dimensions.spacing.sm,
  },
  textInput: {
    flex: 1,
    fontSize: typography.sizes.md,
    fontFamily: typography.fontFamily.regular,
    paddingVertical: dimensions.spacing.xs,
  },
  passwordToggle: {
    padding: dimensions.spacing.xs,
    marginLeft: dimensions.spacing.sm,
  },
  errorText: {
    fontSize: typography.sizes.sm,
    fontFamily: typography.fontFamily.regular,
    marginTop: dimensions.spacing.xs,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: dimensions.spacing.xl,
  },
  forgotPasswordText: {
    fontSize: typography.sizes.sm,
    fontFamily: typography.fontFamily.regular,
  },
  loginButton: {
    paddingVertical: dimensions.spacing.md,
    borderRadius: dimensions.borderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 50,
  },
  disabledButton: {
    opacity: 0.7,
  },
  loginButtonText: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.semibold,
    fontFamily: typography.fontFamily.regular,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  loadingIcon: {
    marginRight: dimensions.spacing.sm,
  },

  // 회원가입 섹션
  signUpSection: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: dimensions.spacing.xs,
    marginBottom: dimensions.spacing.lg,
  },
  signUpPrompt: {
    fontSize: typography.sizes.md,
    fontFamily: typography.fontFamily.regular,
  },
  signUpLink: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.semibold,
    fontFamily: typography.fontFamily.regular,
  },

  // 테스트 계정 안내
  testAccountInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: dimensions.spacing.md,
    paddingVertical: dimensions.spacing.sm,
    borderRadius: dimensions.borderRadius.md,
    gap: dimensions.spacing.sm,
  },
  testAccountText: {
    fontSize: typography.sizes.sm,
    fontFamily: typography.fontFamily.regular,
  },
});