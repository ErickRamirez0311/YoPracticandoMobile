import React from "react";
import { Switch, View, Platform } from "react-native";
import { useTheme } from "../../web/DevOp/context/ThemeContext";

export const ThemeToggle = () => {
    const { isDarkMode, toggleTheme, colors } = useTheme();

    return (
        <View style={{ padding: 10 }}>
            <Switch
            value={isDarkMode}
            onValueChange={toggleTheme}
            thumbColor={
                Platform.OS === 'android' ? (isDarkMode ? colors.primary : '#fff'): undefined
            }
            trackColor={{ false: colors.border, true: colors.primaryLight }}
            ios_backgroundColor={colors.border}
            />
        </View>
    );
};