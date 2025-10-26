import firebaseApp from '../firebaseConfig.js';
import { collection, getFirestore, getDoc, getDocs, doc, setDoc, updateDoc, limit, orderBy, query } from 'firebase/firestore';

const db = getFirestore(firebaseApp);
const coll = collection(db, 'leaderboard');

export const addScore = async (req, res) => {
    const { deviceId, deviceName, name, score, countryName, countryCode, avatarUrl, } = req.body;

    const newDoc = {
        deviceId: deviceId,
        deviceName: deviceName,
        name: name,
        score: score,
        countryName: countryName,
        countryCode: countryCode,
        avatarUrl: avatarUrl,
        updatedAt: Date.now(),
    };

    try {
        const docRef = doc(coll, deviceId);
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

        res.status(200).json({ message: 'Score added successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
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
        countryName: doc.data().countryName,
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