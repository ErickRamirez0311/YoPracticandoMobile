import { StyleSheet } from 'react-native';

export const createUserTypeStyles = (colors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    inner: {
      flex: 1,
      justifyContent: 'center',
      paddingHorizontal: 24,
      paddingTop: 60,
    },
    title: {
      fontSize: 28,
      fontWeight: 'bold',
      color: colors.textPrimary,
      textAlign: 'center',
      marginBottom: 32,
    },
    card: {
      backgroundColor: colors.cardBackground,
      padding: 20,
      borderRadius: 16,
      marginBottom: 16,
      borderWidth: 1,
      borderColor: colors.border,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 16,
    },
    icon: {
      marginRight: 12,
    },
    cardText: {
      fontSize: 18,
      fontWeight: '600',
      color: colors.textPrimary,
      flexShrink: 1,
    },
    backButton: {
      position: 'absolute',
      top: 16,
      left: 16,
      zIndex: 10,
      backgroundColor: 'transparent',
      padding: 10,
    },
    backButtonText: {
      fontSize: 28,
      color: colors.primary,
      fontWeight: 'bold',
    },
  });