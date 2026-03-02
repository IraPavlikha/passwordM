import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Switch,
  TouchableOpacity,
  Alert,
  Platform,
  ScrollView
} from "react-native";
import { Fingerprint, Trash2, ChevronRight, ShieldCheck } from "lucide-react-native";
import * as LocalAuthentication from 'expo-local-authentication';
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Updates from 'expo-updates';
import { PasswordStorage } from "../services/StorageService";

export default function SettingsScreen() {
  const [isBiometricActive, setIsBiometricActive] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const savedStatus = await AsyncStorage.getItem("biometric_enabled");
      setIsBiometricActive(savedStatus === "true");
    } catch (e) {
      console.error("Помилка завантаження налаштувань", e);
    }
  };

  const toggleBiometrics = async (value: boolean) => {
    if (value) {
      const hasHardware = await LocalAuthentication.hasHardwareAsync();
      const isEnrolled = await LocalAuthentication.isEnrolledAsync();

      if (!hasHardware || !isEnrolled) {
        Alert.alert("Помилка", "Біометрія не налаштована на цьому пристрої.");
        return;
      }

      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: "Підтвердьте особу",
        cancelLabel: "Скасувати",
      });

      if (result.success) {
        setIsBiometricActive(true);
        await AsyncStorage.setItem("biometric_enabled", "true");
      }
    } else {
      setIsBiometricActive(false);
      await AsyncStorage.setItem("biometric_enabled", "false");
    }
  };

  const handleClearData = () => {
    Alert.alert(
      "Видалення всіх даних",
      "Ви впевнені? Всі збережені паролі будуть видалені назавжди.",
      [
        { text: "Скасувати", style: "cancel" },
        {
          text: "Видалити все",
          style: "destructive",
          onPress: async () => {
            try {
              await PasswordStorage.clearAll();

              Alert.alert(
                "Успішно",
                "Всі дані видалено. Додаток перезапуститься.",
                [
                  {
                    text: "OK",
                    onPress: () => {
                      setTimeout(() => {
                        Updates.reloadAsync();
                      }, 300);
                    },
                  },
                ]
              );
            } catch (e) {
              console.error("Clear data error:", e);
              Alert.alert("Помилка", "Не вдалося очистити дані.");
            }
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.label}>Параметри</Text>
        <Text style={styles.title}>Налаштування</Text>

        <Text style={styles.sectionTitle}>Безпека</Text>
        <View style={styles.item}>
          <View style={styles.itemLeft}>
            <View style={[styles.iconBox, { backgroundColor: '#F3E8FF' }]}>
              <Fingerprint size={20} color="#8B5CF6" />
            </View>
            <View>
              <Text style={styles.itemText}>Біометрія</Text>
              <Text style={styles.itemSubtext}>Face ID / Touch ID</Text>
            </View>
          </View>
          <Switch
            value={isBiometricActive}
            onValueChange={toggleBiometrics}
            trackColor={{ false: "#E5E7EB", true: "#8B5CF6" }}
          />
        </View>

        <Text style={styles.sectionTitle}>Дані</Text>
        <TouchableOpacity style={styles.item} onPress={handleClearData}>
          <View style={styles.itemLeft}>
            <View style={[styles.iconBox, { backgroundColor: '#FEE2E2' }]}>
              <Trash2 size={20} color="#EF4444" />
            </View>
            <View>
              <Text style={[styles.itemText, { color: "#EF4444" }]}>Очистити все</Text>
              <Text style={styles.itemSubtext}>Дія незворотна</Text>
            </View>
          </View>
          <ChevronRight size={20} color="#9CA3AF" />
        </TouchableOpacity>

        <View style={styles.footerContainer}>
           <View style={styles.footerIconBox}>
             <ShieldCheck size={32} color="#D1D5DB" strokeWidth={1.5} />
           </View>
           <Text style={styles.footerText}>SECURE VAULT</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#fff" },
  container: { paddingHorizontal: 24, paddingTop: 20, paddingBottom: 40 },
  label: { fontSize: 14, color: "#9CA3AF", marginBottom: 4 },
  title: { fontSize: 40, fontWeight: "900", color: "#1F2937", marginBottom: 30 },
  sectionTitle: { fontSize: 13, fontWeight: "600", color: "#9CA3AF", textTransform: "uppercase", letterSpacing: 1, marginBottom: 12, marginTop: 24 },
  item: { padding: 16, backgroundColor: "#fff", borderRadius: 24, borderWidth: 1.5, borderColor: "#F9FAFB", marginBottom: 12, flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  itemLeft: { flexDirection: "row", alignItems: "center", gap: 12 },
  iconBox: { width: 40, height: 40, borderRadius: 12, alignItems: "center", justifyContent: "center" },
  itemText: { fontSize: 16, fontWeight: "700", color: "#1F2937" },
  itemSubtext: { fontSize: 12, color: "#9CA3AF", marginTop: 2 },

  footerContainer: { marginTop: 60, alignItems: 'center', justifyContent: 'center' },
  footerIconBox: { marginBottom: 12, opacity: 0.6 },
  footerText: { fontSize: 14, fontWeight: "800", color: "#D1D5DB", letterSpacing: 3, textTransform: "uppercase" },
  versionBadge: { marginTop: 8, backgroundColor: "#F9FAFB", paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10, borderWidth: 1, borderColor: "#F3F4F6" },
  footerSub: { fontSize: 10, fontWeight: "800", color: "#9CA3AF" }
});