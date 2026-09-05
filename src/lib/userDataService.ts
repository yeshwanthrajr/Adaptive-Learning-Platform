import {
  doc,
  getDoc,
  setDoc,
  collection,
  getDocs,
  addDoc,
  serverTimestamp,
} from 'firebase/firestore';
import { db, auth } from './firebase';
import { handleFirestoreError, OperationType } from './firestoreErrors';
import { StudentProfile, AssessmentResult } from '../types';

export async function saveUserProfileToFirestore(userId: string, profile: StudentProfile): Promise<void> {
  const path = `users/${userId}`;
  try {
    const userDocRef = doc(db, 'users', userId);
    await setDoc(userDocRef, {
      id: profile.id,
      name: profile.name,
      avatar: profile.avatar,
      headline: profile.headline,
      learningStyle: profile.learningStyle,
      pacing: profile.pacing,
      primaryInterest: profile.primaryInterest,
      secondaryInterests: profile.secondaryInterests || [],
      interestEmoji: profile.interestEmoji,
      skillLevel: profile.skillLevel,
      academicGoal: profile.academicGoal,
      currentStreakDays: profile.currentStreakDays,
      completedModulesCount: profile.completedModulesCount,
      overallMasteryScore: profile.overallMasteryScore,
      subSkillMasteries: profile.subSkillMasteries || {},
      recentTopics: profile.recentTopics || [],
      updatedAt: serverTimestamp(),
    }, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function loadUserProfileFromFirestore(userId: string): Promise<Partial<StudentProfile> | null> {
  const path = `users/${userId}`;
  try {
    const userDocRef = doc(db, 'users', userId);
    const snap = await getDoc(userDocRef);
    if (!snap.exists()) return null;
    return snap.data() as Partial<StudentProfile>;
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, path);
  }
}

export async function saveAssessmentResultToFirestore(
  userId: string,
  result: AssessmentResult,
  topicTitle: string
): Promise<void> {
  const safeId = `asm_${Date.now()}`;
  const path = `users/${userId}/assessments/${safeId}`;
  try {
    const asmRef = doc(db, 'users', userId, 'assessments', safeId);
    await setDoc(asmRef, {
      assessmentId: safeId,
      topicTitle,
      scorePercent: result.scorePercent,
      masteryLevel: result.masteryLevel,
      totalQuestions: result.totalQuestions,
      correctCount: result.correctCount,
      keyInsights: result.keyInsights || [],
      validatedStrengths: result.validatedStrengths || [],
      detectedGaps: result.detectedGaps || [],
      pathAdjustments: result.pathAdjustments || [],
      createdAt: serverTimestamp(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
}

export async function loadUserAssessmentHistory(userId: string): Promise<any[]> {
  const path = `users/${userId}/assessments`;
  try {
    const colRef = collection(db, 'users', userId, 'assessments');
    const snap = await getDocs(colRef);
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
  }
}
