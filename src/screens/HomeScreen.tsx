import React, { useState, useEffect, useMemo, useCallback } from "react";
import { View, Text, StyleSheet, SafeAreaView, FlatList, TextInput, TouchableOpacity } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { Search, Plus, ShieldCheck } from "lucide-react-native";
import { PasswordStorage, PasswordItem } from "../services/StorageService";
import PasswordCard from "../components/PasswordCard";
import AddPasswordModal from "../components/AddPasswordModal";
import PasswordDetailModal from "../components/PasswordDetailModal";

const PURPLE = "#8B5CF6";

export default function HomeScreen() {
  const [passwords, setPasswords] = useState<PasswordItem[]>([]);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPassword, setSelectedPassword] = useState<PasswordItem | null>(null);
  const [editingPassword, setEditingPassword] = useState<PasswordItem | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  useFocusEffect(
    useCallback(() => {
      const loadData = async () => {
        const data = await PasswordStorage.getAll();
        setPasswords(data);
      };
      loadData();
    }, [])
  );

  const filteredData = useMemo(() => {
    return passwords
      .filter(p => p.service.toLowerCase().includes(search.toLowerCase()))
      .sort((a, b) => a.service.localeCompare(b.service));
  }, [passwords, search]);

  const handleSavePassword = async (newPass: PasswordItem) => {
    let updated;
    if (editingPassword) {
      updated = passwords.map(p => p.id === newPass.id ? newPass : p);
    } else {
      updated = [newPass, ...passwords];
    }

    setPasswords(updated);
    await PasswordStorage.save(updated);
    setIsModalOpen(false);
    setEditingPassword(null);
  };

  const handleDelete = async (id: string) => {
    const updated = passwords.filter(p => p.id !== id);
    setPasswords(updated);
    await PasswordStorage.save(updated);
    setIsDetailOpen(false);
  };

  const handleOpenDetails = (item: PasswordItem) => {
    setSelectedPassword(item);
    setIsDetailOpen(true);
  };

  const handleStartEdit = (item: PasswordItem) => {
    setIsDetailOpen(false);
    setEditingPassword(item);
    setIsModalOpen(true);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.decorCircleTop} />
      <View style={styles.container}>
        <Text style={styles.tag}>Менеджер паролів</Text>
        <Text style={styles.title}>Ваші{"\n"}<Text style={{ color: PURPLE }}>паролі</Text></Text>

        <View style={styles.search}>
          <Search size={20} color="#9CA3AF" />
          <TextInput
            placeholder="Пошук сервісів..."
            value={search}
            onChangeText={setSearch}
            style={styles.searchInput}
          />
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statNum}>{passwords.length}</Text>
            <Text style={styles.statLabel}>Збережено</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: PURPLE }]}>
            <ShieldCheck color="#fff" size={28} />
            <Text style={[styles.statLabel, { color: "#fff" }]}>Захищено</Text>
          </View>
        </View>

        <FlatList
          data={filteredData}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => handleOpenDetails(item)}>
              <PasswordCard item={item} />
            </TouchableOpacity>
          )}
          contentContainerStyle={{ paddingBottom: 100 }}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>
                {search ? "Нічого не знайдено" : "У вас поки немає збережених паролів"}
              </Text>
            </View>
          }
        />

        <TouchableOpacity
          style={styles.fab}
          onPress={() => {
            setEditingPassword(null);
            setIsModalOpen(true);
          }}
        >
          <Plus color="#fff" size={32} />
        </TouchableOpacity>

        <AddPasswordModal
          visible={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setEditingPassword(null);
          }}
          onAdd={handleSavePassword}
          initialData={editingPassword}
        />

        <PasswordDetailModal
          visible={isDetailOpen}
          item={selectedPassword}
          onClose={() => setIsDetailOpen(false)}
          onDelete={handleDelete}
          onEdit={handleStartEdit}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#fff" },
  container: { flex: 1, paddingHorizontal: 24, paddingTop: 10 },
  decorCircleTop: { position: 'absolute', top: -40, right: -40, width: 200, height: 200, borderRadius: 100, backgroundColor: '#F3E8FF', zIndex: -1 },
  tag: { color: "#9CA3AF", fontSize: 14, marginBottom: 4 },
  title: { fontSize: 40, fontWeight: "900", lineHeight: 44, marginBottom: 20 },
  search: { flexDirection: "row", backgroundColor: "#F9FAFB", borderRadius: 18, padding: 14, alignItems: "center", gap: 10, borderWidth: 1, borderColor: "#F3F4F6", marginBottom: 20 },
  searchInput: { flex: 1, fontSize: 16 },
  statsRow: { flexDirection: 'row', gap: 12, marginBottom: 20 },
  statCard: { flex: 1, height: 90, borderRadius: 24, backgroundColor: '#F5F0E8', padding: 16, justifyContent: 'center' },
  statNum: { fontSize: 28, fontWeight: '800' },
  statLabel: { fontSize: 12, color: '#6B7280' },
  fab: { position: "absolute", right: 24, bottom: 24, width: 64, height: 64, backgroundColor: PURPLE, borderRadius: 20, alignItems: "center", justifyContent: "center", elevation: 8, shadowOpacity: 0.3 },
  emptyContainer: { alignItems: 'center', marginTop: 50 },
  emptyText: { color: '#9CA3AF', fontSize: 16, textAlign: 'center' }
});