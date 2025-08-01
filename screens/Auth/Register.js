import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ScrollView,
    SafeAreaView,
    Alert,
    Platform,
    KeyboardAvoidingView,
    ActivityIndicator,
    Animated,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { Axios } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '../../../web/DevOp/context/ThemeContext';
import { response, text } from 'express';

WebBrowser.maybeComleteAuthSession();

export default function Register({ navigation, route }) {
    const { colors } = useTheme();
    const styles = useMemo(() => createRegisterStyles(colors), [colors]);

    //Obtener tipo de usuario e informacion de Google si existe
    const tipoUsuario = route?.params?.tipoUsuario || 'alumno';
    const googleUserInfo = route?.params?.googleUserInfo;
    const isGoogleSignIn = route?.params?.isGoogleSignIn || false;

    const [formData, setFormData] = useState({
        email: googleUserInfo?.email || '',
        password: '',
        username: googleUserInfo?.name || '',
        empresa: googleUserInfo?.name || '',
        phone: '',
        phonePrefix: '+52',
    });

    const [isLoading, setIsLoading] = useState(false);
    const [validationErrors, setValidationErrors] = useState({});
    const [showSuccessMessage, setShowSuccessMessage] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const fadeAnim = useRef(new Animated.Value(0)).current;

    const { userInfo, loading: googleLoading, error: googleError, signInWithGoogle } = useGoogleAuth();

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
            errors.email = 'El correo electronico es requerido';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            errors.email = 'El correo electronico no es valido';
        }

        if (!isGoogleSignIn && !formData.password) {
            errors.password = 'La contraseña es requerida';
        } else if (!isGoogleSignIn && formData.password.length < 6) {
            errors.password = 'La contraseña debe tener al menos 6 caracteres';
        }

        if (tipoUsuario === 'alumno' && !formData.username) {
            errors.username = 'El nombre de usuario es requerido';
        }

        if (tipoUsuario === 'empresa' && !formData.empresa) {
            errors.empresa = 'El nombre de la empresa es requerido';
        }

        if (!formData.phone) {
            errors.phone = 'El numero de telefono es requerido';
        } else if (!/^\d{10}$/.test(formData.phone.replace(/\D/g, ''))) {
            errors.phone = 'El numero de telefono debe tener 10 digitos';
        }

        setValidationErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleInput = (key, value) => {
        setFormData((prev) => ({ ...prev, [key]: value}));
        if (validationErrors[key]) {
            setValidationErrors(prev => ({ ...prev, [key]: null }));
        }
    };

    const handleRegister = async () => {
        if (!validateForm()) return;

        setIsLoading(true);
        setValidationErrors({});

        try {
            const data = new URLSearchParams();
            data.append('email', formData.email.trim());
            data.append('password', formData.password);
            data.append('phonePrefix', formData.phonePrefix);
            data.append('phone', formData.phone.replace(/\D/g, ''));
            data.append('tipoUsuario', tipoUsuario);
            data.append('googleAuth', isGoogleSignIn ? 'true' : 'false');

            if (isGoogleSignIn && googleUserInfo) {
                data.append('googleId', googleUserInfo.uid);
                data.append('googleToken', googleUserInfo.idToken);
            }

            if (tipoUsuario === 'alumno') {
                data.append('username', formData.username.trim());
                data.append('empresa', '');
            } else {
                data.append('username', formData.empresa.trim());
                data.append('empresa', formData.empresa.trim());
            }

            const res = response.data;

            if (res.success) {
                if (!res.usuario || !res.usuario.id) {
                    throw new Error('Datos de usuario incompletos en la respuesta');
                }
                await AsyncStorage.setItem('userId', String(res.usuario.id));
                await AsyncStorage.setItem('userType', tipoUsuario);
                if (res.token) {
                    await AsyncStorage.setItem('userToken', res.token);
                }

                showAnimatedMessage("¡Registro exitoso!");

                setTimeout(() => {
                    if (tipoUsuario === 'empresa') {
                        navigation.replace('EmpresaInicio');
                    } else {
                        navigation.replace('AlumnoInicio');
                    }
                }, 1000);
            } else {
                setValidationErrors( {
                    general: res.message || 'Error al registrar usuario'
                });
            }
        } catch (error) {
            console.error('Error en registro:', error);

            if (error.code === 'ECONNABORTED') {
                setValidationErrors( {
                    general: 'Tiempo de espera agotado. Verfica tu conexion a internet.'
                });
            } else if (error.response) {
                const statusCode = error.response.status;
                const errorData = error.response.data;

                if (statusCode === 409) {
                    setValidationErrors({
                        email: 'Este correo electronico ya esta registrado'
                    });
                } else if (errorData && errorData.message) {
                    setValidationErrors({
                        general: errorData.message
                    });
                } else {
                    setValidationErrors({
                        general: `Error del servidor (${statusCode}). Intenta mas tarde.`
                    });
                }
                } else if (error.message) {
                    setValidationErrors({
                        general: error.message
                    });
                } else {
                    setValidationErrors({
                        general: 'Error de conexion. No se pudo contactar con el servidor.'
                    });
                }
            } finally {
                setIsLoading(false);
            }
        };

        const handleGoogleRegister = async () => {
            try {
                const authResult = await signInWithGoogle();
                if (!authResult) {
                    Alert.alert("Error", "Registro con Google cancelado o fallido.");
                }
            } catch (e) {
                console.error("Error al registrarse ci¿on Google:", e);
                Alert.alert("Error", "Error al registrarse con Google.");
            }
        };

        useEffect(() => {
            if (userInfo && !userInfo.needsRegistration) {
                const navigateUser = async () => {
                    await AsyncStorage.setItem('userId', userInfo.uid);
                    await AsyncStorage.setItem('userType', userInfo.tipoUsuario || 'alumno');

                    showAnimatedMessage("¡Registro con Google completado y sesion iniciada!");
                    setTimeout(() => {
                        if (userInfo.tipoUsuario === 'empresa') {
                            navigation.replace('EmpresaInicio');
                        } else {
                            navigation.replace('AlumnoInicio');
                        }
                    }, 1000);
                };
                navigateUser();
            }
        }, [userInfo, navigation]);

        useEffect(() => {
            if (googleError) {
                Alert.alert('Error', googleError);
            }
        }, [googleError]);

        return (
            <SafeAreaView style={styles.safeArea}>
                <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding': undefined}
                style={{ flex: 1 }}
                >
                    <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => navigation.goBack()}
                    >
                        <Text style={styles.backButtonText}>←</Text>
                    </TouchableOpacity>

                    <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
                        <Text style={styles.title}>Crear Cuenta</Text>
                        <Text style={styles.subtitle}>Unete como {tipoUsuario}</Text>

                        {validationErrors.general && (
                            <View style={styles.errorContainer}>
                                <Text style={styles.errorText}>{validationErrors.general}</Text>
                            </View>
                        )}

                        <TextInput
                        style={[styles.input, validationErrors.email && styles.inputError]}
                        placeholder="ejemplo@correo.com"
                        onChangeText={(text) => handleInput('email', text)}
                        autoCapitalize="none"
                        keyboardType="email-address"
                        autoCorrect={false}
                        value={formData.email}
                        placeholderTextColor={colors.textSecondary}
                        editable={!isLoading && !isGoogleSignIn}
                        />
                        {validationErrors.email && (
                            <Text style={styles.errorText}>{validationErrors.email}</Text>
                        )}
                        {!isGoogleSignIn && (
                            <>
                            <Text style={styles.label}>Contraseña *</Text>
                            <TextInput
                            style={[styles.input, validationErrors.password && styles.inputError]}
                            placeholder="Crea una contraseña (min. 6 caracteres)"
                            onChangeText={(text) => handleInput('password', text)}
                            secureTextEntry
                            value={formData.password}
                            placeholderTextColor={colors.textSecondary}
                            editable={!isLoading}
                            />
                            {validationErrors.password && (
                                <Text style={styles.errorText}>{validationErrors.password}</Text>
                            )}
                            </>
                        )}

                        {tipoUsuario === 'alumno' && (
                            <>
                            <Text style={styles.label}>Nombre de usuario *</Text>
                            <TextInput
                            style={[styles.input, validationErrors.username && styles.inputError]}
                            placeholder="Ingresa tu nombre"
                            onChangeText={(text) => handleInput('username', text)}
                            value={formData.username}
                            placeholderTextColor={colors.textSecondary}
                            editable={!isLoading}
                            />
                            {validationErrors.username && (
                                <Text style={styles.errorText}>{validationErrors.username}</Text>
                            )}
                            </>
                        )}

                        {tipoUsuario === 'empresa' && (
                            <>
                            <Text style={styles.label}>Nombre de la empresa *</Text>
                            <TextInput
                            style={[styles.input, validationErrors.empresa && styles.inputError]}
                            placeholder="Ingresa el nombre de tu empresa"
                            onChangeText={(text) => handleInput('empresa', text)}
                            value={formData.empresa}
                            placeholderTextColor={colors.textSecondary}
                            editable={!isLoading}
                            />
                            {validationErrors.empresa && (
                                <Text style={styles.errorText}>{validationErrors.empresa}</Text>
                            )}
                            </>
                        )}

                        <Text style={styles.label}>Numero de celular *</Text>
                        <View style={styles.pickerWrapper}>
                            <Picker
                            selectedValue={formData.phonePrefix}
                            onValueChange={(value) => handleInput('phonePrefix', value)}
                            style={styles.picker}
                            mode="dropdown"
                            enabled={!isLoading}
                            >
                                <Picker.Item label="+52 (MX)" value="+52"/>
                                <Picker.Item label="+1 (US)" value="+1"/>
                            </Picker>
                        </View>
                        
                        <TextInput
                        style={[styles.inputNoMargin, styles.phoneInput, validationErrors.phone && styles.inputError]}
                        placeholder="Ingresa tu numero"
                        keyboardType="phone-pad"
                        onChangeText={(text) => handleInput('phone', text)}
                        value={formData.phone}
                        placeholderTextColor={colors.textSecondary}
                        editable={!isLoading}
                        />
                        {validationErrors.phone && (
                            <Text style={styles.errorText}>{validationErrors.phone}</Text>
                        )}

                        <TouchableOpacity
                        style={[styles.submitBtn, isLoading && styles.submitBtnDisabled]}
                        onPress={handleRegister}
                        disabled={isLoading}
                        >
                            {isLoading ? (
                                <ActivityIndicator color={colors.buttonText} size="small"/>
                            ): (
                                <Text style={styles.submitText}>Crear cuenta</Text>
                            )}
                        </TouchableOpacity>

                        {!isGoogleSignIn && (
                            <>
                            <View>
                                <View style={styles.divider} />
                                <Text style={styles.dividerText}>o</Text>
                                <View style={styles.divider} />
                            </View>

                            <TouchableOpacity
                            style={styles.googleBtn}
                            onPress={handleGoogleRegister}
                            activeOpacity={0.8}
                            disabled={isLoading || googleLoading}
                            >
                                {googleLoading ? (
                                    <ActivityIndicator color={colors.googleButtonText} size="small"/>
                                ) : (
                                    <Text style={styles.googleText}>Continuar con Google</Text>
                                )}
                            </TouchableOpacity>
                            </>
                        )}

                        {showSuccessMessage && (
                            <Animated.View style={[styles.successMessageContainer, {opacity: fadeAnim}]}>
                                <Text style={styles.successMessageText}>{successMessage}</Text>
                            </Animated.View>
                        )}

                        <View style={styles.loginContainer}>
                            <Text style={{ fontSize:15, color: colors.textSecondary }}>¿Ya tienes una cuenta? </Text>
                            <TouchableOpacity onPress={() => navigation.navigate('Login')} disabled={isLoading}>
                                <Text style={styles.loginText}>Inicia sesion</Text>
                            </TouchableOpacity>
                        </View>
                    </ScrollView>
                </KeyboardAvoidingView>
            </SafeAreaView>
        );
    }