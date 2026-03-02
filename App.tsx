import React, { useState, useEffect } from "react";
import { View, ActivityIndicator, StyleSheet } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import * as LocalAuthentication from 'expo-local-authentication';
import AsyncStorage from "@react-native-async-storage/async-storage";
import TabNavigator from "./src/navigation/TabNavigator";

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkBiometrics();
  }, []);

  const checkBiometrics = async () => {
    try {
      // 1. Проверяем, включена ли биометрия в настройках
      const isEnabled = await AsyncStorage.getItem("biometric_enabled");

      if (isEnabled === "true") {
        // 2. Запрашиваем аутентификацию
        const result = await LocalAuthentication.authenticateAsync({
          promptMessage: "Вход в Password Manager",
          cancelLabel: "Отмена",
          fallbackLabel: "Введите пароль устройства",
          disableDeviceFallback: false,
        });

        if (result.success) {
          setIsAuthenticated(true);
        } else {
          // Если пользователь отменил или ошибка, пробуем еще раз (или можно закрыть приложение)
          checkBiometrics();
        }
      } else {
        // Если настройка выключена, пускаем сразу
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error("Biometric error:", error);
      setIsAuthenticated(true); // В случае критической ошибки пускаем, чтобы не заблокировать юзера
    } finally {
      setIsLoading(false);
    }
  };

  // Пока идет проверка данных из памяти, показываем спиннер
  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#8B5CF6" />
      </View>
    );
  }

  // Если проверка включена, но не пройдена, показываем пустой экран или экран блокировки
  if (!isAuthenticated) {
    return <View style={styles.locked} />;
  }

  return (
    <NavigationContainer>
      <StatusBar style="dark" />
      <TabNavigator />
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  locked: {
    flex: 1,
    backgroundColor: "#fff",
  }
});