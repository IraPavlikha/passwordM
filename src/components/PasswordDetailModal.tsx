import React from 'react';
import { Modal, View, Text, StyleSheet, TouchableOpacity, ScrollView, Linking, Alert } from 'react-native';
import { X, Edit2, Trash2, ExternalLink, Copy, Globe, Mail, StickyNote } from 'lucide-react-native';
import * as Clipboard from 'expo-clipboard';

export default function PasswordDetailModal({ visible, item, onClose, onEdit, onDelete }: any) {
  if (!item) return null;

  const copyToClipboard = async (text: string) => {
    await Clipboard.setStringAsync(text);
    Alert.alert("Скопійовано", "Дані збережено у буфер обміну");
  };

  const openLink = () => {
    if (item.site) Linking.openURL(item.site.startsWith('http') ? item.site : `https://${item.site}`);
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.content}>
          <View style={styles.handle} />

          <View style={styles.header}>
            <View style={styles.titleRow}>
               <Text style={styles.categoryIcon}>{item.categoryIcon || '📁'}</Text>
               <View>
                  <Text style={styles.serviceName}>{item.service}</Text>
                  <Text style={styles.categoryLabel}>{item.categoryLabel || 'Інше'}</Text>
               </View>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <X color="#9CA3AF" size={24} />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.infoSection}>
              <View style={styles.labelRow}>
                <Mail size={16} color="#9CA3AF" />
                <Text style={styles.label}>Логін / Email</Text>
              </View>
              <TouchableOpacity style={styles.valueCard} onPress={() => copyToClipboard(item.login)}>
                <Text style={styles.valueText}>{item.login}</Text>
                <Copy size={18} color="#8B5CF6" />
              </TouchableOpacity>
            </View>

            <View style={styles.infoSection}>
              <View style={styles.labelRow}>
                <StickyNote size={16} color="#9CA3AF" />
                <Text style={styles.label}>Пароль</Text>
              </View>
              <TouchableOpacity style={styles.valueCard} onPress={() => copyToClipboard(item.password)}>
                <Text style={styles.valueText}>••••••••</Text>
                <Copy size={18} color="#8B5CF6" />
              </TouchableOpacity>
            </View>

            {item.site && (
              <View style={styles.infoSection}>
                <View style={styles.labelRow}>
                  <Globe size={16} color="#9CA3AF" />
                  <Text style={styles.label}>Веб-сайт</Text>
                </View>
                <TouchableOpacity style={styles.valueCard} onPress={openLink}>
                  <Text style={[styles.valueText, { color: '#8B5CF6' }]} numberOfLines={1}>{item.site}</Text>
                  <ExternalLink size={18} color="#8B5CF6" />
                </TouchableOpacity>
              </View>
            )}

            {item.notes && (
              <View style={styles.infoSection}>
                <Text style={styles.label}>Нотатки</Text>
                <View style={styles.notesCard}>
                  <Text style={styles.notesText}>{item.notes}</Text>
                </View>
              </View>
            )}

            <View style={styles.actionRow}>
              <TouchableOpacity style={styles.editBtn} onPress={() => onEdit(item)}>
                <Edit2 size={20} color="#fff" />
                <Text style={styles.editBtnText}>Редагувати</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.deleteBtn} onPress={() => onDelete(item.id)}>
                <Trash2 size={20} color="#EF4444" />
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  content: { backgroundColor: '#fff', borderTopLeftRadius: 32, borderTopRightRadius: 32, padding: 24, maxHeight: '85%' },
  handle: { width: 40, height: 4, backgroundColor: '#E5E7EB', borderRadius: 2, alignSelf: 'center', marginBottom: 15 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 25 },
  titleRow: { flexDirection: 'row', alignItems: 'center' },
  categoryIcon: { fontSize: 32, marginRight: 15 },
  serviceName: { fontSize: 24, fontWeight: '900', color: '#000' },
  categoryLabel: { fontSize: 14, color: '#9CA3AF' },
  closeBtn: { padding: 5 },

  infoSection: { marginBottom: 20 },
  labelRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 },
  label: { fontSize: 13, fontWeight: '600', color: '#9CA3AF', textTransform: 'uppercase' },
  valueCard: { flexDirection: 'row', backgroundColor: '#F9FAFB', padding: 16, borderRadius: 16, alignItems: 'center', justifyContent: 'space-between', borderWidth: 1, borderColor: '#F3F4F6' },
  valueText: { fontSize: 16, fontWeight: '700', color: '#000', flex: 1 },

  notesCard: { backgroundColor: '#F5F0E8', padding: 16, borderRadius: 16 },
  notesText: { fontSize: 15, color: '#4B5563', lineHeight: 22 },

  actionRow: { flexDirection: 'row', gap: 12, marginTop: 10, marginBottom: 20 },
  editBtn: { flex: 1, backgroundColor: '#8B5CF6', flexDirection: 'row', height: 60, borderRadius: 20, alignItems: 'center', justifyContent: 'center', gap: 10 },
  editBtnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  deleteBtn: { width: 60, height: 60, borderRadius: 20, backgroundColor: '#FEE2E2', alignItems: 'center', justifyContent: 'center' }
});