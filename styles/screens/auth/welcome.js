import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

export const createWelcomeStyles = (colors) => 
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: 20,
    },
    logo: {
      width: width * 0.6,
      height: width * 0.3,
      marginBottom: 30,
    },
    welcomeText: {
      fontSize: 28,
      fontWeight: '700',
      color: colors.textPrimary,
      marginBottom: 8,
      textAlign: 'center',
    },
    subtitle: {
      fontSize: 16,
      color: colors.textSecondary,
      marginBottom: 40,
      textAlign: 'center',
      paddingHorizontal: 20,
    },
    buttonsContainer: {
      width: '100%',
      alignItems: 'center',
      gap: 16,
    },
    loginBtn: {
      backgroundColor: colors.primary,
      paddingVertical: 16,
      paddingHorizontal: 40,
      borderRadius: 12,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 3 },
      shadowOpacity: 0.2,
      shadowRadius: 4,
      elevation: 5,
      width: '90%',
      maxWidth: 320,
    },
    loginText: {
      color: '#fff',
      fontWeight: '600',
      fontSize: 16,
      textAlign: 'center',
    },
    registerBtn: {
      backgroundColor: colors.backgroundSecondary,
      borderWidth: 2,
      borderColor: colors.primary,
      paddingVertical: 16,
      paddingHorizontal: 40,
      borderRadius: 12,
      width: '90%',
      maxWidth: 320,
    },
    registerText: {
      color: colors.primary,
      fontWeight: '600',
      fontSize: 16,
      textAlign: 'center',
    },
  });