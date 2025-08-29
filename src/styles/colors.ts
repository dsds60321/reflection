export const colors = {
  primary: {
    coral: '#FF6B6B',
    purple: '#6B5B95',
    yellow: '#F7DC6F',
    peach: '#FFE5CC',
  },
  text: {
    primary: '#2C3E50',
    secondary: '#7F8C8D',
    white: '#FFFFFF',
  },
  background: {
    primary: '#FFF8E1',
    card: '#FFFFFF',
    cardSecondary: '#F8F9FA',
  },
  accent: {
    orange: '#FF8A65',
    lightOrange: '#FFCC80',
  }
};

export const lightColors = {
  primary: {
    coral: '#FF6B6B',
    purple: '#6B5B95',
    yellow: '#F7DC6F',
    peach: '#FFE5CC',
    orange: '#FF8A65',
  },
  text: {
    primary: '#1a1a1a', // 더 진한 검은색으로 변경
    secondary: '#666666', // 더 진한 회색으로 변경
    white: '#FFFFFF',
  },
  background: {
    primary: '#f8f9fa', // 약간 회색빛이 도는 흰색으로 변경
    card: '#FFFFFF',
    cardSecondary: '#e9ecef', // 더 진한 회색으로 변경
    tabBar: '#FFFFFF',
  },
  accent: {
    orange: '#FF8A65',
    lightOrange: '#FFCC80',
  },
  border: '#d6d9dc', // 더 진한 보더 색상으로 변경
};

export const darkColors = {
  primary: {
    coral: '#FF6B6B',
    purple: '#6B5B95',
    yellow: '#F7DC6F',
    peach: '#3A3A3C',
    orange: '#FF8A65',
  },
  text: {
    primary: '#FFFFFF',
    secondary: '#8E8E93',
    white: '#FFFFFF',
  },
  background: {
    primary: '#000000',
    card: '#1C1C1E',
    cardSecondary: '#2C2C2E',
    tabBar: '#1C1C1E',
  },
  accent: {
    orange: '#FF8A65',
    lightOrange: '#FFCC80',
  },
  border: '#38383A',
};

export type ColorScheme = typeof lightColors;
