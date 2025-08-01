import React from "react";
import { View, Text, Image, TouchableOpacity,SafeAreaView } from "react-native";
import { useTheme } from "../../../web/DevOp/context/ThemeContext";
import { createWelcomeStyles } from '../Auth../Welcome';
import { ThemeToggle } from "../../components/ThemeToggle";

export default function Welcome({ navigation }) {
    const { colors } = useTheme();
    const styles = createWelcomeStyles(colors);

    return (
        <SafeAreaView style={styles.container}>
            <Image
            source={{uri: 'https://yopracticando.com/logo_yopracticando.png'}}
            style={styles.logo}
            resizeMode="contain"
            />
            <Text style={styles.welcomeText}>Bienvenido a YoPracticando</Text>
            <Text style={styles.subtitle}>Tu plataforma para practicas profesionales</Text>

            <View style={styles.buttonsContainer}>
                <TouchableOpacity
                style={styles.loginBtn}
                onPress={() => navigation.navigate('UserType')}
                >
                    <Text style={styles.registerText}>Registrarse</Text>
                </TouchableOpacity>
            </View>
            {/*Aqui se agrega el toogle */}
            <ThemeToggle />
        </SafeAreaView>
    );
}