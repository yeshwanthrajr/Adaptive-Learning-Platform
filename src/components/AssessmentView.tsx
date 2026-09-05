import React, { useState } from 'react';
import { 
  AssessmentQuestion, 
  AssessmentAttempt, 
  AssessmentResult, 
  StudentProfile, 
  LearningModuleNode 
} from '../types';
import { 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  Award, 
  Lightbulb, 
  ArrowRight, 
  RotateCcw, 
  Sparkles, 
  Compass, 
  Check, 
  Zap, 
  TrendingUp, 
  TrendingDown, 
  ShieldAlert, 
  BookOpen,
  Activity,
  Gauge
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface AssessmentViewProps {
  questions: AssessmentQuestion[];
  currentStudent: StudentProfile;
  activeModule?: LearningModuleNode | null;
  onAssessmentCompleted: (result: AssessmentResult, attempts: AssessmentAttempt[]) => void;
  onReturnToPath: () => void;
  onGenerateNewAssessment: (difficultyLevel: number) => Promise<void>;
  onExploreRemedialResources?: (gapConcept?: string) => void;
  isGeneratingNew: boolean;
}

interface TrajectoryStep {
  step: number;
  difficulty: number;
  isCorrect: boolean;
  confidence: 'low' | 'medium' | 'high';
  conceptTag: string;
  branchType: 'level-up' | 'diagnostic-scaffold' | 'reinforce' | 'initial';
  reason?: string;
}

export const AssessmentView: React.FC<AssessmentViewProps> = ({
  questions: initialQuestions,
  currentStudent,
  activeModule,
  onAssessmentCompleted,
  onReturnToPath,
  onGenerateNewAssessment,
  onExploreRemedialResources,
  isGeneratingNew,
}) => {
  const [activeQuestions, setActiveQuestions] = useState<AssessmentQuestion[]>(initialQuestions);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [confidenceRating, setConfidenceRating] = useState<'low' | 'medium' | 'high'>('medium');
  const [hasSubmittedCurrent, setHasSubmittedCurrent] = useState(false);
  const [revealedHintIndex, setRevealedHintIndex] = useState(-1);
  const [attempts, setAttempts] = useState<AssessmentAttempt[]>([]);
  const [assessmentResult, setAssessmentResult] = useState<AssessmentResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isLoadingNextStep, setIsLoadingNextStep] = useState(false);
  
  // Real-time Adaptive Engine State
  const [currentDifficulty, setCurrentDifficulty] = useState<number>(
    initialQuestions[0]?.difficulty || activeModule?.difficultyLevel || 3
  );
  const [trajectory, setTrajectory] = useState<TrajectoryStep[]>([]);
  const [adaptiveFeedbackNotice, setAdaptiveFeedbackNotice] = useState<{
    type: 'level-up' | 'diagnostic-scaffold' | 'reinforce';
    message: string;
    newDifficulty: number;
  } | null>(null);

  const currentQ = activeQuestions[currentIndex];

  const handleSelectOption = (optionId: string) => {
    if (hasSubmittedCurrent) return;
    setSelectedOptionId(optionId);
  };

  const handleSubmitAnswer = () => {
    if (!selectedOptionId || hasSubmittedCurrent || !currentQ) return;
    setHasSubmittedCurrent(true);

    const chosenOption = currentQ.options.find((o) => o.id === selectedOptionId);
    const isCorrect = Boolean(chosenOption?.isCorrect);

    if (isCorrect) {
      confetti({
        particleCount: 40,
        spread: 60,
        origin: { y: 0.7 },
      });
    }

    const newAttempt: AssessmentAttempt = {
      questionId: currentQ.id,
      selectedOptionId,
      isCorrect,
      hintsUsed: revealedHintIndex + 1,
      timeSpentSeconds: 25,
      confidenceRating,
      difficultyAtAttempt: currentQ.difficulty || currentDifficulty,
      conceptTag: currentQ.conceptTag || 'Core Concept',
      misconceptionDetected: !isCorrect ? chosenOption?.misconceptionIdentified : undefined,
    };

    const updatedAttempts = [...attempts, newAttempt];
    setAttempts(updatedAttempts);

    // Compute dynamic difficulty calibration for next step
    let nextDiff = currentQ.difficulty || currentDifficulty;
    let branch: 'level-up' | 'diagnostic-scaffold' | 'reinforce' = 'reinforce';
    let noticeMessage = '';

    if (isCorrect && confidenceRating === 'high') {
      nextDiff = Math.min(5, nextDiff + 1);
      branch = 'level-up';
      noticeMessage = `🎯 High-confidence mastery demonstrated! Calibrating difficulty up to Level ${nextDiff} to probe higher-order conceptual boundaries.`;
    } else if (isCorrect && confidenceRating === 'low') {
      branch = 'reinforce';
      noticeMessage = `💡 Correct answer, but low confidence flagged. Maintaining difficulty at Level ${nextDiff} to solidify conceptual foundations.`;
    } else if (!isCorrect && confidenceRating === 'high') {
      // High-confidence error indicates a deep-seated cognitive blind spot!
      nextDiff = Math.max(1, nextDiff - 1);
      branch = 'diagnostic-scaffold';
      noticeMessage = `⚠️ Cognitive blindspot detected: high confidence with incorrect response. Decreasing difficulty to Level ${nextDiff} and activating targeted misconception scaffold.`;
    } else {
      nextDiff = Math.max(1, nextDiff - 1);
      branch = 'diagnostic-scaffold';
      noticeMessage = `🔍 Knowledge gap detected. Adjusting difficulty to Level ${nextDiff} to scaffold core mechanics.`;
    }

    setAdaptiveFeedbackNotice({
      type: branch,
      message: noticeMessage,
      newDifficulty: nextDiff,
    });

    setTrajectory((prev) => [
      ...prev,
      {
        step: currentIndex + 1,
        difficulty: currentQ.difficulty || currentDifficulty,
        isCorrect,
        confidence: confidenceRating,
        conceptTag: currentQ.conceptTag,
        branchType: branch,
        reason: noticeMessage,
      },
    ]);
  };

  const handleNextQuestion = async () => {
    const TARGET_ASSESSMENT_LENGTH = 4;

    if (currentIndex < TARGET_ASSESSMENT_LENGTH - 1) {
      setIsLoadingNextStep(true);
      try {
        const lastAttempt = attempts[attempts.length - 1];
        const nextTargetDiff = adaptiveFeedbackNotice?.newDifficulty || currentDifficulty;

        // Fetch dynamically adjusted question from real-time CAT endpoint
        const res = await fetch('/api/assessment/adaptive-step', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            topic: activeModule?.title || 'Data Structures & Algorithms',
            currentQuestionNumber: currentIndex + 2,
            targetDifficulty: nextTargetDiff,
            previousAttempts: attempts,
            lastWasCorrect: lastAttempt?.isCorrect,
            lastConfidence: lastAttempt?.confidenceRating,
            lastMisconception: lastAttempt?.misconceptionDetected,
            studentProfile: currentStudent,
          }),
        });

        const data = await res.json();
        if (data.success && data.nextQuestion) {
          setActiveQuestions((prev) => [...prev, data.nextQuestion]);
          setCurrentDifficulty(data.targetDifficulty || nextTargetDiff);
        } else if (currentIndex < activeQuestions.length - 1) {
          // Fallback to pre-generated array
          setCurrentDifficulty(activeQuestions[currentIndex + 1].difficulty);
        }
      } catch (err) {
        console.error('Error fetching adaptive step:', err);
      } finally {
        setIsLoadingNextStep(false);
        setCurrentIndex((prev) => prev + 1);
        setSelectedOptionId(null);
        setHasSubmittedCurrent(false);
        setRevealedHintIndex(-1);
        setConfidenceRating('medium');
        setAdaptiveFeedbackNotice(null);
      }
    } else {
      // Analyze all attempts
      setIsAnalyzing(true);
      try {
        const res = await fetch('/api/assessment/analyze', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            questions: activeQuestions,
            attempts,
            studentProfile: currentStudent,
            topic: activeModule?.title || 'Data Structures & Algorithms',
          }),
        });
        const data = await res.json();
        if (data.success && data.result) {
          setAssessmentResult(data.result);
          onAssessmentCompleted(data.result, attempts);
        }
      } catch (err) {
        console.error('Failed to analyze assessment:', err);
      } finally {
        setIsAnalyzing(false);
      }
    }
  };

  const handleRestartQuiz = () => {
    setActiveQuestions(initialQuestions);
    setCurrentIndex(0);
    setSelectedOptionId(null);
    setConfidenceRating('medium');
    setHasSubmittedCurrent(false);
    setRevealedHintIndex(-1);
    setAttempts([]);
    setTrajectory([]);
    setAssessmentResult(null);
    setAdaptiveFeedbackNotice(null);
    setCurrentDifficulty(initialQuestions[0]?.difficulty || 3);
  };

  // If Assessment is Complete and Result is ready
  if (assessmentResult) {
    const isHighMastery = assessmentResult.scorePercent >= 75;
    return (
      <div className="max-w-3xl mx-auto space-y-6 animate-in fade-in zoom-in-95 duration-200">
        <div className="bg-white rounded-[32px] p-6 sm:p-8 border border-[#E0D8D0] shadow-sm text-center relative overflow-hidden">
          <div className="w-16 h-16 rounded-2xl bg-[#E8F0E0] text-[#5A5A40] flex items-center justify-center mx-auto mb-4 shadow-2xs border border-[#B5BAA1]/40">
            <Award className="w-8 h-8" />
          </div>

          <span className="text-[10px] uppercase font-bold text-[#5A5A40] tracking-widest">
            Diagnostic Calibration & Knowledge Gap Analysis
          </span>

          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#2D2D2A] mt-1 mb-2">
            Mastery Tier: {assessmentResult.masteryLevel}
          </h2>

          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#F5F5F0] border border-[#E0D8D0] font-serif italic text-sm text-[#5A5A40] mb-4">
            <span>Score: {assessmentResult.scorePercent}%</span>
            <span>•</span>
            <span>{assessmentResult.correctCount} of {assessmentResult.totalQuestions} Questions</span>
            <span>•</span>
            <span>Calibrated Boundary: Level {currentDifficulty}/5</span>
          </div>

          <p className="text-xs sm:text-sm text-[#2D2D2A]/70 max-w-xl mx-auto leading-relaxed mb-6 font-serif italic">
            {assessmentResult.detailedFeedback}
          </p>

          {/* Computerized Adaptive Testing Trajectory */}
          {trajectory.length > 0 && (
            <div className="mb-6 p-4 rounded-2xl bg-[#F5F5F0] border border-[#E0D8D0] text-left">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-bold text-[#5A5A40] uppercase tracking-wider flex items-center gap-1.5">
                  <Gauge className="w-3.5 h-3.5 text-[#D4A373]" />
                  Real-Time Difficulty Adjustment Trajectory
                </span>
                <span className="text-[11px] text-[#2D2D2A]/60 font-serif italic">
                  Dynamic CAT Calibration
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {trajectory.map((step) => (
                  <div 
                    key={step.step}
                    className={`p-3 rounded-xl border text-xs flex flex-col justify-between ${
                      step.isCorrect 
                        ? 'bg-[#E8F0E0]/60 border-[#B5BAA1]/60' 
                        : 'bg-[#FDF6E2]/70 border-[#E4D19E]'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-[#2D2D2A]">Q{step.step}</span>
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md ${
                        step.isCorrect ? 'bg-[#5A5A40] text-white' : 'bg-[#D4A373] text-white'
                      }`}>
                        Level {step.difficulty}
                      </span>
                    </div>
                    <div className="text-[11px] font-medium text-[#2D2D2A]/80 line-clamp-1 mb-1">
                      {step.conceptTag}
                    </div>
                    <div className="text-[10px] flex items-center justify-between text-[#2D2D2A]/60 pt-1 border-t border-black/5">
                      <span>{step.isCorrect ? '✓ Correct' : '✗ Incorrect'}</span>
                      <span className="capitalize italic">{step.confidence} conf.</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Detailed Strengths & Detected Knowledge Gaps */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left mb-6">
            {/* Strengths */}
            <div className="p-4 rounded-2xl bg-[#E8F0E0] border border-[#B5BAA1]/50">
              <span className="text-[10px] font-bold text-[#5A5A40] uppercase tracking-wider block mb-2 flex items-center gap-1.5">
                <Check className="w-4 h-4 text-[#5A5A40]" />
                Validated Knowledge Strengths
              </span>
              <ul className="space-y-2">
                {assessmentResult.keyInsights.map((insight, i) => (
                  <li key={i} className="text-xs text-[#2D2D2A] flex items-start gap-2 bg-white/70 p-2 rounded-xl border border-[#B5BAA1]/40">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#5A5A40] shrink-0 mt-1.5"></span>
                    <span>{insight}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Diagnosed Knowledge Gaps & Misconceptions */}
            <div className="p-4 rounded-2xl bg-[#FDF6E2] border border-[#E4D19E]">
              <span className="text-[10px] font-bold text-[#8C6B1C] uppercase tracking-wider block mb-2 flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4 text-[#D4A373]" />
                Diagnosed Knowledge Gaps & Misconceptions
              </span>
              {assessmentResult.detectedGaps.length > 0 ? (
                <div className="space-y-2">
                  {assessmentResult.detectedGaps.map((gap, i) => (
                    <div key={i} className="text-xs bg-white/90 p-2.5 rounded-xl border border-[#E4D19E] space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-[#8C6B1C]">{gap}</span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#FDF6E2] text-[#8C6B1C] font-semibold border border-[#E4D19E]">
                          Scaffold Priority
                        </span>
                      </div>
                      <p className="text-[11px] text-[#2D2D2A]/70 font-serif italic">
                        Targeted for remedial study materials and guided drills.
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-[#5A5A40] font-medium font-serif italic p-3 bg-white/60 rounded-xl">
                  Zero critical misconceptions detected! Mastery verified across all tested concepts.
                </p>
              )}
            </div>
          </div>

          {/* Curriculum Path Adaptations */}
          <div className="p-4 sm:p-5 rounded-2xl bg-[#F5F5F0] border border-[#E0D8D0] text-left mb-6">
            <div className="flex items-center gap-2 text-xs font-bold text-[#5A5A40] mb-2 uppercase tracking-wide">
              <Sparkles className="w-4 h-4 text-[#5A5A40]" />
              <span>Real-Time Curriculum Adaptation Triggered</span>
            </div>
            <div className="space-y-1.5">
              {assessmentResult.pathAdjustments.map((adj, i) => (
                <div key={i} className="text-xs text-[#2D2D2A] font-medium flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#5A5A40] shrink-0"></span>
                  <span>{adj}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            {onExploreRemedialResources && assessmentResult.detectedGaps.length > 0 && (
              <button
                id="btn-curate-gap-resources"
                onClick={() => onExploreRemedialResources(assessmentResult.detectedGaps[0])}
                className="w-full sm:w-auto px-6 py-3 rounded-2xl text-xs font-bold uppercase tracking-wider text-white bg-[#5A5A40] hover:bg-[#464632] shadow-xs transition-all flex items-center justify-center gap-2"
              >
                <BookOpen className="w-4 h-4 text-[#D4A373]" />
                <span>Curate Resources for Gaps</span>
              </button>
            )}

            <button
              onClick={onReturnToPath}
              className="w-full sm:w-auto px-5 py-3 rounded-2xl text-xs font-bold uppercase tracking-wider text-[#2D2D2A] bg-white hover:bg-[#F5F5F0] border border-[#E0D8D0] shadow-2xs transition-all flex items-center justify-center gap-2"
            >
              <Compass className="w-4 h-4" />
              <span>Return to Learning Path</span>
            </button>

            <button
              onClick={handleRestartQuiz}
              className="w-full sm:w-auto px-4 py-3 rounded-2xl text-xs font-bold uppercase tracking-wider text-[#5A5A40] hover:bg-[#EAE8E1] transition-all flex items-center justify-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Retake</span>
            </button>
          </div>

        </div>
      </div>
    );
  }

  // Loading state when analyzing results
  if (isAnalyzing) {
    return (
      <div className="max-w-xl mx-auto text-center py-20 space-y-4">
        <div className="w-12 h-12 rounded-2xl bg-[#E8F0E0] border border-[#B5BAA1]/40 text-[#5A5A40] flex items-center justify-center mx-auto animate-pulse">
          <Sparkles className="w-6 h-6" />
        </div>
        <h3 className="text-base font-serif font-bold text-[#2D2D2A]">Calibrating Knowledge Gaps & Cognitive Diagnoses...</h3>
        <p className="text-xs text-[#2D2D2A]/60 font-serif italic">
          Evaluating confidence ratings, difficulty thresholds, and distractor selections to synthesize student strengths.
        </p>
      </div>
    );
  }

  if (!currentQ) {
    return (
      <div className="max-w-xl mx-auto text-center py-16 bg-white rounded-[32px] p-8 border border-[#E0D8D0]">
        <h3 className="text-base font-serif font-bold text-[#2D2D2A]">Adaptive Question Bank Ready</h3>
        <p className="text-xs text-[#2D2D2A]/60 mt-1 mb-4 font-serif italic">
          Launch an assessment calibrated to {currentStudent.name}'s current skill level.
        </p>
        <button
          onClick={() => onGenerateNewAssessment(currentDifficulty)}
          className="px-5 py-2.5 rounded-2xl text-xs font-bold uppercase tracking-wider text-white bg-[#5A5A40] hover:bg-[#464632]"
        >
          Begin Adaptive Checkpoint
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-5 animate-in fade-in duration-150">
      
      {/* Real-time Adaptive Status Bar */}
      <div className="bg-white rounded-[28px] p-4 sm:p-5 border border-[#E0D8D0] shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold text-[#5A5A40] uppercase tracking-wider flex items-center gap-1">
                <Activity className="w-3.5 h-3.5 text-[#D4A373]" />
                Adaptive CAT Diagnostic Engine
              </span>
              <span className="text-xs text-[#2D2D2A]/30">•</span>
              <span className="text-xs font-serif font-semibold text-[#2D2D2A]">{currentQ.conceptTag}</span>
            </div>
            <p className="text-xs text-[#2D2D2A]/60 mt-0.5 font-serif italic">
              Anchored in <span className="font-bold text-[#2D2D2A] not-italic">{currentStudent.primaryInterest}</span> context
            </p>
          </div>

          {/* Difficulty Level Indicator */}
          <div className="flex items-center gap-3">
            <div className="text-right">
              <span className="text-[10px] font-bold text-[#2D2D2A]/50 uppercase tracking-wider block">
                Active Difficulty: Level {currentQ.difficulty || currentDifficulty}/5
              </span>
              <div className="flex items-center gap-1 mt-1 justify-end">
                {[1, 2, 3, 4, 5].map((lvl) => {
                  const active = lvl <= (currentQ.difficulty || currentDifficulty);
                  return (
                    <span
                      key={lvl}
                      className={`h-1.5 w-4 rounded-full transition-all ${
                        active ? 'bg-[#5A5A40]' : 'bg-[#E0D8D0]'
                      }`}
                    ></span>
                  );
                })}
              </div>
            </div>

            <div className="w-10 h-10 rounded-xl bg-[#F5F5F0] text-[#5A5A40] border border-[#E0D8D0] flex flex-col items-center justify-center font-bold text-xs shrink-0">
              <span>{currentIndex + 1}</span>
              <span className="text-[8px] text-[#2D2D2A]/50 -mt-1 font-medium">of 4</span>
            </div>
          </div>
        </div>

        {/* Live Trajectory Breadcrumb */}
        {trajectory.length > 0 && (
          <div className="mt-3 pt-3 border-t border-[#E0D8D0] flex items-center gap-2 overflow-x-auto text-[11px]">
            <span className="text-[10px] font-bold text-[#2D2D2A]/40 uppercase tracking-wider shrink-0">
              Path:
            </span>
            {trajectory.map((step, idx) => (
              <div key={idx} className="flex items-center gap-1 shrink-0">
                <span className={`px-2 py-0.5 rounded-md font-semibold text-[10px] flex items-center gap-1 ${
                  step.isCorrect 
                    ? 'bg-[#E8F0E0] text-[#5A5A40] border border-[#B5BAA1]/40' 
                    : 'bg-[#FDF6E2] text-[#8C6B1C] border border-[#E4D19E]'
                }`}>
                  <span>Q{step.step}: L{step.difficulty}</span>
                  <span>{step.isCorrect ? '✓' : '✗'}</span>
                </span>
                {idx < trajectory.length - 1 && <span className="text-[#2D2D2A]/30">→</span>}
              </div>
            ))}
            <span className="text-[#2D2D2A]/30">→</span>
            <span className="px-2 py-0.5 rounded-md bg-[#5A5A40] text-white font-bold text-[10px]">
              Q{currentIndex + 1}: L{currentQ.difficulty || currentDifficulty} (Current)
            </span>
          </div>
        )}
      </div>

      {/* Main Question Card */}
      <div className="bg-white rounded-[32px] p-6 sm:p-8 border border-[#E0D8D0] shadow-xs space-y-5">
        
        {/* Real-World Context Scenario */}
        {currentQ.contextScenario && (
          <div className="p-4 rounded-2xl bg-[#F5F5F0] border border-[#E0D8D0] flex items-start gap-2.5">
            <span className="text-base">{currentStudent.interestEmoji}</span>
            <div>
              <span className="text-[10px] font-bold text-[#5A5A40] uppercase tracking-wider block">
                Applied Context Scenario
              </span>
              <p className="text-xs font-semibold text-[#2D2D2A] mt-0.5">
                {currentQ.contextScenario}
              </p>
            </div>
          </div>
        )}

        {/* Prompt */}
        <h3 className="text-base sm:text-lg font-serif font-bold text-[#2D2D2A] leading-snug">
          {currentQ.prompt}
        </h3>

        {/* Visual ASCII Diagram or Code snippet */}
        {currentQ.diagramAscii && (
          <div className="rounded-2xl bg-[#2D2D2A] text-[#B5BAA1] p-4 font-mono text-xs overflow-x-auto shadow-inner border border-[#464632]">
            <div className="text-[10px] uppercase font-bold text-white/50 mb-1">Visual Schematic Flow</div>
            <pre className="leading-relaxed">{currentQ.diagramAscii}</pre>
          </div>
        )}

        {currentQ.codeSnippet && (
          <div className="rounded-2xl bg-[#2D2D2A] text-[#F8F9F4] p-4 font-mono text-xs overflow-x-auto shadow-inner border border-[#464632]">
            <pre>{currentQ.codeSnippet}</pre>
          </div>
        )}

        {/* Options List */}
        <div className="space-y-2.5">
          {currentQ.options.map((option) => {
            const isSelected = selectedOptionId === option.id;
            const showFeedback = hasSubmittedCurrent;
            const isThisCorrect = option.isCorrect;

            let optionStyle = 'border-[#E0D8D0] hover:border-[#5A5A40]/40 bg-white';
            if (isSelected && !showFeedback) {
              optionStyle = 'border-[#5A5A40] bg-[#F5F5F0] shadow-2xs ring-2 ring-[#5A5A40]/15';
            } else if (showFeedback) {
              if (isThisCorrect) {
                optionStyle = 'border-[#5A5A40] bg-[#E8F0E0] shadow-2xs';
              } else if (isSelected && !isThisCorrect) {
                optionStyle = 'border-[#D4A373] bg-[#FDF6E2] shadow-2xs';
              } else {
                optionStyle = 'border-[#E0D8D0] bg-[#F5F5F0]/60 opacity-60';
              }
            }

            return (
              <div
                key={option.id}
                onClick={() => handleSelectOption(option.id)}
                className={`p-3.5 sm:p-4 rounded-2xl border-2 transition-all cursor-pointer text-left ${optionStyle}`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 ${
                        showFeedback && isThisCorrect
                          ? 'bg-[#5A5A40] text-white'
                          : showFeedback && isSelected && !isThisCorrect
                          ? 'bg-[#D4A373] text-white'
                          : isSelected
                          ? 'bg-[#5A5A40] text-white'
                          : 'bg-[#F5F5F0] text-[#2D2D2A]/70 border border-[#E0D8D0]'
                      }`}
                    >
                      {showFeedback && isThisCorrect ? (
                        <CheckCircle2 className="w-4 h-4" />
                      ) : showFeedback && isSelected && !isThisCorrect ? (
                        <XCircle className="w-4 h-4" />
                      ) : (
                        option.id.replace('opt-', '').toUpperCase()
                      )}
                    </div>
                    <span className="text-xs sm:text-sm font-medium text-[#2D2D2A] leading-snug">
                      {option.text}
                    </span>
                  </div>
                </div>

                {/* Inline Feedback when submitted */}
                {showFeedback && isSelected && (
                  <div className="mt-3 pt-3 border-t border-[#E0D8D0]/60 space-y-2">
                    <p className="text-xs text-[#2D2D2A]/80 leading-relaxed font-serif italic">
                      {option.explanation}
                    </p>

                    {/* Identified Misconception Analysis */}
                    {!isThisCorrect && option.misconceptionIdentified && (
                      <div className="p-3 rounded-xl bg-[#FDF6E2] border border-[#E4D19E] text-[#8C6B1C] text-xs">
                        <span className="font-bold block text-[10px] uppercase tracking-wider mb-0.5">
                          Isolated Misconception:
                        </span>
                        <span>{option.misconceptionIdentified}</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Metacognitive Confidence Rating Selector */}
        {!hasSubmittedCurrent && (
          <div className="p-3.5 rounded-2xl bg-[#F8F9F4] border border-[#E0D8D0]">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold text-[#5A5A40] uppercase tracking-wider">
                Metacognitive Confidence Calibration
              </span>
              <span className="text-[11px] text-[#2D2D2A]/50 font-serif italic">
                Helps the engine distinguish lucky guesses from real mastery
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'low', label: 'Unsure / Guessing', desc: 'Need reinforcement' },
                { id: 'medium', label: 'Reasonably Confident', desc: 'Solid working theory' },
                { id: 'high', label: '100% Certain', desc: 'Ready for higher tier' },
              ].map((c) => {
                const isSelected = confidenceRating === c.id;
                return (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setConfidenceRating(c.id as any)}
                    className={`p-2 rounded-xl text-left border transition-all ${
                      isSelected
                        ? 'border-[#5A5A40] bg-[#E8F0E0] text-[#5A5A40] font-semibold ring-1 ring-[#5A5A40]'
                        : 'border-[#E0D8D0] bg-white text-[#2D2D2A]/70 hover:bg-[#F5F5F0]'
                    }`}
                  >
                    <div className="text-xs">{c.label}</div>
                    <div className="text-[10px] text-[#2D2D2A]/50 leading-none mt-0.5">{c.desc}</div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Adaptive Real-Time Adjustment Feedback Notice */}
        {hasSubmittedCurrent && adaptiveFeedbackNotice && (
          <div className={`p-4 rounded-2xl border text-xs flex items-start gap-3 animate-in fade-in duration-200 ${
            adaptiveFeedbackNotice.type === 'level-up'
              ? 'bg-[#E8F0E0] border-[#B5BAA1] text-[#5A5A40]'
              : adaptiveFeedbackNotice.type === 'diagnostic-scaffold'
              ? 'bg-[#FDF6E2] border-[#E4D19E] text-[#8C6B1C]'
              : 'bg-[#F5F5F0] border-[#E0D8D0] text-[#2D2D2A]'
          }`}>
            <Zap className="w-4 h-4 shrink-0 mt-0.5 text-[#D4A373]" />
            <div>
              <span className="font-bold block uppercase tracking-wider text-[10px] mb-0.5">
                Dynamic CAT Adjustment Triggered:
              </span>
              <p className="font-serif italic leading-relaxed">
                {adaptiveFeedbackNotice.message}
              </p>
            </div>
          </div>
        )}

        {/* Progressive Hint Ladder */}
        <div className="pt-2 border-t border-[#E0D8D0]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#5A5A40] flex items-center gap-1.5">
              <Lightbulb className="w-4 h-4 text-[#D4A373]" />
              Progressive Hint Ladder ({revealedHintIndex + 1}/{currentQ.hints.length} revealed)
            </span>
            {revealedHintIndex < currentQ.hints.length - 1 && !hasSubmittedCurrent && (
              <button
                type="button"
                onClick={() => setRevealedHintIndex((prev) => prev + 1)}
                className="text-xs font-bold text-[#5A5A40] hover:text-[#464632] underline transition-colors"
              >
                Reveal Hint {revealedHintIndex + 2}
              </button>
            )}
          </div>

          {revealedHintIndex >= 0 && (
            <div className="mt-2.5 space-y-2">
              {currentQ.hints.slice(0, revealedHintIndex + 1).map((hint, i) => (
                <div key={i} className="text-xs bg-[#FDF6E2] p-3 rounded-xl border border-[#E4D19E] text-[#8C6B1C]">
                  <span className="font-bold">Hint {i + 1}:</span> {hint}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Submit / Next Question Actions */}
        <div className="pt-4 border-t border-[#E0D8D0] flex items-center justify-between gap-4">
          <div className="text-xs text-[#2D2D2A]/50 font-medium">
            Question {currentIndex + 1} of 4 • Calibrated Difficulty: {currentQ.difficulty || currentDifficulty}
          </div>

          {!hasSubmittedCurrent ? (
            <button
              id="btn-submit-answer"
              disabled={!selectedOptionId}
              onClick={handleSubmitAnswer}
              className="px-6 py-3 rounded-2xl text-xs font-bold uppercase tracking-wider text-white bg-[#5A5A40] hover:bg-[#464632] disabled:opacity-50 shadow-xs transition-all"
            >
              Confirm Answer & Calibrate
            </button>
          ) : (
            <button
              id="btn-next-question"
              disabled={isLoadingNextStep}
              onClick={handleNextQuestion}
              className="px-6 py-3 rounded-2xl text-xs font-bold uppercase tracking-wider text-white bg-[#2D2D2A] hover:bg-[#1A1A18] transition-all flex items-center gap-1.5 shadow-xs"
            >
              {isLoadingNextStep ? (
                <span>Generating Adaptive Step...</span>
              ) : (
                <>
                  <span>{currentIndex < 3 ? 'Continue to Next Calibrated Step' : 'Synthesize Diagnostic Report'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          )}
        </div>

      </div>

    </div>
  );
};
