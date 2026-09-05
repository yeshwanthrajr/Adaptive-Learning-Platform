import React, { useState, useEffect } from 'react';
import { 
  StudentProfile, 
  LearningPath, 
  LearningModuleNode, 
  AssessmentQuestion, 
  StudyResource, 
  AssessmentResult, 
  AssessmentAttempt 
} from './types';
import { 
  PRESET_STUDENTS, 
  SAMPLE_LEARNING_PATH_CS, 
  SAMPLE_QUESTIONS_ALEX, 
  SAMPLE_STUDY_RESOURCE_ALEX 
} from './data/defaultData';
import { Header } from './components/Header';
import { ProfileModal } from './components/ProfileModal';
import { PathView } from './components/PathView';
import { AssessmentView } from './components/AssessmentView';
import { StudyResourceView } from './components/StudyResourceView';
import { AnalyticsView } from './components/AnalyticsView';
import { TutorChatDrawer } from './components/TutorChatDrawer';
import { auth, googleProvider, signInWithPopup, signOut } from './lib/firebase';
import { onAuthStateChanged, User } from 'firebase/auth';
import {
  saveUserProfileToFirestore,
  loadUserProfileFromFirestore,
  saveAssessmentResultToFirestore,
} from './lib/userDataService';

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [allStudents, setAllStudents] = useState<StudentProfile[]>(PRESET_STUDENTS);
  const [currentStudent, setCurrentStudent] = useState<StudentProfile>(PRESET_STUDENTS[0]);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'path' | 'assessment' | 'resources' | 'analytics'>('path');
  
  const [learningPath, setLearningPath] = useState<LearningPath>(SAMPLE_LEARNING_PATH_CS);
  const [selectedModule, setSelectedModule] = useState<LearningModuleNode | null>(
    SAMPLE_LEARNING_PATH_CS.modules[1] // Default to the scaffold refresher module
  );
  const [questions, setQuestions] = useState<AssessmentQuestion[]>(SAMPLE_QUESTIONS_ALEX);
  const [studyResource, setStudyResource] = useState<StudyResource>(SAMPLE_STUDY_RESOURCE_ALEX);
  
  const [isTutorOpen, setIsTutorOpen] = useState(false);
  const [tutorInitialPrompt, setTutorInitialPrompt] = useState<string | undefined>(undefined);
  const [focusedGap, setFocusedGap] = useState<string | null>(null);
  const [isGeneratingPath, setIsGeneratingPath] = useState(false);
  const [isGeneratingAssessment, setIsGeneratingAssessment] = useState(false);
  const [isReframingResource, setIsReframingResource] = useState(false);

  // Listen to Firebase Auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        try {
          const remoteProfile = await loadUserProfileFromFirestore(currentUser.uid);
          if (remoteProfile) {
            const merged: StudentProfile = {
              ...currentStudent,
              ...remoteProfile,
              name: remoteProfile.name || currentUser.displayName || currentStudent.name,
              avatar: currentUser.photoURL || currentStudent.avatar,
            };
            setCurrentStudent(merged);
            setAllStudents((prev) => [merged, ...prev.filter((p) => p.id !== merged.id)]);
          } else {
            // First time sign-in: sync initial student profile to Firestore
            const initialSyncProfile: StudentProfile = {
              ...currentStudent,
              name: currentUser.displayName || currentStudent.name,
              avatar: currentUser.photoURL || currentStudent.avatar,
            };
            setCurrentStudent(initialSyncProfile);
            await saveUserProfileToFirestore(currentUser.uid, initialSyncProfile);
          }
        } catch (err) {
          console.error('Error synchronizing profile with Firestore:', err);
        }
      }
    });
    return () => unsubscribe();
  }, []);

  const handleSignIn = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (err) {
      console.error('Sign in failed:', err);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      setUser(null);
    } catch (err) {
      console.error('Sign out failed:', err);
    }
  };

  // When student profile changes (e.g. switched to Maya or Marcus, or preferences edited),
  // automatically adapt active pathway, study resource, and assessments!
  const handleSelectStudent = async (student: StudentProfile) => {
    setCurrentStudent(student);

    // Adapt learning path for new student persona
    const updatedModules = learningPath.modules.map((m, idx) => ({
      ...m,
      learningStyleFocus: student.learningStyle,
      interestHook: `Applied through ${student.primaryInterest}: analyzing real-world systems`,
    }));

    setLearningPath({
      ...learningPath,
      rationale: `Calibrated for ${student.name} (${student.learningStyle.toUpperCase()} learner): Emphasizing ${student.learningStyle} representations, ${student.pacing} pacing, and real-world ${student.primaryInterest} applications.`,
      adaptationSummary: {
        styleEmphasis: `${student.learningStyle.toUpperCase()} representations & ${student.learningStyle === 'visual' ? 'spatial diagrams' : (student.learningStyle === 'hands-on' || student.learningStyle === 'kinesthetic') ? 'interactive labs' : 'first-principles analogies'}`,
        interestContext: `Every problem contextualized with ${student.primaryInterest} ${student.interestEmoji}`,
        paceAdjustment: `${student.pacing === 'accelerated' ? 'Accelerated cadence' : student.pacing === 'deep-dive' ? 'Deep-dive with thorough practice' : 'Standard balanced pace'}`,
        gapFocus: `Targeted cognitive scaffolds inserted dynamically`,
      },
      modules: updatedModules,
    });

    // Adapt the active study resource for the new student
    try {
      setIsReframingResource(true);
      const res = await fetch('/api/study-resource/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: learningPath.topicTitle,
          conceptTitle: selectedModule?.title || 'Core Fundamentals',
          studentProfile: student,
        }),
      });
      const data = await res.json();
      if (data.success && data.resource) {
        setStudyResource(data.resource);
      }
    } catch (e) {
      console.error('Error auto-adapting study resource:', e);
    } finally {
      setIsReframingResource(false);
    }
  };

  const handleSaveStudentProfile = async (updated: StudentProfile) => {
    setAllStudents((prev) =>
      prev.map((s) => (s.id === updated.id ? updated : s))
    );
    handleSelectStudent(updated);
    if (user) {
      try {
        await saveUserProfileToFirestore(user.uid, updated);
      } catch (err) {
        console.error('Failed to save profile to Firestore:', err);
      }
    }
  };

  // Generate a new custom path using AI
  const handleGenerateCustomPath = async (topic: string) => {
    setIsGeneratingPath(true);
    try {
      const res = await fetch('/api/learning-path/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentProfile: currentStudent,
          topic,
        }),
      });

      const data = await res.json();
      if (data.success && data.path) {
        setLearningPath(data.path);
        if (data.path.modules && data.path.modules.length > 0) {
          setSelectedModule(data.path.modules[0]);
        }
      }
    } catch (err) {
      console.error('Failed to generate path:', err);
    } finally {
      setIsGeneratingPath(false);
    }
  };

  // Launch assessment for a module
  const handleLaunchAssessment = async (module: LearningModuleNode) => {
    setSelectedModule(module);
    setActiveTab('assessment');
    setIsGeneratingAssessment(true);

    try {
      const res = await fetch('/api/assessment/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: learningPath.topicTitle,
          moduleTitle: module.title,
          difficultyLevel: module.difficultyLevel,
          studentProfile: currentStudent,
          count: 3,
        }),
      });

      const data = await res.json();
      if (data.success && data.questions && data.questions.length > 0) {
        setQuestions(data.questions);
      }
    } catch (err) {
      console.error('Failed to load questions:', err);
    } finally {
      setIsGeneratingAssessment(false);
    }
  };

  // Launch study resource for a module
  const handleLaunchStudyResource = async (module: LearningModuleNode) => {
    setSelectedModule(module);
    setActiveTab('resources');
    setIsReframingResource(true);

    try {
      const res = await fetch('/api/study-resource/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: learningPath.topicTitle,
          conceptTitle: module.title,
          studentProfile: currentStudent,
          resourceType: 'concept-breakdown',
        }),
      });

      const data = await res.json();
      if (data.success && data.resource) {
        setStudyResource(data.resource);
      }
    } catch (err) {
      console.error('Failed to load study resource:', err);
    } finally {
      setIsReframingResource(false);
    }
  };

  // Reframe the current study resource to any custom interest
  const handleReframeResource = async (customInterest: string) => {
    setIsReframingResource(true);
    try {
      const res = await fetch('/api/study-resource/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: learningPath.topicTitle,
          conceptTitle: selectedModule?.title || 'Core Concept',
          studentProfile: currentStudent,
          interestReframe: customInterest,
        }),
      });

      const data = await res.json();
      if (data.success && data.resource) {
        setStudyResource(data.resource);
      }
    } catch (err) {
      console.error('Failed to reframe resource:', err);
    } finally {
      setIsReframingResource(false);
    }
  };

  // When assessment is completed, adapt student stats and learning path
  const handleAssessmentCompleted = async (result: AssessmentResult, attempts: AssessmentAttempt[]) => {
    // 1. Update student stats
    const updatedScore = Math.round((currentStudent.overallMasteryScore * 0.7) + (result.scorePercent * 0.3));
    const updatedStudent: StudentProfile = {
      ...currentStudent,
      overallMasteryScore: updatedScore,
      completedModulesCount: currentStudent.completedModulesCount + 1,
      currentStreakDays: currentStudent.currentStreakDays + 1,
    };
    setCurrentStudent(updatedStudent);

    // Persist assessment result and updated profile to Firestore if signed in
    if (user) {
      try {
        await saveAssessmentResultToFirestore(user.uid, result, learningPath.topicTitle);
        await saveUserProfileToFirestore(user.uid, updatedStudent);
      } catch (err) {
        console.error('Failed to sync assessment result to Firestore:', err);
      }
    }

    // 2. Mark active module as completed or update path
    if (selectedModule) {
      const updatedModules = learningPath.modules.map((m) => {
        if (m.id === selectedModule.id) {
          return {
            ...m,
            status: 'completed' as const,
            masteryScore: result.scorePercent,
          };
        }
        return m;
      });

      setLearningPath({
        ...learningPath,
        modules: updatedModules,
      });
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9F4] text-[#2D2D2A] flex flex-col antialiased">
      {/* Top Header */}
      <Header
        currentStudent={currentStudent}
        allStudents={allStudents}
        onSelectStudent={handleSelectStudent}
        onOpenProfileModal={() => setIsProfileModalOpen(true)}
        activeTab={activeTab}
        onChangeTab={setActiveTab}
        onOpenTutor={() => setIsTutorOpen(true)}
        isTutorOpen={isTutorOpen}
        user={user}
        onSignIn={handleSignIn}
        onSignOut={handleSignOut}
      />

      {/* Main Content View Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {activeTab === 'path' && (
          <PathView
            learningPath={learningPath}
            currentStudent={currentStudent}
            onSelectModule={(mod) => setSelectedModule(mod)}
            onLaunchAssessment={handleLaunchAssessment}
            onLaunchStudyResource={handleLaunchStudyResource}
            onGenerateCustomPath={handleGenerateCustomPath}
            isGenerating={isGeneratingPath}
          />
        )}

        {activeTab === 'assessment' && (
          <AssessmentView
            questions={questions}
            currentStudent={currentStudent}
            activeModule={selectedModule}
            onAssessmentCompleted={handleAssessmentCompleted}
            onReturnToPath={() => setActiveTab('path')}
            onGenerateNewAssessment={(diff) => {
              if (selectedModule) return handleLaunchAssessment(selectedModule);
              return Promise.resolve();
            }}
            onExploreRemedialResources={(gapConcept) => {
              setFocusedGap(gapConcept || null);
              setActiveTab('resources');
            }}
            isGeneratingNew={isGeneratingAssessment}
          />
        )}

        {activeTab === 'resources' && (
          <StudyResourceView
            resource={studyResource}
            currentStudent={currentStudent}
            activeModule={selectedModule}
            onLaunchAssessment={handleLaunchAssessment}
            onOpenTutor={(prompt) => {
              setTutorInitialPrompt(prompt);
              setIsTutorOpen(true);
            }}
            onReframeResource={handleReframeResource}
            isReframing={isReframingResource}
            focusedGap={focusedGap}
          />
        )}

        {activeTab === 'analytics' && (
          <AnalyticsView
            currentStudent={currentStudent}
            onOpenProfileModal={() => setIsProfileModalOpen(true)}
          />
        )}
      </main>

      {/* Socratic AI Study Coach Drawer */}
      <TutorChatDrawer
        isOpen={isTutorOpen}
        onClose={() => {
          setIsTutorOpen(false);
          setTutorInitialPrompt(undefined);
        }}
        currentStudent={currentStudent}
        currentTopic={learningPath.topicTitle}
        activeModule={selectedModule}
        initialPrompt={tutorInitialPrompt}
      />

      {/* Profile & Learning Preferences Modal */}
      <ProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        student={currentStudent}
        onSaveStudent={handleSaveStudentProfile}
      />

      {/* Footer Info */}
      <footer className="border-t border-[#E0D8D0] bg-white/70 py-4 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-[#2D2D2A]/60">
          <div className="flex items-center gap-2">
            <span className="font-serif font-bold text-[#5A5A40]">AuraLearn Adaptive Engine</span>
            <span>•</span>
            <span className="font-serif italic">Dynamic Pathways, Diagnostic Misconceptions & Contextual Reframing</span>
          </div>
          <div>
            Active Learner: <span className="font-bold text-[#2D2D2A]">{currentStudent.name}</span> ({currentStudent.learningStyle.toUpperCase()} • {currentStudent.primaryInterest})
          </div>
        </div>
      </footer>
    </div>
  );
}
