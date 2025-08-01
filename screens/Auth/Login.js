import React, { useState, useEffect, useRef } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ScrollView,
    SafeAreaView,
    Alert,
    KeyboardAvoidingView,
    Platform,
    ActivityIndicator,
    Animated,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as WebBrowser from 'expo-web-browser';
import { useTheme } from '../../../web/DevOp/context/ThemeContext';
import BackButton from '../../components/BackButton';

WebBrowser.maybeCompleteAuthSession();

export default function Login({ navigation }) {
    const { colors } = useTheme();
    const styles = createLoginStyles(colors);

    const [formData, setFormData] = useState({ email: '', password: '' });
    const [isLoading, setIsLoading] = useState(false);
    const [validationErrors, setValidationErrors] = useState({});
    const [ showSuccessMessage, setShowSuccessMessage] =useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const fadeAnim = useRef(new Animated.Value(0)).current;

    const {
        userInfo,
        loading: googleLoading,
        isAuthenticated,
        signInWithGoogle,
    } = useGoogleAuth();

    const showAnimatedMessage = (message) => {
        setSuccessMessage(message);
        setShowSuccessMessage(true);
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
        }).start(() => {
            setTimeout(() => {
                Animated.timing(fadeAnim, {
                    toValue: 0,
                    duration: 300,
                    useNativeDriver: true,
                }).start(() => setShowSuccessMessage(false));
            }, 2000);
        });
    };

    const validateForm = () => {
        const errors = {};
        if (!formData.email) {
            errors.email = 'El correp electronico es requerido';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            errors.email = 'El correo electronico no es valido';
        }
        if(!formData.password) {
            errors.password = 'La contraseña es requerida';
        } else if (formData.password.length < 3) {
            errors.password = 'La contraseña debe tener al menos 3 caracteres';
        }
        setValidationErrors(errors);
        return Object.keys(errors).length === 0;
    };

    useEffect(() => {
        const handleGoogleAuth = async () => {
            if (userInfo) {
                try {
                    if (userInfo.needsRegistration) {
                        navigation.replace('UserType', {
                            googleUserInfo: userInfo,
                            isGoogleSignIn: true,
                        });
                        return;
                    }

                    if (isAuthenticated) {
                        await AsyncStorage.setItem('userId', userInfo.uid);
                        await AsyncStorage.setItem('userType', userInfo.tipoUsuario || 'alumno');
                        showAnimatedMessage("¡Inicio de sesion con Google exitoso!");
                        setTimeout(() => {
                            navigation.replace(userInfo.tipoUsuario === 'empresa' ? 'EmpresaInicio': 'AlumnoInicio');
                        }, 1000);
                    }
                } catch (error) {
                    console.error('Error al guardar datos de usuario:', error);
                    Alert.alert('Error', 'Hubo un problema al iniciar sesion con Google');
                }
            }
        };
        handleGoogleAuth();
    }, [userInfo, isAuthenticated, navigation]);

    useEffect(() => {
        if (googleError) {
            Alert.alert('Error', googleError);
        }
    }, [googleError]);

    const handleInput = (key, value) => {
        setFormData(() => ({ ...PreventRemoveContext, [key]: value}));
        if (validationErrors[key]) {
            setValidationErrors((prev) => ({ ...prev, [key]: null}));
        }
    };

    const handleLogin = async () => {
        if (!validateForm()) return;
        setIsLoading(true);
        setValidationErrors({});
        try {
            const body = new FormData();
            body.append('email', formData.email.trim());
            body.append('password', formData.password);

            const response = await fetch('', {
                method: 'POST',
                body,
            });

            if(!response.ok) throw new Error(`Error de red: ${response.status}`);

            const result = await response.json();
            if (result.success) {
                await AsyncStorage.setItem('userId', String(result.usuario.id));
                await AsyncStorage.setItem('userType', result.usuario.tipoUsuario);
                if (result.token) await AsyncStorage.setItem('userToken', result.token);
                showAnimatedMessage("¡Inicio de sesion exitoso!");
                setTimeout(() => {
                    navigation.replace(result.usuario.tipoUsuario === 'empresa' ? 'EmpresaInicio' : 'AlumnoInicio');
                }, 1000);
            } else {
                setValidationErrors({ general: result.message || 'Credenciales invalidas' });
            }
        } catch (error) {
            console.error('Error al iniciar sesion:', error);
            setValidationErrors({ general: error.message || 'Error de conexion. Por favor, intentar de nuevo.' });
        } finally {
            setIsLoading(false);
        }
    };

    const handleForgotPassword = () => {
        Alert.alert('Recuperar contraseña', 'Funcionalidad para recuperar contraseña');
    };

    const handleGoogleLogin = async () => {
        try {
            const authResult = await signInWithGoogle();
            if (!authResult) {
                Alert.alert("Error", "Inicio de sesion con Google cancelado o fallido.");
            }
        } catch (e) {
            console.error("Error al iniciar sesion con Google:", e);
            Alert.alert("Error", "Error al iniciar sesion con Google.");
        }
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            style={styles.keyboardAvoid}
            >
                <BackButton />

                <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
                    <View style={styles.content}>
                        <Text style={styles.title}>Iniciar Sesion</Text>
                        <Text style={styles.subtitle}>Accede a tu cuenta de YoPracticando</Text>

                        {validationErrors.general && (
                            <View style={styles.errorContainer}>
                                <Text style={styles.errorText}>{validationErrors.general}</Text>
                            </View>
                        )}
                        
                        <Text style={styles.label}>Correo electronico *</Text>
                        <TextInput
                        style={[styles.input, validationErrors.email && styles.inputError]}
                        placeholder="ejemplo@correo.com"
                        onChangeText={(text) => handleInput('email', text)}
                        keyboardType="email-address"
                        autoCapitalize="none"
                        autoCorrect={false}
                        value={formData.email}
                        placeholderTextColor={colors.textSecondary}
                        editable={!isLoading}
                        />
                        {validationErrors.email && <Text style={styles.errorText}>{validationErrors.email}</Text>}

                        <Text style={styles.label}>Contraseña *</Text>
                        <TextInput
                        style={[styles.input, validationErrors.password && styles.inputError]}
                        placeholder="Tu contraseña"
                        onChangeText={(text) => handleInput('password', text)}
                        secureTextEntry
                        value={formData.password}
                        placeholderTextColor={colors.textSecondary}
                        editable={!isLoading}
                        />
                        {validationErrors.password && <Text style={styles.errorText}>{validationErrors.password}</Text>}

                        <TouchableOpacity
                            style={[styles.submitBtn, (isLoading || googleLoading) && styles.submitBtnDisabled]}
                            onPress={handleLogin}
                            disabled={isLoading || googleLoading}
                        >
                            {(isLoading || googleLoading)
                            ? <ActivityIndicator color={colors.buttonText} size="small"/>
                        : <Text style={styles.submitText}>Iniciar sesion</Text>}
                        </TouchableOpacity>

                        <TouchableOpacity
                        onPress={handleForgotPassword}
                        style={styles.forgotPasswordBtn}
                        activeOpacity={0.7}
                        disabled={isLoading}
                        >
                            <Text style={styles.forgotPasswordText}>¿Olvidaste tu contraseña?</Text>
                        </TouchableOpacity>

                        <View>
                            <View style={styles.divider} />
                            <Text style={styles.dividerText}>o</Text>
                            <View style= {styles.divider} />
                        </View>

                        <TouchableOpacity
                        style={styles.googleBtn}
                        onPress={handleGoogleLogin}
                        activeOpacity={0.8}
                        disabled={isLoading || googleLoading}
                        >
                            {googleLoading
                            ? <ActivityIndicator color={colors.textPrimary} size="small"/>
                            : <Text style={styles.googleText}>Continuar con Google</Text>}
                        </TouchableOpacity>

                        {showSuccessMessage && (
                            <Animated.View style={[styles.successMessageContainer, { opacity: fadeAnim }]}>
                                <Text style={styles.succesMessageText}>{successMessage}</Text>
                            </Animated.View>
                        )}

                        <View style={styles.registerContainer}>
                            <Text style={{fontSize: 15, color: colors. textSecondary }}>¿No tienes una cuenta?</Text>
                            <TouchableOpacity onPress={() => navigation.navigate('UserType')} disabled={isLoading}>
                                <Text style={styles.registerText}>Registrate</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}