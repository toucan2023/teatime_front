import { initializeApp } from "firebase/app";
import { getDatabase, ref, get } from "firebase/database";
import { getAuth } from "firebase/auth";
import { CourseListData } from "@/app/timetable/courselist_type";

const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_APIKEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECTID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGEBUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGINGSENDERID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APPID,
    measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENTID
};

const firebaseApp = initializeApp(firebaseConfig);
const database = getDatabase(firebaseApp);
const auth = getAuth(firebaseApp);

const fetchDataFromFirebase = async (collectionName: string): Promise<CourseListData[]> => {
  try {
    const dbRef = ref(database, collectionName);
    const dataSnapshot = await get(dbRef);

    if (dataSnapshot.exists()) {
      const data: CourseListData[] = [];
      dataSnapshot.forEach((childSnapshot) => {
        const item = childSnapshot.val();
        data.push({
          id: item.id,
          course: item.course,
          professorName: item.professorName,
          courseRoom: item.courseRoom,
          credits: item.credits,
          startTime: item.startTime,
          endTime: item.endTime,
          type: item.type,
          grade: item.grade,
          days: item.days, // days 정보 추가
        });
      });
      return data;
    } else {
      return [];
    }
  } catch (error) {
    console.error('데이터 가져오기 오류:', error);
    throw error;
  }
};

export { fetchDataFromFirebase, auth, database };
