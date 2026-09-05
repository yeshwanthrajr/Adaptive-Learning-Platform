import React, { useState, useEffect } from 'react';
import { StudyResource, StudentProfile, LearningModuleNode, CuratedStudyMaterial } from '../types';
import { DEFAULT_CURATED_RESOURCES } from '../data/defaultData';
import { 
  BookOpen, 
  Sparkles, 
  Eye, 
  Wrench, 
  Lightbulb, 
  Zap, 
  CheckCircle2, 
  AlertTriangle, 
  Play, 
  Bot, 
  RefreshCw,
  HelpCircle,
  Share2,
  FileText,
  Compass,
  ExternalLink,
  SlidersHorizontal,
  Target,
  GraduationCap,
  Clock,
  Layers,
  Check
} from 'lucide-react';

interface StudyResourceViewProps {
  resource: StudyResource;
  currentStudent: StudentProfile;
  activeModule?: LearningModuleNode | null;
  onLaunchAssessment: (module: LearningModuleNode) => void;
  onOpenTutor: (initialPrompt?: string) => void;
  onReframeResource: (customInterest: string) => Promise<void>;
  isReframing: boolean;
  initialTab?: 'curated' | 'deep-dive' | 'interactive-lab' | 'cheatsheet';
  focusedGap?: string | null;
}

const REFRAME_IDEAS = [
  'Video Game Development',
  'Formula 1 Racing & Pitstops',
  'Space Exploration & Rockets',
  'Music Synthesis & Mixing',
  'Ocean Ecosystems & Marine Biology',
  'Coffee Roasting & Extraction',
  'Cybersecurity & Network Defense',
];

