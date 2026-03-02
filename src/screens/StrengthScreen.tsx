import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Platform
} from "react-native";
import Svg, { Circle } from "react-native-svg";
import { CheckCircle2, XCircle, Eye, EyeOff } from "lucide-react-native";

const PURPLE = "#8B5CF6";
const RED = "#EF4444";
const GREEN = "#22C55E";
const BG_PINK = "#FEF3F2";

export default function StrengthScreen() {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const stats = useMemo(() => {
    const hasUpper = /[A-Z]/.test(password);
    const hasLower = /[a-z]/.test(password);
    const hasNumbers = /[0-9]/.test(password);
    const isLong = password.length >= 12;

    let s = 0;
    if (password.length > 0) {
      s = Math.min(70, password.length * 4);
      if (hasUpper) s += 10;
      if (hasLower) s += 10;
      if (hasNumbers) s += 10;
    }

    let poolSize = 0;
    if (hasUpper) poolSize += 26;
    if (hasLower) poolSize += 26;
    if (hasNumbers) poolSize += 10;
    const entropy = password.length > 0 ? Math.floor(password.length * Math.log2(poolSize || 1)) : 0;

    return { score: Math.min(100, s), entropy, hasUpper, hasLower, hasNumbers, isLong };
  }, [password]);

  const radius = 50;
  const circumference = 2 * Math.PI * radius;
  const dash = (stats.score / 100) * circumference;

  const getVerdict = () => {
    if (password.length === 0) return { label: "Введіть пароль", color: "#9CA3AF" };
    if (stats.score < 40) return { label: "Слабкий", color: RED };
    if (stats.score < 80) return { label: "Середній", color: "#F59E0B" };
    return { label: "Надійний", color: GREEN };
  };

  const verdict = getVerdict();

  const Criterion = ({ label, met }: { label: string; met: boolean }) => (
    <View style={styles.criterionRow}>
      {met ? (
        <CheckCircle2 size={20} color={GREEN} />
      ) : (
        <XCircle size={20} color="#D1D5DB" />
      )}
      <Text style={[styles.criterionText, { color: met ? "#000" : "#9CA3AF" }]}>
        {label}
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.decorCircle} />

      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <Text style={styles.tag}>Аналіз</Text>
        <Text style={styles.title}>
          Перевірка{"\n"}
          <Text style={{ color: PURPLE }}>надійності</Text>
        </Text>

        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.input}
            secureTextEntry={!showPassword}
            value={password}
            onChangeText={setPassword}
            placeholder="Введіть пароль"
            placeholderTextColor="#9CA3AF"
          />
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            {showPassword ? (
              <EyeOff size={24} color={PURPLE} style={styles.eyeIcon} />
            ) : (
              <Eye size={24} color="#9CA3AF" style={styles.eyeIcon} />
            )}
          </TouchableOpacity>
        </View>

        <View style={styles.scoreCard}>
          <View style={styles.chartWrap}>
            <Svg width={120} height={120}>
              <Circle
                cx={60} cy={60} r={radius}
                stroke="#FEE2E2" strokeWidth={10} fill="none"
              />
              <Circle
                cx={60} cy={60} r={radius}
                stroke={verdict.color}
                strokeWidth={10}
                fill="none"
                strokeDasharray={`${dash} ${circumference}`}
                strokeLinecap="round"
                rotation={-90}
                origin="60,60"
              />
            </Svg>
            <View style={styles.scoreTextCenter}>
              <Text style={styles.scoreNum}>{stats.score}</Text>
              <Text style={styles.scoreTotal}>зі 100</Text>
            </View>
          </View>

          <Text style={[styles.verdictText, { color: verdict.color }]}>
            {verdict.label}
          </Text>
          <Text style={styles.entropyText}>Ентропія: {stats.entropy} біт</Text>
        </View>

        <View style={styles.criteriaCard}>
          <Text style={styles.criteriaTitle}>Критерії</Text>
          <Criterion label="Довжина 12+ символів" met={stats.isLong} />
          <Criterion label="Великі літери (A-Z)" met={stats.hasUpper} />
          <Criterion label="Малі літери (a-z)" met={stats.hasLower} />
          <Criterion label="Цифри (0-9)" met={stats.hasNumbers} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#fff" },
  container: { padding: 24, paddingBottom: 40 },
  tag: { fontSize: 13, color: "#9CA3AF", marginBottom: 4 },
  title: { fontSize: 42, fontWeight: "900", lineHeight: 48, marginBottom: 30, color: "#000" },

  decorCircle: {
    position: 'absolute', top: 50, right: -60,
    width: 150, height: 150, borderRadius: 75,
    backgroundColor: '#F3E8FF', zIndex: -1,
  },

  inputWrapper: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#fff', borderRadius: 20,
    borderWidth: 2, borderColor: PURPLE,
    paddingHorizontal: 16, marginBottom: 24,
  },
  input: {
    flex: 1,
    height: 60,
    fontSize: 18,
    color: '#000',
    fontWeight: '600',
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  eyeIcon: { marginLeft: 10 },

  scoreCard: {
    backgroundColor: BG_PINK,
    borderRadius: 32,
    padding: 30,
    alignItems: 'center',
    marginBottom: 24,
  },
  chartWrap: { justifyContent: 'center', alignItems: 'center', marginBottom: 16 },
  scoreTextCenter: { position: 'absolute', alignItems: 'center' },
  scoreNum: { fontSize: 32, fontWeight: '900', color: '#000' },
  scoreTotal: { fontSize: 12, color: '#9CA3AF' },

  verdictText: { fontSize: 24, fontWeight: '800', marginBottom: 4 },
  entropyText: { fontSize: 14, color: '#6B7280' },

  criteriaCard: {
    backgroundColor: '#fff', borderRadius: 32,
    padding: 24, borderWidth: 1, borderColor: '#F3F4F6',
    ...Platform.select({
        ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 10 },
        android: { elevation: 3 }
    })
  },
  criteriaTitle: { fontSize: 18, fontWeight: '800', marginBottom: 16, color: '#000' },
  criterionRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  criterionText: { marginLeft: 12, fontSize: 16, fontWeight: '500' },
});