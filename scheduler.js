import cron from 'node-cron';
import { getFirestore, doc, getDoc, setDoc, updateDoc, collection } from 'firebase/firestore';
import firebaseApp from './firebaseConfig.js';

const db = getFirestore(firebaseApp);
const coll = collection(db, 'leaderboard');

// In-memory buffer to store scores during the day
export const scoreBuffer = {};

/**
 * Schedule daily save at 11:00 PM server local time
 */
export const startDailyScoreSave = () => {
  cron.schedule('0 23 * * *', async () => {
    console.log('[Cron] Running daily score batch update at 11 PM server time');

    for (const deviceId in scoreBuffer) {
      const newDoc = scoreBuffer[deviceId];
      const docRef = doc(coll, deviceId);

      try {
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          await updateDoc(docRef, {
            ...newDoc,
            updatedAt: Date.now(),
          });
        } else {
          await setDoc(docRef, {
            ...newDoc,
            createdAt: Date.now(),
          });
        }
      } catch (err) {
        console.error(`Error updating score for ${deviceId}:`, err);
      }
    }

    // Clear buffer after writing
    for (const key in scoreBuffer) delete scoreBuffer[key];

    console.log('[Cron] Daily score batch update completed.');
  });
};
