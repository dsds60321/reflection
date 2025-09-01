import React, { useState, useRef, useEffect } from 'react';
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

export const SignUpScreen: React.FC = () => {
  const colors = useColors();
  const { theme } = useTheme();
  const navigation = useNavigation();
  const { signup } = useAuth();
  const { showAlert } = useAlert();

  // 이메일 인증 단계 상태
  const [step, setStep] = useState<'form' | 'verification'>('form');
  const [verificationTimer, setVerificationTimer] = useState(300); // 5분

  // 폼 상태
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  // 이메일 인증 상태
  const [verificationCode, setVerificationCode] = useState(['', '', '', '', '', '']);
  const [isVerificationLoading, setIsVerificationLoading] = useState(false);
  const [canResendCode, setCanResendCode] = useState(false);

  // UI 상태
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
    terms?: string;
  }>({});

  // TextInput ref 배열 (인증코드용)
  const verificationInputRefs = useRef<TextInput[]>([]);

  // 인증 타이머 효과
  useEffect(() => {
    if (step === 'verification' && verificationTimer > 0) {
      const timer = setTimeout(() => {
        setVerificationTimer(prev => prev - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (verificationTimer === 0) {
      setCanResendCode(true);
    }
  }, [step, verificationTimer]);

  // 타이머 포맷팅
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // 입력값 변경 핸들러
  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // 에러 제거
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  // 인증코드 입력 처리
  const handleVerificationCodeChange = (value: string, index: number) => {
    if (!/^\d*$/.test(value)) return; // 숫자만 허용

    const newCode = [...verificationCode];
    newCode[index] = value;
    setVerificationCode(newCode);

    // 다음 입력칸으로 이동
    if (value && index < 5) {
      verificationInputRefs.current[index + 1]?.focus();
    }
  };

  // 백스페이스 처리
  const handleVerificationKeyPress = (key: string, index: number) => {
    if (key === 'Backspace' && !verificationCode[index] && index > 0) {
      verificationInputRefs.current[index - 1]?.focus();
    }
  };

  // 유효성 검사
  const validateForm = () => {
    const newErrors: typeof errors = {};

    if (!formData.name.trim()) {
      newErrors.name = '이름을 입력해주세요';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = '이름은 2자 이상이어야 합니다';
    }

    if (!formData.email.trim()) {
      newErrors.email = '이메일을 입력해주세요';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = '올바른 이메일 형식을 입력해주세요';
    }

    if (!formData.password.trim()) {
      newErrors.password = '비밀번호를 입력해주세요';
    } else if (formData.password.length < 6) {
      newErrors.password = '비밀번호는 6자 이상이어야 합니다';
    } else if (!/(?=.*[a-zA-Z])(?=.*[0-9])/.test(formData.password)) {
      newErrors.password = '비밀번호는 영문과 숫자를 포함해야 합니다';
    }

    if (!formData.confirmPassword.trim()) {
      newErrors.confirmPassword = '비밀번호 확인을 입력해주세요';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = '비밀번호가 일치하지 않습니다';
    }

    if (!agreeTerms) {
      newErrors.terms = '이용약관에 동의해주세요';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // 이메일 인증 코드 전송
  const handleSendVerificationCode = async () => {
    if (!validateForm()) return;

    setIsLoading(true);

    try {
      // API 호출 시뮬레이션 - 인증코드 전송
      await new Promise(resolve => setTimeout(resolve, 2000));

      // 이메일 중복 체크 시뮬레이션
      if (formData.email === 'existing@example.com') {
        showAlert({
          title: '회원가입 실패',
          message: '이미 사용 중인 이메일입니다.',
          icon: 'alert-circle',
          iconColor: colors.primary.coral,
          buttons: [{ text: '확인' }],
        });
        return;
      }

      showAlert({
        title: '인증코드 전송',
        message: `${formData.email}로 인증코드를 전송했습니다.`,
        icon: 'check-circle',
        iconColor: colors.primary.coral,
        buttons: [{ text: '확인' }],
      });

      // 인증 단계로 이동
      setStep('verification');
      setVerificationTimer(300);
      setCanResendCode(false);

      // 첫 번째 입력칸에 포커스
      setTimeout(() => {
        verificationInputRefs.current[0]?.focus();
      }, 100);

    } catch (error) {
      showAlert({
        title: '오류 발생',
        message: '인증코드 전송 중 오류가 발생했습니다. 다시 시도해주세요.',
        icon: 'alert-circle',
        iconColor: colors.primary.coral,
        buttons: [{ text: '확인' }],
      });
    } finally {
      setIsLoading(false);
    }
  };

  // 인증코드 확인 및 회원가입 완료
  const handleVerifyAndSignUp = async () => {
    const code = verificationCode.join('');
    if (code.length !== 6) {
      showAlert({
        title: '인증코드 오류',
        message: '6자리 인증코드를 모두 입력해주세요.',
        icon: 'alert-circle',
        iconColor: colors.primary.coral,
        buttons: [{ text: '확인' }],
      });
      return;
    }

    setIsVerificationLoading(true);

    try {
      // API 호출 시뮬레이션 - 인증코드 확인 및 회원가입
      await new Promise(resolve => setTimeout(resolve, 2000));

      // 테스트용 인증코드: 123456
      if (code === '123456') {
        const result = await signup(formData.name, formData.email, formData.password);

        if (result.success) {
          showAlert({
            title: '회원가입 완료',
            message: '이메일 인증이 완료되어 회원가입이 성공했습니다!',
            icon: 'check-circle',
            iconColor: colors.primary.coral,
            buttons: [{ text: '확인' }],
          });
          // AuthContext에서 자동으로 인증 상태가 변경되어 메인 화면으로 이동됨
        } else {
          showAlert({
            title: '회원가입 실패',
            message: result.message,
            icon: 'alert-circle',
            iconColor: colors.primary.coral,
            buttons: [{ text: '확인' }],
          });
        }
      } else {
        showAlert({
          title: '인증 실패',
          message: '인증코드가 올바르지 않습니다. 다시 확인해주세요.',
          icon: 'alert-circle',
          iconColor: colors.primary.coral,
          buttons: [{ text: '확인' }],
        });
        // 입력칸 초기화
        setVerificationCode(['', '', '', '', '', '']);
        verificationInputRefs.current[0]?.focus();
      }
    } catch (error) {
      showAlert({
        title: '오류 발생',
        message: '인증 중 오류가 발생했습니다. 다시 시도해주세요.',
        icon: 'alert-circle',
        iconColor: colors.primary.coral,
        buttons: [{ text: '확인' }],
      });
    } finally {
      setIsVerificationLoading(false);
    }
  };

  // 인증코드 재전송
  const handleResendCode = async () => {
    if (!canResendCode) return;

    setIsLoading(true);

    try {
      // API 호출 시뮬레이션
      await new Promise(resolve => setTimeout(resolve, 1500));

      showAlert({
        title: '인증코드 재전송',
        message: '새로운 인증코드가 전송되었습니다.',
        icon: 'check-circle',
        iconColor: colors.primary.coral,
        buttons: [{ text: '확인' }],
      });

      // 타이머 재설정
      setVerificationTimer(300);
      setCanResendCode(false);
      setVerificationCode(['', '', '', '', '', '']);
      verificationInputRefs.current[0]?.focus();

    } catch (error) {
      showAlert({
        title: '재전송 실패',
        message: '인증코드 재전송 중 오류가 발생했습니다.',
        icon: 'alert-circle',
        iconColor: colors.primary.coral,
        buttons: [{ text: '확인' }],
      });
    } finally {
      setIsLoading(false);
    }
  };

  // 이전 단계로 돌아가기
  const handleGoBack = () => {
    if (step === 'verification') {
      setStep('form');
      setVerificationCode(['', '', '', '', '', '']);
      setVerificationTimer(300);
      setCanResendCode(false);
    } else {
      navigation.goBack();
    }
  };

  const isCodeComplete = verificationCode.every(digit => digit !== '');

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background.primary }]}>
      <StatusBar
        barStyle={theme === 'dark' ? 'light-content' : 'dark-content'}
        backgroundColor={colors.background.primary}
      />

      {/* 헤더 */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={handleGoBack}
          style={styles.backButton}
          disabled={isLoading || isVerificationLoading}
        >
          <Ionicons name="arrow-back" size={24} color={colors.text.primary} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text.primary }]}>
          {step === 'form' ? '회원가입' : '이메일 인증'}
        </Text>
        <View style={styles.headerRight} />
      </View>

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
              {step === 'form' ? (
                <View style={styles.logoIcons}>
                  <Image
                    source={require("../assets/images/devil.png")}
                    style={[styles.logoIcon, styles.leftIcon]}
                  />
                  <Image
                    source={require("../assets/images/angel.png")}
                    style={[styles.logoIcon, styles.rightIcon]}
                  />
                </View>
              ) : (
                <MaterialCommunityIcons
                  name="email-check-outline"
                  size={32}
                  color={colors.text.primary}
                />
              )}
            </View>
            <Text style={[styles.welcomeText, { color: colors.text.primary }]}>
              {step === 'form' ? '반성문과 함께' : '이메일을 확인해주세요'}
            </Text>
            <Text style={[styles.welcomeSubtext, { color: colors.text.secondary }]}>
              {step === 'form'
                ? '더 나은 나를 만나보세요'
                : `${formData.email}로 전송된\n6자리 인증코드를 입력해주세요`}
            </Text>
          </View>

          {step === 'form' ? (
            // 회원가입 폼
            <View style={styles.formSection}>
              {/* 이름 입력 */}
              <View style={styles.inputGroup}>
                <Text style={[styles.inputLabel, { color: colors.text.primary }]}>
                  이름 <Text style={{ color: colors.primary.coral }}>*</Text>
                </Text>
                <View style={[
                  styles.inputContainer,
                  {
                    backgroundColor: colors.background.card,
                    borderColor: errors.name ? colors.primary.coral : 'transparent',
                  }
                ]}>
                  <MaterialCommunityIcons
                    name="account-outline"
                    size={20}
                    color={colors.text.secondary}
                    style={styles.inputIcon}
                  />
                  <TextInput
                    style={[styles.textInput, { color: colors.text.primary }]}
                    placeholder="이름을 입력하세요"
                    placeholderTextColor={colors.text.secondary}
                    value={formData.name}
                    onChangeText={(text) => handleInputChange('name', text)}
                    autoCapitalize="words"
                    autoCorrect={false}
                    editable={!isLoading}
                  />
                </View>
                {errors.name && (
                  <Text style={[styles.errorText, { color: colors.primary.coral }]}>
                    {errors.name}
                  </Text>
                )}
              </View>

              {/* 이메일 입력 */}
              <View style={styles.inputGroup}>
                <Text style={[styles.inputLabel, { color: colors.text.primary }]}>
                  이메일 <Text style={{ color: colors.primary.coral }}>*</Text>
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
                  비밀번호 <Text style={{ color: colors.primary.coral }}>*</Text>
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
                <Text style={[styles.passwordHint, { color: colors.text.secondary }]}>
                  영문, 숫자 포함 6자 이상
                </Text>
                {errors.password && (
                  <Text style={[styles.errorText, { color: colors.primary.coral }]}>
                    {errors.password}
                  </Text>
                )}
              </View>

              {/* 비밀번호 확인 입력 */}
              <View style={styles.inputGroup}>
                <Text style={[styles.inputLabel, { color: colors.text.primary }]}>
                  비밀번호 확인 <Text style={{ color: colors.primary.coral }}>*</Text>
                </Text>
                <View style={[
                  styles.inputContainer,
                  {
                    backgroundColor: colors.background.card,
                    borderColor: errors.confirmPassword ? colors.primary.coral : 'transparent',
                  }
                ]}>
                  <MaterialCommunityIcons
                    name="lock-check-outline"
                    size={20}
                    color={colors.text.secondary}
                    style={styles.inputIcon}
                  />
                  <TextInput
                    style={[styles.textInput, { color: colors.text.primary }]}
                    placeholder="비밀번호를 다시 입력하세요"
                    placeholderTextColor={colors.text.secondary}
                    value={formData.confirmPassword}
                    onChangeText={(text) => handleInputChange('confirmPassword', text)}
                    secureTextEntry={!showConfirmPassword}
                    autoCapitalize="none"
                    autoCorrect={false}
                    editable={!isLoading}
                  />
                  <TouchableOpacity
                    onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                    style={styles.passwordToggle}
                    disabled={isLoading}
                  >
                    <Ionicons
                      name={showConfirmPassword ? "eye-off-outline" : "eye-outline"}
                      size={20}
                      color={colors.text.secondary}
                    />
                  </TouchableOpacity>
                </View>
                {errors.confirmPassword && (
                  <Text style={[styles.errorText, { color: colors.primary.coral }]}>
                    {errors.confirmPassword}
                  </Text>
                )}
              </View>

              {/* 이용약관 동의 */}
              <View style={styles.termsSection}>
                <TouchableOpacity
                  style={styles.termsContainer}
                  onPress={() => {
                    setAgreeTerms(!agreeTerms);
                    if (errors.terms) {
                      setErrors(prev => ({ ...prev, terms: undefined }));
                    }
                  }}
                  disabled={isLoading}
                >
                  <View style={[
                    styles.checkbox,
                    {
                      backgroundColor: agreeTerms ? colors.primary.coral : 'transparent',
                      borderColor: errors.terms ? colors.primary.coral : colors.text.secondary,
                    }
                  ]}>
                    {agreeTerms && (
                      <Ionicons name="checkmark" size={16} color={colors.text.white} />
                    )}
                  </View>
                  <Text style={[styles.termsText, { color: colors.text.primary }]}>
                    이용약관 및 개인정보처리방침에 동의합니다
                  </Text>
                </TouchableOpacity>
                {errors.terms && (
                  <Text style={[styles.errorText, { color: colors.primary.coral }]}>
                    {errors.terms}
                  </Text>
                )}
              </View>

              {/* 인증코드 전송 버튼 */}
              <TouchableOpacity
                style={[
                  styles.signUpButton,
                  { backgroundColor: colors.primary.coral },
                  isLoading && styles.disabledButton
                ]}
                onPress={handleSendVerificationCode}
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
                    <Text style={[styles.signUpButtonText, { color: colors.text.white }]}>
                      전송 중...
                    </Text>
                  </View>
                ) : (
                  <Text style={[styles.signUpButtonText, { color: colors.text.white }]}>
                    인증코드 전송
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          ) : (
            // 이메일 인증 폼
            <View style={styles.formSection}>
              {/* 인증코드 입력 */}
              <View style={styles.verificationSection}>
                <View style={styles.verificationCodeContainer}>
                  {verificationCode.map((digit, index) => (
                    <TextInput
                      key={index}
                      ref={ref => {
                        if (ref) verificationInputRefs.current[index] = ref;
                      }}
                      style={[
                        styles.verificationInput,
                        {
                          backgroundColor: colors.background.card,
                          borderColor: digit ? colors.primary.coral : colors.border,
                          color: colors.text.primary,
                        }
                      ]}
                      value={digit}
                      onChangeText={(value) => handleVerificationCodeChange(value, index)}
                      onKeyPress={({ nativeEvent }) => handleVerificationKeyPress(nativeEvent.key, index)}
                      keyboardType="numeric"
                      maxLength={1}
                      textAlign="center"
                      editable={!isVerificationLoading}
                    />
                  ))}
                </View>

                {/* 타이머 */}
                <View style={styles.timerContainer}>
                  <MaterialCommunityIcons
                    name="timer-outline"
                    size={16}
                    color={verificationTimer > 60 ? colors.text.secondary : colors.primary.coral}
                  />
                  <Text style={[
                    styles.timerText,
                    {
                      color: verificationTimer > 60 ? colors.text.secondary : colors.primary.coral
                    }
                  ]}>
                    남은 시간: {formatTime(verificationTimer)}
                  </Text>
                </View>

                {/* 인증 확인 버튼 */}
                <TouchableOpacity
                  style={[
                    styles.signUpButton,
                    {
                      backgroundColor: isCodeComplete && !isVerificationLoading
                        ? colors.primary.coral
                        : colors.background.card
                    }
                  ]}
                  onPress={handleVerifyAndSignUp}
                  disabled={!isCodeComplete || isVerificationLoading}
                >
                  {isVerificationLoading ? (
                    <View style={styles.loadingContainer}>
                      <MaterialCommunityIcons
                        name="loading"
                        size={20}
                        color={colors.text.white}
                        style={styles.loadingIcon}
                      />
                      <Text style={[styles.signUpButtonText, { color: colors.text.white }]}>
                        인증 중...
                      </Text>
                    </View>
                  ) : (
                    <Text style={[
                      styles.signUpButtonText,
                      {
                        color: isCodeComplete
                          ? colors.text.white
                          : colors.text.secondary
                      }
                    ]}>
                      인증 확인 및 가입완료
                    </Text>
                  )}
                </TouchableOpacity>

                {/* 재전송 버튼 */}
                <TouchableOpacity
                  style={styles.resendButton}
                  onPress={handleResendCode}
                  disabled={!canResendCode || isLoading}
                >
                  {isLoading ? (
                    <View style={styles.resendLoadingContainer}>
                      <MaterialCommunityIcons
                        name="loading"
                        size={16}
                        color={colors.primary.coral}
                        style={styles.resendLoadingIcon}
                      />
                      <Text style={[styles.resendButtonText, { color: colors.primary.coral }]}>
                        전송 중...
                      </Text>
                    </View>
                  ) : (
                    <Text style={[
                      styles.resendButtonText,
                      {
                        color: canResendCode
                          ? colors.primary.coral
                          : colors.text.secondary
                      }
                    ]}>
                      인증코드 재전송
                    </Text>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          )}

          {/* 로그인 이동 섹션 */}
          {step === 'form' && (
            <View style={styles.loginSection}>
              <Text style={[styles.loginPrompt, { color: colors.text.secondary }]}>
                이미 계정이 있으신가요?
              </Text>
              <TouchableOpacity
                onPress={() => navigation.goBack()}
                disabled={isLoading}
              >
                <Text style={[styles.loginLink, { color: colors.primary.coral }]}>
                  로그인
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
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
    fontWeight: typography.weights.semibold,
    fontFamily: typography.fontFamily.regular,
  },
  headerRight: {
    width: 40,
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
    paddingTop: dimensions.spacing.lg,
    paddingBottom: dimensions.spacing.xl,
  },
  logoContainer: {
    width: 70,
    height: 70,
    borderRadius: 35,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: dimensions.spacing.md,
  },
  logoIcons: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoIcon: {
    width: 24,
    height: 24,
  },
  leftIcon: {
    marginRight: 3,
  },
  rightIcon: {
    marginLeft: 3,
  },
  welcomeText: {
    fontSize: typography.sizes.xl,
    fontWeight: typography.weights.bold,
    fontFamily: typography.fontFamily.regular,
    marginBottom: dimensions.spacing.xs,
  },
  welcomeSubtext: {
    fontSize: typography.sizes.md,
    fontFamily: typography.fontFamily.regular,
    textAlign: 'center',
    lineHeight: 22,
  },

  // 폼 섹션
  formSection: {
    marginBottom: dimensions.spacing.lg,
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
  passwordHint: {
    fontSize: typography.sizes.sm,
    fontFamily: typography.fontFamily.regular,
    marginTop: dimensions.spacing.xs,
  },
  errorText: {
    fontSize: typography.sizes.sm,
    fontFamily: typography.fontFamily.regular,
    marginTop: dimensions.spacing.xs,
  },

  // 이용약관
  termsSection: {
    marginBottom: dimensions.spacing.xl,
  },
  termsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: dimensions.spacing.sm,
  },
  termsText: {
    flex: 1,
    fontSize: typography.sizes.md,
    fontFamily: typography.fontFamily.regular,
  },

  // 인증 섹션
  verificationSection: {
    alignItems: 'center',
  },
  verificationCodeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    maxWidth: 300,
    marginBottom: dimensions.spacing.lg,
  },
  verificationInput: {
    width: 45,
    height: 55,
    borderRadius: dimensions.borderRadius.lg,
    borderWidth: 2,
    fontSize: typography.sizes.xl,
    fontWeight: typography.weights.bold,
    fontFamily: typography.fontFamily.regular,
  },
  timerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: dimensions.spacing.xl,
  },
  timerText: {
    fontSize: typography.sizes.md,
    fontFamily: typography.fontFamily.regular,
    marginLeft: dimensions.spacing.xs,
  },
  resendButton: {
    alignItems: 'center',
    paddingVertical: dimensions.spacing.md,
    marginTop: dimensions.spacing.md,
  },
  resendButtonText: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.medium,
    fontFamily: typography.fontFamily.regular,
  },
  resendLoadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  resendLoadingIcon: {
    marginRight: dimensions.spacing.xs,
  },

  // 버튼
  signUpButton: {
    paddingVertical: dimensions.spacing.md,
    borderRadius: dimensions.borderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 50,
    width: '100%',
  },
  disabledButton: {
    opacity: 0.7,
  },
  signUpButtonText: {
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

  // 로그인 섹션
  loginSection: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: dimensions.spacing.xs,
    marginTop: dimensions.spacing.lg,
  },
  loginPrompt: {
    fontSize: typography.sizes.md,
    fontFamily: typography.fontFamily.regular,
  },
  loginLink: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.semibold,
    fontFamily: typography.fontFamily.regular,
  },
});