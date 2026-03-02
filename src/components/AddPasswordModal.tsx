import React, { useState, useEffect } from "react";
import {
  Modal, View, Text, TextInput, StyleSheet, TouchableOpacity,
  KeyboardAvoidingView, Platform, ScrollView, TouchableWithoutFeedback
} from "react-native";
import { X, ChevronDown, Check } from "lucide-react-native";

const CATEGORIES = [
  { id: 'social', label: 'Соцмережі', icon: '🌐' },
  { id: 'work', label: 'Робота', icon: '💼' },
  { id: 'finance', label: 'Фінанси', icon: '🏦' },
  { id: 'shopping', label: 'Покупки', icon: '🛒' },
  { id: 'fun', label: 'Розваги', icon: '🎮' },
  { id: 'other', label: 'Інше', icon: '📁' },
];

export default function AddPasswordModal({ visible, onClose, onAdd, initialData }: any) {
  const [form, setForm] = useState({
    service: '', login: '', password: '', category: 'other', site: '', notes: ''
  });

  const [showPicker, setShowPicker] = useState(false);

  useEffect(() => {
    if (initialData && visible) {
      setForm({
        service: initialData.service,
        login: initialData.login,
        password: initialData.password,
        category: initialData.category || 'other',
        site: initialData.site || '',
        notes: initialData.notes || ''
      });
    } else if (!initialData && visible) {
      setForm({ service: '', login: '', password: '', category: 'other', site: '', notes: '' });
    }
  }, [initialData, visible]);

  const selectedCategory = CATEGORIES.find(c => c.id === form.category) || CATEGORIES[5];

  const handleAdd = () => {
    if (!form.service || !form.password) return;
    onAdd({
      ...form,
      id: initialData ? initialData.id : Date.now().toString(),
      color: initialData ? initialData.color : "#F3F4F6",
      categoryLabel: selectedCategory.label,
      categoryIcon: selectedCategory.icon
    });
  };

  return (
    <Modal visible={visible} animationType="fade" transparent>
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.container}>
              <View style={styles.content}>
                <View style={styles.handle} />
                <View style={styles.header}>
                  <Text style={styles.title}>{initialData ? "Змінити" : "Новий пароль"}</Text>
                  <TouchableOpacity onPress={onClose}><X color="#9CA3AF" size={24} /></TouchableOpacity>
                </View>

                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 20 }}>
                  <Text style={styles.label}>Сервіс</Text>
                  <TextInput
                    style={styles.input}
                    value={form.service}
                    onChangeText={t => setForm({...form, service: t})}
                    placeholder="Наприклад, Google"
                  />

                  <Text style={styles.label}>Логін</Text>
                  <TextInput
                    style={styles.input}
                    value={form.login}
                    onChangeText={t => setForm({...form, login: t})}
                    autoCapitalize="none"
                  />

                  <Text style={styles.label}>Пароль</Text>
                  <TextInput
                    style={styles.input}
                    value={form.password}
                    onChangeText={t => setForm({...form, password: t})}
                    secureTextEntry
                  />

                  <Text style={styles.label}>Категорія</Text>
                  <TouchableOpacity style={styles.pickerTrigger} onPress={() => setShowPicker(!showPicker)}>
                    <Text style={styles.pickerValue}>{selectedCategory.icon} {selectedCategory.label}</Text>
                    <ChevronDown size={20} color="#9CA3AF" />
                  </TouchableOpacity>

                  {showPicker && (
                    <View style={styles.pickerDropdown}>
                      {CATEGORIES.map((cat) => (
                        <TouchableOpacity
                          key={cat.id}
                          style={styles.pickerItem}
                          onPress={() => { setForm({...form, category: cat.id}); setShowPicker(false); }}
                        >
                          <Text>{cat.icon} {cat.label}</Text>
                          {form.category === cat.id && <Check size={18} color="#8B5CF6" />}
                        </TouchableOpacity>
                      ))}
                    </View>
                  )}

                  <Text style={styles.label}>Сайт (опціонально)</Text>
                  <TextInput
                    style={styles.input}
                    value={form.site}
                    onChangeText={t => setForm({...form, site: t})}
                    placeholder="https://..."
                  />

                  <Text style={styles.label}>Нотатки</Text>
                  <TextInput
                    style={[styles.input, styles.textArea]}
                    value={form.notes}
                    multiline
                    onChangeText={t => setForm({...form, notes: t})}
                  />

                  <TouchableOpacity style={styles.mainBtn} onPress={handleAdd}>
                    <Text style={styles.mainBtnText}>{initialData ? "Зберегти" : "Додати"}</Text>
                  </TouchableOpacity>
                </ScrollView>
              </View>
            </KeyboardAvoidingView>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'flex-end' },
  container: { width: '100%' },
  content: { backgroundColor: '#fff', borderTopLeftRadius: 32, borderTopRightRadius: 32, paddingHorizontal: 24, maxHeight: '90%' },
  handle: { width: 40, height: 4, backgroundColor: '#E5E7EB', borderRadius: 2, alignSelf: 'center', marginTop: 12, marginBottom: 8 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 20 },
  title: { fontSize: 28, fontWeight: '900', color: '#000' },
  label: { fontSize: 14, fontWeight: '600', color: '#6B7280', marginBottom: 8, marginTop: 12 },
  input: { backgroundColor: '#fff', borderRadius: 16, padding: 16, fontSize: 16, borderWidth: 1.5, borderColor: '#F3F4F6', color: '#000' },
  textArea: { height: 80, textAlignVertical: 'top' },
  pickerTrigger: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#fff', borderRadius: 16, padding: 16, borderWidth: 1.5, borderColor: '#F3F4F6' },
  pickerValue: { fontSize: 16, color: '#000' },
  pickerDropdown: { marginTop: 8, backgroundColor: '#fff', borderRadius: 20, borderWidth: 1.5, borderColor: '#F3F4F6', overflow: 'hidden' },
  pickerItem: { flexDirection: 'row', justifyContent: 'space-between', padding: 16, borderBottomWidth: 1, borderBottomColor: '#F9FAFB', alignItems: 'center' },
  mainBtn: { backgroundColor: '#8B5CF6', padding: 20, borderRadius: 20, alignItems: 'center', marginTop: 30, marginBottom: 10 },
  mainBtnText: { color: '#fff', fontSize: 18, fontWeight: '700' }
});