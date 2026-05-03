import { db } from "./firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";

/**
 * Caches AI responses in Firestore to improve performance and reduce API costs.
 * @param key Unique key for the cache (e.g., md5 of prompt + params)
 * @param data The AI response object to store
 */
export async function setCache(key: string, data: any) {
  try {
    const cacheRef = doc(db, "ai_cache", key);
    await setDoc(cacheRef, {
      data,
      timestamp: Date.now(),
    });
  } catch (error) {
    console.error("Cache Write Error:", error);
  }
}

export async function getCache(key: string) {
  try {
    const cacheRef = doc(db, "ai_cache", key);
    const snap = await getDoc(cacheRef);
    if (snap.exists()) {
      const { data, timestamp } = snap.data();
      // Cache expires after 24 hours
      if (Date.now() - timestamp < 24 * 60 * 60 * 1000) {
        return data;
      }
    }
  } catch (error) {
    console.error("Cache Read Error:", error);
  }
  return null;
}
