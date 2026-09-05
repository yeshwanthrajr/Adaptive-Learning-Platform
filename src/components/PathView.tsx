import React, { useState } from 'react';
import { LearningPath, LearningModuleNode, StudentProfile } from '../types';
import { 
  Compass, 
  CheckCircle2, 
  Lock, 
  Play, 
  Sparkles, 
  Clock, 
  AlertTriangle, 
  FastForward, 
  BookOpen, 
  FileText, 
  Plus, 
  Search, 
  ArrowRight,
  TrendingUp,
  Award
} from 'lucide-react';

interface PathViewProps {
  learningPath: LearningPath;
  currentStudent: StudentProfile;
  onSelectModule: (module: LearningModuleNode) => void;
  onLaunchAssessment: (module: LearningModuleNode) => void;
  onLaunchStudyResource: (module: LearningModuleNode) => void;
  onGenerateCustomPath: (topic: string) => Promise<void>;
  isGenerating: boolean;
}

const QUICK_TOPICS = [
  'Data Structures & Algorithms',
  'Differential Calculus & Kinematics',
  'Applied Climate Data Science',
  'Neural Networks & Deep Learning',
  'Quantum Computing Fundamentals',
];

export const PathView: React.FC<PathViewProps> = ({
  learningPath,
  currentStudent,
  onSelectModule,
  onLaunchAssessment,
  onLaunchStudyResource,
  onGenerateCustomPath,
  isGenerating,
}) => {
  const [customTopicInput, setCustomTopicInput] = useState('');
  const [activeModuleId, setActiveModuleId] = useState<string | null>(
    learningPath.modules.find((m) => m.status === 'in-progress')?.id || learningPath.modules[0]?.id || null
  );

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customTopicInput.trim() || isGenerating) return;
    onGenerateCustomPath(customTopicInput.trim());
    setCustomTopicInput('');
  };

  const completedCount = learningPath.modules.filter((m) => m.status === 'completed').length;
  const progressPercent = Math.round((completedCount / (learningPath.modules.length || 1)) * 100);

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Dynamic Topic Prompt & AI Generation Bar */}
      <div className="bg-white rounded-[28px] p-5 sm:p-6 border border-[#E0D8D0] shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-serif font-bold text-[#5A5A40] flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#D4A373]" />
              Generate Bespoke Curriculum for Any Subject
            </h2>
            <p className="text-xs text-[#2D2D2A]/70 mt-0.5 font-serif italic">
              The AI automatically calibrates difficulty, interest analogies, and prerequisite scaffolds for{' '}
              <span className="font-bold text-[#2D2D2A] not-italic">{currentStudent.name}</span>.
            </p>
          </div>

          <form onSubmit={handleGenerate} className="flex items-center gap-2 w-full lg:w-auto">
            <div className="relative flex-1 sm:w-80">
              <Search className="w-4 h-4 text-[#2D2D2A]/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={customTopicInput}
                onChange={(e) => setCustomTopicInput(e.target.value)}
                placeholder="Enter any topic (e.g. Microeconomics, Graph Theory)..."
                disabled={isGenerating}
                className="w-full pl-9 pr-3.5 py-2 text-xs rounded-xl border border-[#E0D8D0] text-[#2D2D2A] focus:outline-none focus:ring-2 focus:ring-[#5A5A40] bg-[#F8F9F4]"
              />
            </div>
            <button
              type="submit"
              disabled={isGenerating || !customTopicInput.trim()}
              className="px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider text-white bg-[#5A5A40] hover:bg-[#464632] disabled:opacity-50 transition-all shrink-0 flex items-center gap-1.5 shadow-xs"
            >
              {isGenerating ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Calibrating...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Generate Path</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Quick subject suggestions */}
        <div className="flex items-center gap-2 mt-3 pt-3 border-t border-[#E0D8D0] flex-wrap">
          <span className="text-[10px] uppercase font-bold tracking-wider text-[#2D2D2A]/50">Quick explore:</span>
          {QUICK_TOPICS.map((topic) => (
            <button
              key={topic}
              type="button"
              disabled={isGenerating}
              onClick={() => onGenerateCustomPath(topic)}
              className="text-[11px] px-3 py-1 rounded-full bg-[#F5F5F0] hover:bg-[#EAE8E1] text-[#2D2D2A]/80 border border-[#E0D8D0] font-medium transition-colors"
            >
              {topic}
            </button>
          ))}
        </div>
      </div>

      {/* Main Path Header Card */}
      <div className="bg-[#5A5A40] rounded-[32px] p-6 sm:p-8 text-white shadow-sm relative overflow-hidden border border-[#5A5A40]">
        {/* Subtle decorative warm background shapes */}
        <div className="absolute -right-8 -bottom-8 w-48 h-48 bg-[#B5BAA1] opacity-20 rounded-full blur-xl pointer-events-none"></div>
        <div className="absolute right-1/3 -top-12 w-40 h-40 bg-[#D4A373] opacity-20 rounded-full blur-xl pointer-events-none"></div>

        <div className="relative z-10">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-white/20 text-[#E8F0E0] border border-white/20">
                {learningPath.topicCategory}
              </span>
              <span className="text-xs text-white/50">•</span>
              <span className="text-xs text-white/80 font-serif italic">
                Tailored for {currentStudent.name} <span className="not-italic">{currentStudent.interestEmoji}</span>
              </span>
            </div>

            <div className="flex items-baseline gap-1 text-right">
              <span className="text-[10px] font-bold uppercase tracking-widest text-white/60">Overall Progress</span>
              <span className="text-2xl font-serif italic text-[#D4A373] ml-2">{progressPercent}%</span>
            </div>
          </div>

          <h1 className="text-3xl sm:text-4xl font-serif font-bold tracking-tight text-white mb-2">
            {learningPath.topicTitle}
          </h1>

          <p className="text-sm text-white/80 font-serif italic max-w-3xl leading-relaxed mb-6">
            {learningPath.targetGoal}
          </p>

          {/* Adaptation Blueprint Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-4 border-t border-white/15">
            <div className="bg-white/10 backdrop-blur-xs rounded-2xl p-3.5 border border-white/15">
              <div className="text-[10px] uppercase font-bold text-[#E8F0E0] tracking-wider">Style Emphasis</div>
              <div className="text-xs text-white/90 font-medium mt-1 leading-snug">
                {learningPath.adaptationSummary.styleEmphasis}
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-xs rounded-2xl p-3.5 border border-white/15">
              <div className="text-[10px] uppercase font-bold text-[#D4A373] tracking-wider">Interest Context</div>
              <div className="text-xs text-white/90 font-medium mt-1 leading-snug">
                {learningPath.adaptationSummary.interestContext}
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-xs rounded-2xl p-3.5 border border-white/15">
              <div className="text-[10px] uppercase font-bold text-[#B5BAA1] tracking-wider">Pacing Strategy</div>
              <div className="text-xs text-white/90 font-medium mt-1 leading-snug">
                {learningPath.adaptationSummary.paceAdjustment}
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-xs rounded-2xl p-3.5 border border-white/15">
              <div className="text-[10px] uppercase font-bold text-[#E8F0E0] tracking-wider">Diagnostic Focus</div>
              <div className="text-xs text-white/90 font-medium mt-1 leading-snug">
                {learningPath.adaptationSummary.gapFocus}
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-6 pt-4 border-t border-white/15 flex items-center justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center justify-between text-xs text-white/80 mb-1.5 font-medium">
                <span>Pathway Progress: {completedCount} of {learningPath.modules.length} Modules Completed</span>
                <span className="font-bold text-[#D4A373] font-serif italic">{progressPercent}%</span>
              </div>
              <div className="h-2 w-full bg-white/20 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-[#D4A373] rounded-full transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                ></div>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Modules Roadmap Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Timeline Nodes List (Left 7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-serif font-bold text-[#5A5A40] uppercase tracking-wider">
              Sequenced Milestones & Adaptive Scaffolds
            </h3>
            <span className="text-xs text-[#2D2D2A]/60 font-medium">
              {learningPath.modules.length} Modules Calibrated
            </span>
          </div>

          <div className="relative pl-6 space-y-4 before:absolute before:left-2.5 before:top-4 before:bottom-4 before:w-0.5 before:bg-[#E0D8D0]">
            {learningPath.modules.map((mod, index) => {
              const isSelected = mod.id === activeModuleId;
              const isCompleted = mod.status === 'completed';
              const isInProgress = mod.status === 'in-progress';
              const isLocked = mod.status === 'locked';
              const isRefresher = mod.isPrerequisiteRefresher;

              return (
                <div key={mod.id} className="relative">
                  
                  {/* Timeline Dot */}
                  <div
                    className={`absolute -left-6 top-4 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold ring-4 ring-[#F8F9F4] transition-all ${
                      isCompleted
                        ? 'bg-[#5A5A40] text-white'
                        : isInProgress
                        ? 'bg-[#D4A373] text-white animate-pulse'
                        : isRefresher
                        ? 'bg-[#D4A373] text-white'
                        : isLocked
                        ? 'bg-[#E0D8D0] text-[#2D2D2A]/60'
                        : 'bg-[#B5BAA1] text-white'
                    }`}
                  >
                    {isCompleted ? (
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    ) : isLocked ? (
                      <Lock className="w-2.5 h-2.5" />
                    ) : (
                      index + 1
                    )}
                  </div>

                  {/* Module Card */}
                  <div
                    onClick={() => {
                      setActiveModuleId(mod.id);
                      onSelectModule(mod);
                    }}
                    className={`p-5 sm:p-6 rounded-[28px] border transition-all cursor-pointer bg-white text-left ${
                      isSelected
                        ? 'border-[#5A5A40] shadow-sm ring-2 ring-[#5A5A40]/15'
                        : 'border-[#E0D8D0] hover:border-[#5A5A40]/40 hover:shadow-2xs'
                    }`}
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2">
                        <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                          isCompleted
                            ? 'bg-[#E8F0E0] text-[#5A5A40] border border-[#B5BAA1]/40'
                            : isInProgress
                            ? 'bg-[#F5F5F0] text-[#D4A373] border border-[#D4A373]/30'
                            : isRefresher
                            ? 'bg-[#FDF6E2] text-[#8C6B1C] border border-[#E4D19E]'
                            : isLocked
                            ? 'bg-[#F5F5F0] text-[#2D2D2A]/50 border border-[#E0D8D0]'
                            : 'bg-[#F5F5F0] text-[#5A5A40] border border-[#E0D8D0]'
                        }`}>
                          {mod.status}
                        </span>

                        {isRefresher && (
                          <span className="inline-flex items-center gap-1 text-[9px] font-bold px-2 py-0.5 rounded-full bg-[#FDF6E2] text-[#8C6B1C] border border-[#E4D19E] uppercase tracking-wide">
                            <AlertTriangle className="w-3 h-3 text-[#D4A373]" />
                            Prerequisite Scaffold
                          </span>
                        )}

                        {mod.isFastTracked && (
                          <span className="inline-flex items-center gap-1 text-[9px] font-bold px-2 py-0.5 rounded-full bg-[#E8F0E0] text-[#5A5A40] border border-[#B5BAA1]/40 uppercase tracking-wide">
                            <FastForward className="w-3 h-3" />
                            Fast-Tracked
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-3 text-xs text-[#2D2D2A]/60 font-medium">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          {mod.estimatedMinutes}m
                        </span>
                        <span>Level {mod.difficultyLevel}/5</span>
                      </div>
                    </div>

                    <h4 className="text-base font-serif font-bold text-[#2D2D2A] mb-1">
                      {mod.title}
                    </h4>

                    <p className="text-xs text-[#2D2D2A]/70 line-clamp-2 mb-3 leading-relaxed">
                      {mod.description}
                    </p>

                    {/* Interest Hook Highlight */}
                    <div className="text-[11px] font-medium text-[#2D2D2A] bg-[#F5F5F0] px-3 py-2 rounded-xl border border-[#E0D8D0] flex items-start gap-1.5">
                      <span className="shrink-0 font-bold text-[#5A5A40]">Context:</span>
                      <span className="line-clamp-1">{mod.interestHook}</span>
                    </div>

                    {/* Footer Tags */}
                    <div className="flex items-center justify-between mt-3 pt-3 border-t border-[#E0D8D0] text-xs">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {mod.keyConcepts.slice(0, 3).map((concept) => (
                          <span key={concept} className="text-[10px] px-2.5 py-0.5 bg-[#F5F5F0] rounded-md text-[#2D2D2A]/70 border border-[#E0D8D0]/60 font-medium">
                            {concept}
                          </span>
                        ))}
                      </div>

                      {isCompleted && mod.masteryScore && (
                        <div className="flex items-center gap-1 text-xs font-bold text-[#5A5A40] bg-[#E8F0E0] px-2.5 py-0.5 rounded-md border border-[#B5BAA1]/40">
                          <Award className="w-3.5 h-3.5 text-[#5A5A40]" />
                          <span className="font-serif italic">{mod.masteryScore}%</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Module Detail Panel (Right 5 Cols) */}
        <div className="lg:col-span-5">
          {activeModuleId ? (
            (() => {
              const selectedMod = learningPath.modules.find((m) => m.id === activeModuleId) || learningPath.modules[0];
              return (
                <div className="sticky top-24 bg-white rounded-[32px] p-6 sm:p-7 border border-[#E0D8D0] shadow-xs space-y-5">
                  <div className="flex items-center justify-between pb-3 border-b border-[#E0D8D0]">
                    <div>
                      <span className="text-[10px] font-bold text-[#5A5A40] uppercase tracking-widest">
                        Active Selection
                      </span>
                      <h3 className="text-xl font-serif font-bold text-[#2D2D2A] mt-0.5">
                        {selectedMod.title}
                      </h3>
                    </div>
                    <span className="text-xs px-3 py-1 rounded-full font-bold bg-[#F5F5F0] text-[#5A5A40] border border-[#E0D8D0]">
                      Level {selectedMod.difficultyLevel}
                    </span>
                  </div>

                  <p className="text-xs text-[#2D2D2A]/70 leading-relaxed font-serif italic">
                    {selectedMod.description}
                  </p>

                  {/* Why this is here / Scaffold explanation */}
                  {selectedMod.isPrerequisiteRefresher && (
                    <div className="p-4 rounded-2xl bg-[#FDF6E2] border border-[#E4D19E] text-xs">
                      <div className="flex items-center gap-1.5 font-bold text-[#8C6B1C] mb-1">
                        <AlertTriangle className="w-4 h-4 text-[#D4A373] shrink-0" />
                        <span>Adaptive Scaffolding Notice</span>
                      </div>
                      <p className="text-[#8C6B1C] text-[11px] leading-relaxed">
                        This module was automatically injected into the sequence because recent diagnostic analysis flagged a misconception regarding Call Stack memory unwinding. Mastering this prevents roadblocks later.
                      </p>
                    </div>
                  )}

                  {/* Interest Context Callout */}
                  <div className="p-4 rounded-2xl bg-[#F5F5F0] border border-[#E0D8D0]">
                    <span className="text-[10px] font-bold text-[#5A5A40] uppercase tracking-wider block mb-1">
                      Targeted Real-World Hook ({currentStudent.primaryInterest})
                    </span>
                    <p className="text-xs font-semibold text-[#2D2D2A]">
                      {selectedMod.interestHook}
                    </p>
                  </div>

                  {/* Key Learning Objectives */}
                  <div>
                    <span className="text-[10px] font-bold text-[#5A5A40] uppercase tracking-wider block mb-2">
                      Key Competencies Evaluated
                    </span>
                    <div className="space-y-1.5">
                      {selectedMod.keyConcepts.map((concept) => (
                        <div key={concept} className="flex items-center gap-2 text-xs text-[#2D2D2A]">
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#5A5A40] shrink-0" />
                          <span>{concept}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Primary Action Buttons */}
                  <div className="space-y-2.5 pt-2 border-t border-[#E0D8D0]">
                    <button
                      id="btn-launch-study-resource"
                      onClick={() => onLaunchStudyResource(selectedMod)}
                      className="w-full py-3 px-4 rounded-2xl text-xs font-bold uppercase tracking-wider text-white bg-[#5A5A40] hover:bg-[#464632] shadow-xs transition-all flex items-center justify-center gap-2"
                    >
                      <BookOpen className="w-4 h-4" />
                      <span>Open Tailored Study Resource</span>
                    </button>

                    <button
                      id="btn-launch-checkpoint-quiz"
                      onClick={() => onLaunchAssessment(selectedMod)}
                      className="w-full py-3 px-4 rounded-2xl text-xs font-bold uppercase tracking-wider text-[#5A5A40] bg-[#F5F5F0] hover:bg-[#EAE8E1] border border-[#E0D8D0] transition-all flex items-center justify-center gap-2"
                    >
                      <Play className="w-4 h-4 text-[#D4A373]" />
                      <span>Take Adaptive Checkpoint Quiz</span>
                    </button>
                  </div>

                  <div className="text-center">
                    <span className="text-[11px] text-[#2D2D2A]/50 font-medium">
                      Estimated completion: ~{selectedMod.estimatedMinutes} minutes
                    </span>
                  </div>
                </div>
              );
            })()
          ) : (
            <div className="bg-[#F5F5F0] rounded-[32px] p-8 border border-dashed border-[#E0D8D0] text-center text-[#2D2D2A]/50 text-xs">
              Select a milestone node on the timeline to preview details.
            </div>
          )}
        </div>

      </div>

    </div>
  );
};
