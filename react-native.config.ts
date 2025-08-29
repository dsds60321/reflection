// CommonJS 모듈 형식으로 내보내기
// @ts-ignore

export = {
  dependencies: {
    'react-native-vector-icons': {
      platforms: {
        ios: {
          icons: null, // iOS에서는 자동으로 폰트를 복사하지 않도록 설정
        },
      },
    },
  },
};