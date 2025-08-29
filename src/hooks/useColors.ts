import { useTheme } from '../context/ThemeContext';
import { lightColors, darkColors, ColorScheme } from '../styles/colors';

export const useColors = (): ColorScheme => {
  const { theme } = useTheme();
  return theme === 'light' ? lightColors : darkColors;
};