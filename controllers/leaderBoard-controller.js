import firebaseApp from '../firebaseConfig.js';
import { collection, getFirestore, getDoc, getDocs, doc, setDoc, updateDoc, limit, orderBy, query } from 'firebase/firestore';
import { scoreBuffer } from '../scheduler.js';

const db = getFirestore(firebaseApp);
const coll = collection(db, 'leaderboard');

export const addScore = (req, res) => {
  const { deviceId, deviceName, name, score, countryCode, avatarUrl } = req.body;

  console.log('addScore',deviceId, deviceName, name, score, countryCode, avatarUrl)

  if (!deviceId) return res.status(400).json({ message: "deviceId is required" });

  // Store latest score in memory buffer
  scoreBuffer[deviceId] = {
    deviceId,
    deviceName,
    name,
    score,
    countryCode,
    avatarUrl,
    updatedAt: Date.now(),
  };

  res.status(200).json({ message: "Score received. Will be saved at 11 PM." });
};

// get all scores
let cache = { data: null, timestamp: 0 };

export const getAllScores = async (req, res) => {
  const now = Date.now();

  // Return cached data if under 12 hours old
  if (cache.data && now - cache.timestamp < 60000*60*12) {
    return res.status(200).json(cache.data);
  }

  try {
    const q = query(coll, orderBy("score", "desc"), limit(200));
    const querySnapshot = await getDocs(q);

    const scores = querySnapshot.docs.map(doc => ({
        name: doc.data().name,
        score: doc.data().score,
        deviceName: doc.data().deviceName,
        countryCode: doc.data().countryCode,
        avatarUrl: doc.data().avatarUrl,
    }
    ));
    // Cache the result
    cache = { data: scores, timestamp: now };

    res.status(200).json(scores);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};