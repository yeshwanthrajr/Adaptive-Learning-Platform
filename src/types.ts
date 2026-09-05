export type LearningStyle = 'visual' | 'auditory' | 'kinesthetic' | 'reading-writing' | 'conceptual' | 'hands-on';

export type PacingPreference = 'accelerated' | 'standard' | 'deep-dive';

export type SkillLevel = 'beginner' | 'intermediate' | 'advanced';

export type GoalCategory = 'course-mastery' | 'exam-prep' | 'certification' | 'career-bootcamp' | 'academic-research';

export interface AcademicGoal {
  category: GoalCategory;
  title: string;
  targetMasteryPercent: number;
  targetTimeline: string;
  prioritySubtopics: string[];
}

export interface StudentProfile {
  id: string;
  name: string;
  avatar: string;
  headline: string;
  learningStyle: LearningStyle;
  pacing: PacingPreference;
  primaryInterest: string;
  secondaryInterests: string[];
  interestEmoji: string;
  skillLevel: SkillLevel;
  academicGoal: AcademicGoal;
  currentStreakDays: number;
  completedModulesCount: number;
  overallMasteryScore: number;
  recentTopics: string[];
  subSkillMasteries: Record<string, number>;
  diagnosedMisconceptions: Array<{
    id: string;
    concept: string;
    description: string;
    detectedAt: string;
    resolved: boolean;
  }>;
}

export interface AssessmentOption {
  id: string;
  text: string;
  isCorrect: boolean;
  explanation: string;
  misconceptionIdentified?: string;
}

export interface AssessmentQuestion {
  id: string;
  prompt: string;
  contextScenario?: string;
  codeSnippet?: string;
  diagramAscii?: string;
  options: AssessmentOption[];
  hints: string[];
  conceptTag: string;
  difficulty: 1 | 2 | 3 | 4 | 5;
  targetMisconceptionProbe?: string;
}

export interface AssessmentAttempt {
  questionId: string;
  selectedOptionId: string;
  isCorrect: boolean;
  hintsUsed: number;
  timeSpentSeconds: number;
  confidenceRating?: 'high' | 'medium' | 'low';
  difficultyAtAttempt: number;
  conceptTag: string;
  misconceptionTriggered?: string;
  misconceptionDetected?: string;
}

export interface AssessmentResult {
  scorePercent: number;
  totalQuestions: number;
  correctCount: number;
  masteryLevel: 'Novice' | 'Developing' | 'Proficient' | 'Advanced' | 'Master';
  difficultyTrajectory: number[];
  keyInsights: string[];
  validatedStrengths: string[];
  detectedGaps: Array<{
    concept: string;
    severity: 'critical' | 'moderate' | 'minor';
    misconception: string;
    remediationAction: string;
  }>;
  pathAdjustments: string[];
  detailedFeedback: string;
}

export interface CuratedResource {
  id: string;
  title: string;
  format: 'article' | 'video' | 'exercise' | 'simulation';
  source: string;
  url?: string;
  estimatedTime: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  matchingInterest: string;
  targetedGap?: string;
  relevanceScore: number;
  whyRecommended: string;
  keyTakeaways: string[];
  summary: string;
  interactiveExerciseSnippet?: {
    prompt: string;
    options: string[];
    correctIndex: number;
    explanation: string;
  };
  isCompleted?: boolean;
  isBookmarked?: boolean;
}

export type CuratedStudyMaterial = CuratedResource;

export interface LearningModuleNode {
  id: string;
  title: string;
  description: string;
  status: 'completed' | 'in-progress' | 'recommended' | 'locked';
  difficultyLevel: 1 | 2 | 3 | 4 | 5;
  estimatedMinutes: number;
  learningStyleFocus: LearningStyle;
  interestHook: string;
  keyConcepts: string[];
  prerequisites: string[];
  isPrerequisiteRefresher?: boolean;
  isFastTracked?: boolean;
  masteryScore?: number;
}

export interface LearningPath {
  id: string;
  topicTitle: string;
  topicCategory: string;
  targetGoal: string;
  rationale: string;
  adaptationSummary: {
    styleEmphasis: string;
    interestContext: string;
    paceAdjustment: string;
    gapFocus: string;
  };
  modules: LearningModuleNode[];
  overallProgress: number;
}

export interface StudyResource {
  id: string;
  moduleId: string;
  title: string;
  type: 'concept-breakdown' | 'interactive-lab' | 'cheatsheet' | 'reframe';
  content: {
    summary: string;
    coreExplanation: string;
    interestAnalogy: string;
    visualSchematic?: string;
    interactiveExercise?: {
      challengePrompt: string;
      options?: string[];
      correctAnswer?: string;
      solutionExplanation: string;
    };
    bulletKeyTakeaways: string[];
    commonPitfalls: string[];
  };
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'tutor';
  text: string;
  timestamp: string;
  interestAnalogyUsed?: boolean;
  modelUsed?: string;
  groundingSources?: Array<{ uri: string; title: string }>;
}
