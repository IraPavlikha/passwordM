import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Platform, Alert } from "react-native";
import { Eye, EyeOff, Copy, MoreVertical, Folder } from "lucide-react-native";
import * as Clipboard from "expo-clipboard";
import * as Haptics from "expo-haptics";

interface Props {
  item: any;
}

export default function PasswordCard({ item }: Props) {
  const [visible, setVisible] = useState(false);

  const copy = async () => {
    await Clipboard.setStringAsync(item.password);
    if (Platform.OS !== 'web') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
    if (Platform.OS === 'ios' || Platform.OS === 'android') {
       Alert.alert("Скопійовано", "Пароль додано до буфера обміну");
    } else {
       alert("Скопійовано!");
    }
  };

  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.serviceInfo}>
          <View style={[styles.avatar, { backgroundColor: item.color || "#F3F4F6" }]}>
             <Text style={{ fontSize: 20 }}>{item.categoryIcon || "🔐"}</Text>
          </View>
          <View style={{ flexShrink: 1 }}>
            <Text style={styles.serviceName} numberOfLines={1}>{item.service}</Text>
            <Text style={styles.loginName} numberOfLines={1}>{item.login}</Text>
          </View>
        </View>
        <TouchableOpacity style={{ padding: 5 }}>
          <MoreVertical size={20} color="#9CA3AF" />
        </TouchableOpacity>
      </View>

      <View style={styles.passwordContainer}>
        <Text style={[styles.passwordText, !visible && { letterSpacing: 5 }]} numberOfLines={1}>
          {visible ? item.password : "••••••••"}
        </Text>
        <View style={styles.actionButtons}>
          <TouchableOpacity onPress={() => setVisible(!visible)} style={styles.iconBtn}>
            {visible ? <EyeOff size={20} color="#6B7280" /> : <Eye size={20} color="#6B7280" />}
          </TouchableOpacity>
          <TouchableOpacity onPress={copy} style={styles.iconBtn}>
            <Copy size={20} color="#8B5CF6" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: "#fff", borderRadius: 28, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: "#F3F4F6" },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  serviceInfo: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  avatar: { width: 44, height: 44, borderRadius: 14, marginRight: 12, alignItems: 'center', justifyContent: 'center' },
  serviceName: { fontSize: 17, fontWeight: "800", color: "#000" },
  loginName: { fontSize: 13, color: "#9CA3AF" },
  passwordContainer: { flexDirection: 'row', backgroundColor: '#F5F0E8', borderRadius: 16, padding: 12, alignItems: 'center' },
  passwordText: { fontSize: 16, fontWeight: '600', color: '#000', flex: 1, fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace' },
  actionButtons: { flexDirection: 'row', gap: 10 },
  iconBtn: { padding: 4 },
});