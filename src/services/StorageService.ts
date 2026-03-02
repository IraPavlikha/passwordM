import AsyncStorage from "@react-native-async-storage/async-storage";

export type PasswordItem = {
  id: string;
  service: string;
  login: string;
  password: string;
  category?: string;
  site?: string;
  notes?: string;
  color?: string;
  createdAt: string;
};

const STORAGE_KEY = "@passwords";

export const PasswordStorage = {
  async getAll(): Promise<PasswordItem[]> {
    try {
      const json = await AsyncStorage.getItem(STORAGE_KEY);
      return json ? JSON.parse(json) : [];
    } catch (e) {
      console.error("Помилка завантаження", e);
      return [];
    }
  },

  async save(passwords: PasswordItem[]) {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(passwords));
    } catch (e) {
      console.error("Помилка збереження", e);
    }
  },

  async clearAll() {
    try {
      await AsyncStorage.removeItem(STORAGE_KEY);
    } catch (e) {
      console.error("Помилка очищення", e);
      throw e;
    }
  }
};