export const StudyResourceView: React.FC<StudyResourceViewProps> = ({
  resource,
  currentStudent,
  activeModule,
  onLaunchAssessment,
  onOpenTutor,
  onReframeResource,
  isReframing,
  initialTab = 'curated',
  focusedGap,
}) => {
  const [activeTab, setActiveTab] = useState<'curated' | 'deep-dive' | 'interactive-lab' | 'cheatsheet'>(initialTab);
  const [selectedChallengeOption, setSelectedChallengeOption] = useState<string | null>(null);
  const [challengeAnswerSubmitted, setChallengeAnswerSubmitted] = useState(false);
  const [customReframeText, setCustomReframeText] = useState('');

  // AI Curation Engine State
  const [curatedMaterials, setCuratedMaterials] = useState<CuratedStudyMaterial[]>(DEFAULT_CURATED_RESOURCES);
  const [formatFilter, setFormatFilter] = useState<'all' | 'article' | 'video' | 'exercise' | 'targeted-gaps'>('all');
  const [isCurating, setIsCurating] = useState(false);
  const [drillSubmissions, setDrillSubmissions] = useState<Record<string, { selectedIndex: number; isSubmitted: boolean }>>({});

  useEffect(() => {
    if (focusedGap) {
      setActiveTab('curated');
      setFormatFilter('targeted-gaps');
    }
  }, [focusedGap]);

  const content = resource.content;
  const exercise = content.interactiveExercise;

  const handleCustomReframeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customReframeText.trim() || isReframing) return;
    onReframeResource(customReframeText.trim());
    setCustomReframeText('');
  };

  // Run AI Curation Engine on demand
  const handleRunAICuration = async () => {
    setIsCurating(true);
    try {
      const res = await fetch('/api/resources/curate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: activeModule?.title || 'Data Structures & Algorithms',
          studentProfile: currentStudent,
          currentProgress: {
            masteryScore: currentStudent.overallMasteryScore,
            completedModules: currentStudent.completedModulesCount,
            streakDays: currentStudent.currentStreakDays,
          },
          academicGoal: currentStudent.academicGoal,
        }),
      });

      const data = await res.json();
      if (data.success && data.resources && data.resources.length > 0) {
        setCuratedMaterials(data.resources);
      }
    } catch (err) {
      console.error('Error curating resources:', err);
    } finally {
      setIsCurating(false);
    }
  };

  // Filter materials based on selected filter
  const filteredMaterials = curatedMaterials.filter((mat) => {
    if (formatFilter === 'all') return true;
    if (formatFilter === 'targeted-gaps') return Boolean(mat.targetedGap);
    return mat.format === formatFilter;
  });

  const handleSelectDrillOption = (resourceId: string, optIndex: number) => {
    if (drillSubmissions[resourceId]?.isSubmitted) return;
    setDrillSubmissions((prev) => ({
      ...prev,
      [resourceId]: { selectedIndex: optIndex, isSubmitted: false },
    }));
  };

  const handleSubmitDrill = (resourceId: string) => {
    if (drillSubmissions[resourceId]?.selectedIndex === undefined) return;
    setDrillSubmissions((prev) => ({
      ...prev,
      [resourceId]: { ...prev[resourceId], isSubmitted: true },
    }));
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-150">
      
      {/* Reframing Toolbar */}
      <div className="bg-white rounded-[28px] p-5 sm:p-6 border border-[#E0D8D0] shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-serif font-bold text-[#5A5A40] uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#D4A373]" />
              Dynamic Concept Reframing Engine
            </span>
            <p className="text-xs text-[#2D2D2A]/60 mt-0.5 font-serif italic">
              Not clicking? Reframe this concept instantly through any real-world passion.
            </p>
          </div>

          <form onSubmit={handleCustomReframeSubmit} className="flex items-center gap-2">
            <input
              type="text"
              value={customReframeText}
              onChange={(e) => setCustomReframeText(e.target.value)}
              placeholder="Reframe into (e.g. Cooking, Skateboarding)..."
              disabled={isReframing}
              className="px-3.5 py-2 text-xs rounded-xl border border-[#E0D8D0] text-[#2D2D2A] focus:outline-none focus:ring-2 focus:ring-[#5A5A40] w-52 sm:w-64 bg-[#F8F9F4]"
            />
            <button
              type="submit"
              disabled={isReframing || !customReframeText.trim()}
              className="px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider text-white bg-[#5A5A40] hover:bg-[#464632] disabled:opacity-50 transition-all shrink-0 flex items-center gap-1.5 shadow-xs"
            >
              {isReframing ? (
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <RefreshCw className="w-3.5 h-3.5" />
              )}
              <span>Reframe</span>
            </button>
          </form>
        </div>

        {/* Quick Reframe Badges */}
        <div className="flex items-center gap-2 mt-3 pt-3 border-t border-[#E0D8D0] flex-wrap">
          <span className="text-[10px] uppercase font-bold tracking-wider text-[#2D2D2A]/40">Quick lenses:</span>
          {REFRAME_IDEAS.map((idea) => (
            <button
              key={idea}
              type="button"
              disabled={isReframing}
              onClick={() => onReframeResource(idea)}
              className="text-[11px] px-3 py-1 rounded-full bg-[#F5F5F0] hover:bg-[#EAE8E1] text-[#2D2D2A]/80 border border-[#E0D8D0] font-medium transition-colors"
            >
              {idea}
            </button>
          ))}
        </div>
      </div>

      {/* Main Study Resource Header */}
      <div className="bg-white rounded-[32px] p-6 sm:p-8 border border-[#E0D8D0] shadow-xs space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-[#E0D8D0]">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-[#E8F0E0] text-[#5A5A40] border border-[#B5BAA1]/40 uppercase tracking-wide">
                {currentStudent.learningStyle.toUpperCase()} MODALITY
              </span>
              <span className="text-xs font-serif italic text-[#2D2D2A]/60">
                Framed for {currentStudent.primaryInterest} {currentStudent.interestEmoji}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#2D2D2A]">
              {resource.title}
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onOpenTutor(`Can you explain ${resource.title} using my interest in ${currentStudent.primaryInterest}?`)}
              className="px-4 py-2 rounded-2xl text-xs font-bold text-[#5A5A40] bg-[#F5F5F0] hover:bg-[#EAE8E1] border border-[#E0D8D0] flex items-center gap-1.5 transition-colors"
            >
              <Bot className="w-3.5 h-3.5" />
              <span>Ask AI Tutor</span>
            </button>

            {activeModule && (
              <button
                onClick={() => onLaunchAssessment(activeModule)}
                className="px-4 py-2 rounded-2xl text-xs font-bold uppercase tracking-wider text-white bg-[#5A5A40] hover:bg-[#464632] flex items-center gap-1.5 transition-colors shadow-xs"
              >
                <Play className="w-3.5 h-3.5 text-[#D4A373]" />
                <span>Take Quiz</span>
              </button>
            )}
          </div>
        </div>

        {/* View Mode Switcher */}
        <div className="flex flex-wrap items-center gap-1.5 bg-[#F5F5F0] p-1.5 rounded-2xl border border-[#E0D8D0]">
          <button
            onClick={() => setActiveTab('curated')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
              activeTab === 'curated'
                ? 'bg-[#5A5A40] text-white shadow-xs'
                : 'text-[#2D2D2A]/70 hover:text-[#2D2D2A]'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>AI Resource Curation Engine</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-white/20 ml-0.5">
              {curatedMaterials.length}
            </span>
          </button>
          
          <button
            onClick={() => setActiveTab('deep-dive')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'deep-dive'
                ? 'bg-[#5A5A40] text-white shadow-xs'
                : 'text-[#2D2D2A]/70 hover:text-[#2D2D2A]'
            }`}
          >
            Concept Deep-Dive
          </button>
          <button
            onClick={() => setActiveTab('interactive-lab')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'interactive-lab'
                ? 'bg-[#5A5A40] text-white shadow-xs'
                : 'text-[#2D2D2A]/70 hover:text-[#2D2D2A]'
            }`}
          >
            Interactive Lab & Challenge
          </button>
          <button
            onClick={() => setActiveTab('cheatsheet')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'cheatsheet'
                ? 'bg-[#5A5A40] text-white shadow-xs'
                : 'text-[#2D2D2A]/70 hover:text-[#2D2D2A]'
            }`}
          >
            Cheat Sheet
          </button>
        </div>

        {/* Tab 0: AI Curated External & Internal Resources */}
        {activeTab === 'curated' && (
          <div className="space-y-6 pt-2">
            
            {/* Student Analysis Intelligence Panel */}
            <div className="p-5 rounded-2xl bg-[#F5F5F0] border border-[#E0D8D0] space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-[#E8F0E0] text-[#5A5A40] flex items-center justify-center border border-[#B5BAA1]/40">
                    <Target className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-[#5A5A40] uppercase tracking-wider block">
                      Autonomous Resource Recommendation Engine
                    </span>
                    <span className="text-xs text-[#2D2D2A]/70 font-serif italic">
                      Synthesizing student progress, assessment diagnostic gaps, and stated passions
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  disabled={isCurating}
                  onClick={handleRunAICuration}
                  className="px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider text-white bg-[#5A5A40] hover:bg-[#464632] disabled:opacity-50 transition-all shadow-xs flex items-center gap-1.5 self-start sm:self-auto"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isCurating ? 'animate-spin' : ''}`} />
                  <span>{isCurating ? 'Curating via AI...' : 'Re-run AI Curation'}</span>
                </button>
              </div>

              {/* Signals Considered by Engine */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-[#E0D8D0]/80 text-xs">
                <div className="bg-white/80 p-2.5 rounded-xl border border-[#E0D8D0]/60">
                  <span className="text-[10px] font-bold text-[#2D2D2A]/50 uppercase tracking-wider block">Current Mastery</span>
                  <span className="font-serif font-bold text-[#5A5A40] text-sm">
                    {currentStudent.overallMasteryScore}%
                  </span>
                  <span className="text-[10px] text-[#2D2D2A]/60 block">({currentStudent.completedModulesCount} modules complete)</span>
                </div>

                <div className="bg-white/80 p-2.5 rounded-xl border border-[#E0D8D0]/60">
                  <span className="text-[10px] font-bold text-[#2D2D2A]/50 uppercase tracking-wider block">Target Goal</span>
                  <span className="font-bold text-[#2D2D2A] text-xs line-clamp-1">
                    {currentStudent.academicGoal?.title || 'Certification Mastery'}
                  </span>
                  <span className="text-[10px] text-[#2D2D2A]/60 block">{currentStudent.academicGoal?.targetMasteryPercentage || 90}% benchmark</span>
                </div>

                <div className="bg-white/80 p-2.5 rounded-xl border border-[#E0D8D0]/60">
                  <span className="text-[10px] font-bold text-[#2D2D2A]/50 uppercase tracking-wider block">Context Anchor</span>
                  <span className="font-bold text-[#2D2D2A] text-xs flex items-center gap-1">
                    <span>{currentStudent.interestEmoji}</span>
                    <span className="truncate">{currentStudent.primaryInterest}</span>
                  </span>
                  <span className="text-[10px] text-[#2D2D2A]/60 block capitalize">{currentStudent.learningStyle} learner</span>
                </div>

                <div className="bg-white/80 p-2.5 rounded-xl border border-[#E0D8D0]/60">
                  <span className="text-[10px] font-bold text-[#2D2D2A]/50 uppercase tracking-wider block">Diagnosed Gap Focus</span>
                  <span className="font-bold text-[#8C6B1C] text-xs truncate block">
                    {focusedGap || 'Cache & Frame Allocation'}
                  </span>
                  <span className="text-[10px] text-[#8C6B1C]/80 block">Remedial scaffold active</span>
                </div>
              </div>
            </div>

            {/* Filter Bar */}
            <div className="flex items-center justify-between gap-3 flex-wrap">
              <div className="flex items-center gap-1.5 flex-wrap">
                {[
                  { id: 'all', label: 'All Curated Materials' },
                  { id: 'article', label: 'Articles & Guides', icon: FileText },
                  { id: 'video', label: 'Video Explainers', icon: Play },
                  { id: 'exercise', label: 'Interactive Practice Drills', icon: Wrench },
                  { id: 'targeted-gaps', label: 'Targeted Gap Remedies', icon: Target },
                ].map((f) => (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => setFormatFilter(f.id as any)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
                      formatFilter === f.id
                        ? 'bg-[#5A5A40] text-white shadow-2xs'
                        : 'bg-[#F5F5F0] text-[#2D2D2A]/70 hover:bg-[#EAE8E1] border border-[#E0D8D0]'
                    }`}
                  >
                    {f.icon && <f.icon className="w-3 h-3" />}
                    <span>{f.label}</span>
                  </button>
                ))}
              </div>

              <div className="text-xs text-[#2D2D2A]/50 font-serif italic">
                Showing {filteredMaterials.length} materials
              </div>
            </div>

            {/* Curated Materials Cards List */}
            <div className="space-y-4">
              {filteredMaterials.map((material) => {
                const isArticle = material.format === 'article';
                const isVideo = material.format === 'video';
                const isExercise = material.format === 'exercise';
                const drillState = drillSubmissions[material.id];

                return (
                  <div
                    key={material.id}
                    className="p-5 sm:p-6 rounded-2xl bg-white border border-[#E0D8D0] shadow-2xs hover:shadow-xs transition-all space-y-4"
                  >
                    {/* Top Row: Meta Badges */}
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 ${
                          isArticle 
                            ? 'bg-[#E8F0E0] text-[#5A5A40] border border-[#B5BAA1]/50'
                            : isVideo
                            ? 'bg-[#FDF6E2] text-[#8C6B1C] border border-[#E4D19E]'
                            : 'bg-[#F5F5F0] text-[#2D2D2A] border border-[#E0D8D0]'
                        }`}>
                          {isArticle && <FileText className="w-3 h-3" />}
                          {isVideo && <Play className="w-3 h-3 text-[#D4A373]" />}
                          {isExercise && <Wrench className="w-3 h-3 text-[#5A5A40]" />}
                          <span>{material.format.toUpperCase()}</span>
                        </span>

                        <span className="text-xs text-[#2D2D2A]/60 font-medium">
                          {material.source}
                        </span>
                        <span className="text-[#2D2D2A]/30">•</span>
                        <span className="text-xs text-[#2D2D2A]/60 flex items-center gap-1">
                          <Clock className="w-3 h-3 text-[#2D2D2A]/40" />
                          <span>{material.estimatedTime}</span>
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        {material.targetedGap && (
                          <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-[#FDF6E2] text-[#8C6B1C] font-bold border border-[#E4D19E] flex items-center gap-1">
                            <Target className="w-3 h-3 text-[#D4A373]" />
                            <span>Remediates: {material.targetedGap}</span>
                          </span>
                        )}

                        <div className="flex items-center gap-1 text-[11px] font-bold text-[#5A5A40] bg-[#E8F0E0]/80 px-2 py-0.5 rounded-full border border-[#B5BAA1]/40">
                          <Sparkles className="w-3 h-3 text-[#D4A373]" />
                          <span>{material.relevanceScore}% Match</span>
                        </div>
                      </div>
                    </div>

                    {/* Title and Summary */}
                    <div>
                      <h3 className="text-base sm:text-lg font-serif font-bold text-[#2D2D2A]">
                        {material.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-[#2D2D2A]/80 mt-1 leading-relaxed">
                        {material.summary}
                      </p>
                    </div>

                    {/* Why Recommended AI Rationale */}
                    <div className="p-3 rounded-xl bg-[#F8F9F4] border border-[#E0D8D0] flex items-start gap-2.5">
                      <GraduationCap className="w-4 h-4 text-[#5A5A40] shrink-0 mt-0.5" />
                      <div>
                        <span className="text-[10px] font-bold text-[#5A5A40] uppercase tracking-wider block">
                          Why Curated For {currentStudent.name}:
                        </span>
                        <p className="text-xs font-serif italic text-[#2D2D2A]/80 mt-0.5">
                          {material.whyRecommended}
                        </p>
                      </div>
                    </div>

                    {/* Key Takeaways */}
                    {material.keyTakeaways && material.keyTakeaways.length > 0 && (
                      <div className="space-y-1.5 pt-1">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#2D2D2A]/50 block">
                          Core Concepts Covered:
                        </span>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {material.keyTakeaways.map((takeaway, idx) => (
                            <div key={idx} className="text-xs text-[#2D2D2A]/80 flex items-start gap-2 bg-[#F5F5F0]/60 p-2 rounded-xl">
                              <Check className="w-3.5 h-3.5 text-[#5A5A40] shrink-0 mt-0.5" />
                              <span>{takeaway}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Interactive Drill Sandbox if it is an exercise */}
                    {isExercise && material.interactiveExerciseSnippet && (
                      <div className="p-4 rounded-2xl bg-[#F5F5F0] border border-[#E0D8D0] space-y-3 mt-2">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold text-[#5A5A40] uppercase tracking-wider flex items-center gap-1.5">
                            <Wrench className="w-3.5 h-3.5 text-[#D4A373]" />
                            Hands-On Mini Drill (Instant Check)
                          </span>
                          <span className="text-[11px] text-[#2D2D2A]/50 font-serif italic">
                            Practice in platform
                          </span>
                        </div>

                        <p className="text-xs sm:text-sm font-semibold text-[#2D2D2A]">
                          {material.interactiveExerciseSnippet.prompt}
                        </p>

                        <div className="space-y-2">
                          {material.interactiveExerciseSnippet.options.map((opt, oIdx) => {
                            const isSelected = drillState?.selectedIndex === oIdx;
                            const isSubmitted = drillState?.isSubmitted;
                            const isCorrect = oIdx === material.interactiveExerciseSnippet?.correctIndex;

                            let optStyle = 'bg-white border-[#E0D8D0] text-[#2D2D2A] hover:border-[#5A5A40]/40';
                            if (isSelected && !isSubmitted) {
                              optStyle = 'bg-[#F5F5F0] border-[#5A5A40] ring-1 ring-[#5A5A40] font-semibold';
                            } else if (isSubmitted) {
                              if (isCorrect) {
                                optStyle = 'bg-[#E8F0E0] border-[#5A5A40] text-[#5A5A40] font-bold';
                              } else if (isSelected && !isCorrect) {
                                optStyle = 'bg-[#FDF6E2] border-[#D4A373] text-[#8C6B1C]';
                              } else {
                                optStyle = 'bg-white/50 border-[#E0D8D0] opacity-50';
                              }
                            }

                            return (
                              <button
                                key={oIdx}
                                type="button"
                                onClick={() => handleSelectDrillOption(material.id, oIdx)}
                                className={`w-full text-left p-2.5 rounded-xl border text-xs transition-all flex items-center justify-between ${optStyle}`}
                              >
                                <span>{opt}</span>
                                {isSubmitted && isCorrect && <Check className="w-4 h-4 text-[#5A5A40]" />}
                              </button>
                            );
                          })}
                        </div>

                        {!drillState?.isSubmitted ? (
                          <button
                            type="button"
                            disabled={drillState?.selectedIndex === undefined}
                            onClick={() => handleSubmitDrill(material.id)}
                            className="px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider text-white bg-[#5A5A40] hover:bg-[#464632] disabled:opacity-50 transition-all shadow-2xs"
                          >
                            Submit Drill Answer
                          </button>
                        ) : (
                          <div className="p-3 rounded-xl bg-[#E8F0E0] border border-[#B5BAA1]/40 text-xs text-[#2D2D2A] space-y-1">
                            <span className="font-bold text-[#5A5A40] block uppercase tracking-wide text-[10px]">
                              Solution Insight:
                            </span>
                            <p className="font-serif italic">{material.interactiveExerciseSnippet.explanation}</p>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Bottom Actions */}
                    <div className="flex items-center justify-between pt-2 border-t border-[#E0D8D0]">
                      <button
                        onClick={() => onOpenTutor(`Can you help me understand: "${material.title}" and how it relates to ${material.targetedGap || 'our topic'}?`)}
                        className="text-xs font-bold text-[#5A5A40] hover:text-[#464632] flex items-center gap-1.5 transition-colors"
                      >
                        <Bot className="w-3.5 h-3.5" />
                        <span>Discuss with AI Tutor</span>
                      </button>

                      <a
                        href={material.url}
                        target="_blank"
                        rel="noreferrer"
                        className="px-3.5 py-1.5 rounded-xl text-xs font-bold text-[#2D2D2A] bg-[#F5F5F0] hover:bg-[#EAE8E1] border border-[#E0D8D0] flex items-center gap-1.5 transition-colors shadow-2xs"
                      >
                        <span>Open Resource</span>
                        <ExternalLink className="w-3 h-3 text-[#2D2D2A]/60" />
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>

          </div>
        )}

        {/* Tab 1: Deep Dive */}
        {activeTab === 'deep-dive' && (
          <div className="space-y-6 pt-2">
            
            {/* Interest Analogy Callout (Key Value Prop) */}
            <div className="p-4 sm:p-5 rounded-2xl bg-[#F5F5F0] border border-[#E0D8D0]">
              <span className="text-[10px] font-bold text-[#5A5A40] uppercase tracking-wider block mb-1">
                Personalized Real-World Metaphor ({currentStudent.primaryInterest})
              </span>
              <p className="text-xs sm:text-sm font-serif italic text-[#2D2D2A] leading-relaxed">
                "{content.interestAnalogy}"
              </p>
            </div>

            {/* Core Explanation */}
            <div className="prose prose-slate max-w-none text-xs sm:text-sm text-[#2D2D2A]/80 leading-relaxed space-y-3">
              <h3 className="text-sm font-serif font-bold text-[#5A5A40] uppercase tracking-wider">
                How It Works
              </h3>
              <p className="whitespace-pre-line font-sans">
                {content.coreExplanation}
              </p>
            </div>

            {/* Visual Schematic Diagram if provided */}
            {content.visualSchematic && (
              <div className="space-y-2">
                <span className="text-[10px] font-bold text-[#5A5A40] uppercase tracking-wider flex items-center gap-1.5">
                  <Eye className="w-4 h-4 text-[#D4A373]" />
                  Visual Schematic & Mental Flow
                </span>
                <div className="rounded-2xl bg-[#2D2D2A] text-[#B5BAA1] p-4 sm:p-6 font-mono text-xs overflow-x-auto shadow-sm border border-[#464632]">
                  <pre className="leading-relaxed">{content.visualSchematic}</pre>
                </div>
              </div>
            )}

            {/* Key Takeaways & Common Pitfalls */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-2xl bg-[#E8F0E0] border border-[#B5BAA1]/40">
                <span className="text-[10px] font-bold text-[#5A5A40] uppercase tracking-wider block mb-2 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#5A5A40]" />
                  Key Cognitive Takeaways
                </span>
                <ul className="space-y-1.5">
                  {content.bulletKeyTakeaways.map((item, i) => (
                    <li key={i} className="text-xs text-[#2D2D2A] flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#5A5A40] shrink-0 mt-1.5"></span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-4 rounded-2xl bg-[#FDF6E2] border border-[#E4D19E]">
                <span className="text-[10px] font-bold text-[#8C6B1C] uppercase tracking-wider block mb-2 flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-[#D4A373]" />
                  Common Cognitive Pitfalls
                </span>
                <ul className="space-y-1.5">
                  {content.commonPitfalls.map((item, i) => (
                    <li key={i} className="text-xs text-[#8C6B1C] flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#D4A373] shrink-0 mt-1.5"></span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

          </div>
        )}

        {/* Tab 2: Interactive Lab & Mini Challenge */}
        {activeTab === 'interactive-lab' && exercise && (
          <div className="space-y-6 pt-2">
            <div className="p-6 rounded-[28px] bg-[#F5F5F0] border border-[#E0D8D0] space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-[#5A5A40] uppercase tracking-wider flex items-center gap-1.5">
                  <Wrench className="w-4 h-4 text-[#D4A373]" />
                  Hands-On Micro-Challenge
                </span>
                <span className="text-xs text-[#2D2D2A]/50 font-serif italic">Immediate Self-Check</span>
              </div>

              <p className="text-sm font-serif font-bold text-[#2D2D2A]">
                {exercise.challengePrompt}
              </p>

              {exercise.options && (
                <div className="space-y-2.5">
                  {exercise.options.map((opt, i) => {
                    const isSelected = selectedChallengeOption === opt;
                    const isCorrect = opt === exercise.correctAnswer;
                    const showFeedback = challengeAnswerSubmitted;

                    let btnStyle = 'border-[#E0D8D0] hover:border-[#5A5A40]/40 bg-white';
                    if (isSelected && !showFeedback) {
                      btnStyle = 'border-[#5A5A40] bg-[#F5F5F0] shadow-2xs ring-2 ring-[#5A5A40]/15';
                    } else if (showFeedback) {
                      if (isCorrect) {
                        btnStyle = 'border-[#5A5A40] bg-[#E8F0E0] text-[#5A5A40] font-semibold';
                      } else if (isSelected && !isCorrect) {
                        btnStyle = 'border-[#D4A373] bg-[#FDF6E2] text-[#8C6B1C]';
                      } else {
                        btnStyle = 'border-[#E0D8D0] opacity-60';
                      }
                    }

                    return (
                      <button
                        key={i}
                        type="button"
                        onClick={() => {
                          if (!challengeAnswerSubmitted) {
                            setSelectedChallengeOption(opt);
                          }
                        }}
                        className={`w-full text-left p-3.5 rounded-2xl border-2 text-xs transition-all flex items-center justify-between ${btnStyle}`}
                      >
                        <span className="font-medium">{opt}</span>
                        {showFeedback && isCorrect && (
                          <CheckCircle2 className="w-4 h-4 text-[#5A5A40] shrink-0" />
                        )}
                      </button>
                    );
                  })}
                </div>
              )}

              {!challengeAnswerSubmitted ? (
                <button
                  type="button"
                  disabled={!selectedChallengeOption}
                  onClick={() => setChallengeAnswerSubmitted(true)}
                  className="px-5 py-2.5 rounded-2xl text-xs font-bold uppercase tracking-wider text-white bg-[#5A5A40] hover:bg-[#464632] disabled:opacity-50 transition-all shadow-xs"
                >
                  Verify Solution
                </button>
              ) : (
                <div className="p-4 rounded-2xl bg-[#E8F0E0] border border-[#B5BAA1]/40 text-xs text-[#2D2D2A] space-y-1">
                  <span className="font-bold text-[#5A5A40] block uppercase tracking-wide text-[10px]">Solution Analysis:</span>
                  <p className="font-serif italic">{exercise.solutionExplanation}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab 3: Cheat Sheet */}
        {activeTab === 'cheatsheet' && (
          <div className="space-y-4 pt-2">
            <div className="p-6 rounded-[28px] bg-[#2D2D2A] text-[#F8F9F4] space-y-3 font-mono text-xs border border-[#464632]">
              <div className="text-[#B5BAA1] font-bold uppercase tracking-wider">
                Summary Reference Card
              </div>
              <p className="text-[#F8F9F4]/80 font-sans text-xs">
                {content.summary}
              </p>
              <div className="border-t border-[#464632] pt-3 space-y-2">
                <div className="text-[#B5BAA1] font-bold uppercase text-[10px]">
                  Core Rules & Takeaways
                </div>
                {content.bulletKeyTakeaways.map((takeaway, i) => (
                  <div key={i} className="flex items-start gap-2 text-[#F8F9F4]/90">
                    <span className="text-[#D4A373] font-bold">•</span>
                    <span>{takeaway}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

      </div>

    </div>
  );
};

