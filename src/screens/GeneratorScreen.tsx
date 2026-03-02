import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Switch,
  ScrollView,
  Platform,
  TextInput,
  Alert
} from "react-native";
import Slider from "@react-native-community/slider";
import { Copy, RefreshCw, Sparkles, Wand2 } from "lucide-react-native";
import * as Clipboard from "expo-clipboard";
import { generatePassword } from "../utils/passwordGenerator";

const PURPLE = "#8B5CF6";
const BG_BEIGE = "#F5F0E8";

export default function GeneratorScreen() {
  const [length, setLength] = useState(16);
  const [upper, setUpper] = useState(true);
  const [lower, setLower] = useState(true);
  const [numbers, setNumbers] = useState(true);
  const [symbols, setSymbols] = useState(false);

  const [password, setPassword] = useState("");
  const [baseWord, setBaseWord] = useState("");

  useEffect(() => {
    handleGenerate();
  }, []);

  const handleGenerate = () => {
    const newPass = generatePassword(length, upper, lower, numbers, symbols);
    setPassword(newPass);
  };

  const handleSmartGenerate = () => {
    if (baseWord.trim().length < 3) {
      Alert.alert("Помилка", "Введіть хоча б 3 літери для основи");
      return;
    }

    const replacements: any = {
      'a': '@', 'A': '4', 'e': '3', 'E': '3', 'i': '1', 'I': '!',
      'o': '0', 'O': '0', 's': '$', 'S': '5', 't': '7', 'T': '7'
    };

    let transformed = baseWord
      .split('')
      .map(char => replacements[char] || char)
      .join('');

    const extraSymbols = "!#%&*";
    const randomSym = extraSymbols[Math.floor(Math.random() * extraSymbols.length)];
    const randomNum = Math.floor(Math.random() * 99);

    setPassword(`${randomSym}${transformed}${randomNum}`);
    setBaseWord("");
  };

  const copy = async () => {
    await Clipboard.setStringAsync(password);
    Alert.alert("Скопійовано", "Пароль у буфері обміну");
  };

  const OptionRow = ({ label, sub, value, onValueChange }: any) => (
    <View style={styles.optionRow}>
      <View>
        <Text style={styles.optionLabel}>{label}</Text>
        <Text style={styles.optionSub}>{sub}</Text>
      </View>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: "#E5E7EB", true: PURPLE }}
        thumbColor="#fff"
      />
    </View>
  );

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <Text style={styles.headerTag}>Генератор</Text>
        <Text style={styles.title}>Створити{"\n"}<Text style={{ color: PURPLE }}>пароль</Text></Text>

        <View style={styles.passCard}>
          <Text style={styles.passText} numberOfLines={2}>{password}</Text>
          <View style={styles.actionRow}>
            <TouchableOpacity style={styles.whiteBtn} onPress={handleGenerate}>
              <RefreshCw size={20} color="#000" />
              <Text style={styles.btnText}>Випадковий</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.purpleBtn} onPress={copy}>
              <Copy size={20} color="#fff" />
              <Text style={[styles.btnText, { color: '#fff' }]}>Копіювати</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.settingsCard}>
          <View style={styles.sectionHeader}>
            <Sparkles size={20} color={PURPLE} />
            <Text style={styles.sectionTitle}>Власне слово</Text>
          </View>
          <View style={styles.smartInputRow}>
            <TextInput
              style={styles.smartInput}
              placeholder="Введіть основу (напр. Secret)"
              value={baseWord}
              onChangeText={setBaseWord}
              autoCapitalize="none"
            />
            <TouchableOpacity style={styles.smartBtn} onPress={handleSmartGenerate}>
              <Wand2 size={20} color="#fff" />
            </TouchableOpacity>
          </View>
          <Text style={styles.hintText}>Ми покращимо ваше слово символами та цифрами</Text>
        </View>

        <View style={[styles.settingsCard, { marginTop: 20 }]}>
          <View style={styles.sliderHeader}>
            <Text style={styles.sliderLabel}>Довжина: <Text style={styles.lengthValue}>{length}</Text></Text>
          </View>

          <Slider
            style={{ width: "100%", height: 40 }}
            minimumValue={8} maximumValue={32} step={1}
            value={length} onValueChange={setLength}
            minimumTrackTintColor="#000" maximumTrackTintColor="#E5E7EB"
            thumbTintColor={PURPLE}
          />

          <View style={styles.optionsList}>
            <OptionRow label="Великі літери" sub="A-Z" value={upper} onValueChange={setUpper} />
            <OptionRow label="Малі літери" sub="a-z" value={lower} onValueChange={setLower} />
            <OptionRow label="Цифри" sub="0-9" value={numbers} onValueChange={setNumbers} />
            <OptionRow label="Спеціальні знаки" sub="!@#$%^&*" value={symbols} onValueChange={setSymbols} />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#F9FAFB" },
  scrollContainer: { padding: 24 },
  headerTag: { color: "#9CA3AF", fontSize: 14, marginBottom: 8 },
  title: { fontSize: 48, fontWeight: "900", lineHeight: 52, color: "#000", marginBottom: 32 },

  passCard: { backgroundColor: BG_BEIGE, borderRadius: 32, padding: 24, alignItems: 'center', marginBottom: 24 },
  passText: { fontSize: 24, fontWeight: '700', color: "#000", textAlign: 'center', marginBottom: 24, letterSpacing: 1 },

  actionRow: { flexDirection: 'row', gap: 12 },
  whiteBtn: { flex: 1, flexDirection: 'row', backgroundColor: '#fff', height: 56, borderRadius: 18, alignItems: 'center', justifyContent: 'center', gap: 8 },
  purpleBtn: { flex: 1, flexDirection: 'row', backgroundColor: PURPLE, height: 56, borderRadius: 18, alignItems: 'center', justifyContent: 'center', gap: 8 },
  btnText: { fontWeight: '600', fontSize: 14 },

  settingsCard: { backgroundColor: '#fff', borderRadius: 32, padding: 24, elevation: 2, shadowColor: "#000", shadowOpacity: 0.05, shadowRadius: 10 },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 15 },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: '#000' },

  smartInputRow: { flexDirection: 'row', gap: 10 },
  smartInput: { flex: 1, backgroundColor: '#F3F4F6', borderRadius: 16, padding: 16, fontSize: 16 },
  smartBtn: { backgroundColor: PURPLE, width: 56, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  hintText: { fontSize: 12, color: '#9CA3AF', marginTop: 10, textAlign: 'center' },

  sliderHeader: { marginBottom: 10 },
  sliderLabel: { color: '#9CA3AF', fontSize: 16 },
  lengthValue: { color: PURPLE, fontWeight: '900' },
  optionsList: { marginTop: 10 },
  optionRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#F9FAFB' },
  optionLabel: { fontSize: 16, fontWeight: '700' },
  optionSub: { fontSize: 12, color: '#9CA3AF' }
});