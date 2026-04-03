import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SecureStore from "expo-secure-store";
import CryptoJS from "crypto-js";

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
const KEY_STORE = "PASSWORD_SECRET_KEY";


async function getSecretKey(): Promise<string> {
  let key = await SecureStore.getItemAsync(KEY_STORE);
  if (!key) {
    key = CryptoJS.lib.WordArray.random(32).toString();
    await SecureStore.setItemAsync(KEY_STORE, key);
  }
  return key;
}


async function encryptData(data: PasswordItem[]): Promise<string> {
  const secretKey = await getSecretKey();
  const salt = CryptoJS.lib.WordArray.random(128 / 8);
  const iv = CryptoJS.lib.WordArray.random(128 / 8);

  const derivedKey = CryptoJS.PBKDF2(secretKey, salt, {
    keySize: 256 / 32,
    iterations: 1000,
  });

  const encrypted = CryptoJS.AES.encrypt(JSON.stringify(data), derivedKey, {
    iv,
  }).toString();


  const payload = {
    cipher: encrypted,
    salt: salt.toString(CryptoJS.enc.Base64),
    iv: iv.toString(CryptoJS.enc.Base64),
  };

  return JSON.stringify(payload);
}


async function decryptData(encryptedPayload: string): Promise<PasswordItem[]> {
  const secretKey = await getSecretKey();
  const payload = JSON.parse(encryptedPayload);

  const salt = CryptoJS.enc.Base64.parse(payload.salt);
  const iv = CryptoJS.enc.Base64.parse(payload.iv);

  const derivedKey = CryptoJS.PBKDF2(secretKey, salt, {
    keySize: 256 / 32,
    iterations: 1000,
  });

  const bytes = CryptoJS.AES.decrypt(payload.cipher, derivedKey, { iv });
  const decrypted = bytes.toString(CryptoJS.enc.Utf8);
  return decrypted ? JSON.parse(decrypted) : [];
}

export const PasswordStorage = {
  async getAll(): Promise<PasswordItem[]> {
    try {
      const encrypted = await AsyncStorage.getItem(STORAGE_KEY);
      if (!encrypted) return [];
      return decryptData(encrypted);
    } catch (e) {
      console.error("Помилка завантаження", e);
      return [];
    }
  },

  async save(passwords: PasswordItem[]) {
    try {
      const encrypted = await encryptData(passwords);
      await AsyncStorage.setItem(STORAGE_KEY, encrypted);
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
  },
};