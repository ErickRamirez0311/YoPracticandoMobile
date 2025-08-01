// hooks/useDynamicStyles.js
import { useTheme } from '../context/ThemeContext';

export const useDynamicStyles = (stylesFunction) => {
  const { colors, isDarkMode } = useTheme();
  const styles = stylesFunction(colors, isDarkMode);
  return { styles, colors, isDarkMode };
};