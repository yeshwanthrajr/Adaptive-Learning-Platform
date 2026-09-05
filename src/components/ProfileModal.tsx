import React, { useState } from 'react';
import { 
  StudentProfile, 
  LearningStyle, 
  PacingPreference, 
  SkillLevel,
  AcademicGoal 
} from '../types';
import { 
  X, 
  Sliders, 
  Eye, 
  Wrench, 
  Lightbulb, 
  Zap, 
  Clock, 
  Compass, 
  AlertCircle, 
  Target, 
  Headphones, 
  BookOpen, 
  Activity, 
  Sparkles,
  Plus,
  Tag
} from 'lucide-react';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  student: StudentProfile;
  onSaveStudent: (updated: StudentProfile) => void;
}

const INTEREST_PRESETS = [
  { label: 'Game Dev & Graphics', emoji: '🎮' },
  { label: 'Space Flight & Orbital Mechanics', emoji: '🚀' },
  { label: 'Climate Ecology & Ocean Sensors', emoji: '🌊' },
  { label: 'AI & Autonomous Robotics', emoji: '🤖' },
  { label: 'Quantitative Finance & Markets', emoji: '📈' },
  { label: 'Music Synthesis & DSP', emoji: '🎵' },
  { label: 'Sports Biomechanics & IoT', emoji: '⚽' },
  { label: 'Cybersecurity & Kernel Defense', emoji: '🛡️' },
];

const SECONDARY_INTEREST_SUGGESTIONS = [
  '3D Shader Math',
  'Robotics & AI',
  'Environmental IoT',
  'Python Telemetry',
  'Astrophysics',
  'Numerical Simulation',
  'Differential Geometry',
  'Compiler Architecture',
  'Bioinformatics',
];

export const ProfileModal: React.FC<ProfileModalProps> = ({
  isOpen,
  onClose,
  student,
  onSaveStudent,
}) => {
  const [name, setName] = useState(student.name);
  const [learningStyle, setLearningStyle] = useState<LearningStyle>(student.learningStyle);
  const [pacing, setPacing] = useState<PacingPreference>(student.pacing);
  const [skillLevel, setSkillLevel] = useState<SkillLevel>(student.skillLevel);
  const [primaryInterest, setPrimaryInterest] = useState(student.primaryInterest);
  const [interestEmoji, setInterestEmoji] = useState(student.interestEmoji);
  const [customInterestText, setCustomInterestText] = useState('');
  
  // Secondary interests
  const [secondaryInterests, setSecondaryInterests] = useState<string[]>(
    student.secondaryInterests || ['Robotics & AI', '3D Shader Math']
  );
  const [newTagInput, setNewTagInput] = useState('');

  // Academic goals
  const [academicGoal, setAcademicGoal] = useState<AcademicGoal>(
    student.academicGoal || {
      category: 'career-bootcamp',
      title: 'Systems & Algorithms Competency Certification',
      targetMasteryPercent: 90,
      targetTimeline: '1-Month Intensive Sprint',
      prioritySubtopics: ['Spatial Partitioning', 'Recursive Tree Traversals', 'GPU Memory Optimization'],
    }
  );

  if (!isOpen) return null;

  const handleToggleSecondaryInterest = (tag: string) => {
    if (secondaryInterests.includes(tag)) {
      setSecondaryInterests(secondaryInterests.filter((t) => t !== tag));
    } else {
      setSecondaryInterests([...secondaryInterests, tag]);
    }
  };

  const handleAddCustomTag = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTagInput.trim() || secondaryInterests.includes(newTagInput.trim())) return;
    setSecondaryInterests([...secondaryInterests, newTagInput.trim()]);
    setNewTagInput('');
  };

  const handleSave = () => {
    const finalInterest = customInterestText.trim() || primaryInterest;
    onSaveStudent({
      ...student,
      name,
      learningStyle,
      pacing,
      skillLevel,
      primaryInterest: finalInterest,
      interestEmoji,
      secondaryInterests,
      academicGoal,
      headline: `${learningStyle.toUpperCase()} • ${finalInterest}`,
    });
    onClose();
  };

  const selectInterestPreset = (label: string, emoji: string) => {
    setPrimaryInterest(label);
    setInterestEmoji(emoji);
    setCustomInterestText('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#2D2D2A]/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div 
        className="bg-white rounded-[32px] max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-[#E0D8D0] animate-in fade-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto"
        id="profile-customization-modal"
      >
        <div className="flex items-center justify-between pb-4 border-b border-[#E0D8D0]">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#E8F0E0] text-[#5A5A40] flex items-center justify-center border border-[#B5BAA1]/40">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-serif font-bold text-[#2D2D2A]">Learner Profiling & Personalization Engine</h2>
              <p className="text-xs text-[#2D2D2A]/60 font-serif italic">Informs real-time question difficulty, path adaptions, and resource curation</p>
            </div>
          </div>
          <button
            id="btn-close-profile-modal"
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#2D2D2A]/40 hover:text-[#2D2D2A] hover:bg-[#F5F5F0] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-6 pt-5">
          {/* Learner Name */}
          <div>
            <label className="block text-[10px] font-bold text-[#5A5A40] uppercase tracking-wider mb-1.5">
              Learner Name
            </label>
            <input
              type="text"
              id="input-learner-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#E0D8D0] text-sm font-medium text-[#2D2D2A] focus:outline-none focus:ring-2 focus:ring-[#5A5A40] bg-[#F8F9F4]"
              placeholder="e.g. Alex Chen"
            />
          </div>

          {/* 1. Preferred Learning Styles (Expanded) */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-[10px] font-bold text-[#5A5A40] uppercase tracking-wider">
                Preferred Learning Modality
              </label>
              <span className="text-[11px] font-serif italic text-[#5A5A40]">
                Active: {learningStyle.toUpperCase()}
              </span>
            </div>
            <p className="text-xs text-[#2D2D2A]/60 mb-3 font-serif italic">
              Governs how concepts are presented, schemas are generated, and drills are staged.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {[
                {
                  id: 'visual',
                  title: 'Visual Schematics',
                  desc: 'Diagrams, spatial layouts, ASCII schematics, visual state models',
                  icon: Eye,
                  bg: 'bg-[#E8F0E0]',
                  color: 'text-[#5A5A40]',
                },
                {
                  id: 'kinesthetic',
                  title: 'Kinesthetic / Interactive',
                  desc: 'Hands-on sandboxes, parameter sliders, code experiments',
                  icon: Activity,
                  bg: 'bg-[#FDF6E2]',
                  color: 'text-[#8C6B1C]',
                },
                {
                  id: 'auditory',
                  title: 'Auditory & Conversational',
                  desc: 'Socratic dialogues, acoustic analogies, podcast-style explanations',
                  icon: Headphones,
                  bg: 'bg-[#F5F5F0]',
                  color: 'text-[#5A5A40]',
                },
                {
                  id: 'reading-writing',
                  title: 'Reading & Detailed Text',
                  desc: 'Rigorous papers, formal proofs, annotated code walkthroughs',
                  icon: BookOpen,
                  bg: 'bg-[#E8F0E0]',
                  color: 'text-[#5A5A40]',
                },
                {
                  id: 'conceptual',
                  title: 'First-Principles & Intuition',
                  desc: 'Deep analogies, the "why" before formulas, storytelling',
                  icon: Lightbulb,
                  bg: 'bg-[#FDF6E2]',
                  color: 'text-[#8C6B1C]',
                },
                {
                  id: 'concise',
                  title: 'High-Density Drills',
                  desc: 'Executive summaries, cheat-sheets, rapid diagnostic drills',
                  icon: Zap,
                  bg: 'bg-[#F5F5F0]',
                  color: 'text-[#5A5A40]',
                },
              ].map((style) => {
                const isSelected = learningStyle === style.id;
                const Icon = style.icon;
                return (
                  <button
                    key={style.id}
                    type="button"
                    id={`opt-style-${style.id}`}
                    onClick={() => setLearningStyle(style.id as LearningStyle)}
                    className={`text-left p-3 rounded-2xl border-2 transition-all flex items-start gap-2.5 ${
                      isSelected
                        ? 'border-[#5A5A40] bg-[#F5F5F0] shadow-2xs ring-2 ring-[#5A5A40]/15'
                        : 'border-[#E0D8D0] hover:border-[#5A5A40]/40 bg-white'
                    }`}
                  >
                    <div className={`w-7 h-7 rounded-lg ${style.bg} ${style.color} flex items-center justify-center shrink-0 mt-0.5 border border-[#E0D8D0]/60`}>
                      <Icon className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <div className="text-xs font-serif font-bold text-[#2D2D2A] flex items-center gap-1.5">
                        {style.title}
                        {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-[#5A5A40]"></span>}
                      </div>
                      <div className="text-[11px] text-[#2D2D2A]/60 mt-0.5 leading-tight">{style.desc}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. Areas of Interest: Primary & Secondary */}
          <div>
            <label className="block text-[10px] font-bold text-[#5A5A40] uppercase tracking-wider mb-1">
              Primary Area of Interest (Context Anchor)
            </label>
            <p className="text-xs text-[#2D2D2A]/60 mb-2 font-serif italic">
              All scenarios, quizzes, and analogies will be anchored in this domain.
            </p>
            <div className="flex flex-wrap gap-1.5 mb-2.5">
              {INTEREST_PRESETS.map((preset) => {
                const isSelected = primaryInterest === preset.label;
                return (
                  <button
                    key={preset.label}
                    type="button"
                    onClick={() => selectInterestPreset(preset.label, preset.emoji)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border transition-all ${
                      isSelected
                        ? 'bg-[#5A5A40] text-white border-[#5A5A40] shadow-xs'
                        : 'bg-[#F5F5F0] text-[#2D2D2A] border-[#E0D8D0] hover:bg-[#EAE8E1]'
                    }`}
                  >
                    <span>{preset.emoji}</span>
                    <span>{preset.label}</span>
                  </button>
                );
              })}
            </div>

            <div className="flex items-center gap-2 mb-3">
              <input
                type="text"
                id="input-custom-interest"
                value={customInterestText}
                onChange={(e) => setCustomInterestText(e.target.value)}
                placeholder="Or custom passion (e.g. Formula 1 Racing, Biotech, Quantum Mechanics)..."
                className="flex-1 px-3.5 py-2 text-xs rounded-xl border border-[#E0D8D0] text-[#2D2D2A] focus:outline-none focus:ring-2 focus:ring-[#5A5A40] bg-[#F8F9F4]"
              />
              <span className="text-xs text-[#2D2D2A]/60 shrink-0 font-medium">
                Active: <span className="font-bold text-[#2D2D2A]">{interestEmoji} {customInterestText.trim() || primaryInterest}</span>
              </span>
            </div>

            {/* Secondary Interests */}
            <div>
              <label className="block text-[10px] font-bold text-[#5A5A40] uppercase tracking-wider mb-1 flex items-center gap-1">
                <Tag className="w-3 h-3 text-[#D4A373]" />
                Secondary Interests & Cross-Disciplinary Hooks
              </label>
              <div className="flex flex-wrap gap-1.5 mb-2">
                {SECONDARY_INTEREST_SUGGESTIONS.map((tag) => {
                  const isChecked = secondaryInterests.includes(tag);
                  return (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => handleToggleSecondaryInterest(tag)}
                      className={`text-[11px] px-2.5 py-1 rounded-lg border font-medium transition-colors ${
                        isChecked
                          ? 'bg-[#E8F0E0] text-[#5A5A40] border-[#B5BAA1]'
                          : 'bg-white text-[#2D2D2A]/70 border-[#E0D8D0] hover:bg-[#F5F5F0]'
                      }`}
                    >
                      {isChecked ? '✓ ' : '+ '} {tag}
                    </button>
                  );
                })}
              </div>

              <form onSubmit={handleAddCustomTag} className="flex items-center gap-2">
                <input
                  type="text"
                  value={newTagInput}
                  onChange={(e) => setNewTagInput(e.target.value)}
                  placeholder="Add custom secondary tag..."
                  className="px-3 py-1.5 text-xs rounded-lg border border-[#E0D8D0] text-[#2D2D2A] w-52 bg-[#F8F9F4]"
                />
                <button
                  type="submit"
                  disabled={!newTagInput.trim()}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#F5F5F0] border border-[#E0D8D0] text-[#5A5A40] hover:bg-[#EAE8E1] disabled:opacity-50"
                >
                  <Plus className="w-3 h-3 inline mr-1" />
                  Add Tag
                </button>
              </form>
            </div>
          </div>

          {/* 3. Academic Goals & Milestones */}
          <div className="p-4 rounded-2xl bg-[#F5F5F0] border border-[#E0D8D0] space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-[#5A5A40] uppercase tracking-wider flex items-center gap-1.5">
                <Target className="w-3.5 h-3.5 text-[#D4A373]" />
                Academic Goal & Career Target
              </span>
              <span className="text-[11px] font-serif italic text-[#5A5A40]">
                {academicGoal.targetTimeline}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {[
                { id: 'career-bootcamp', label: 'Career Bootcamp Sprint' },
                { id: 'exam-prep', label: 'Qualifying Exam Prep' },
                { id: 'academic-research', label: 'Research Honor Thesis' },
              ].map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setAcademicGoal({ ...academicGoal, category: cat.id as any })}
                  className={`py-1.5 px-2 rounded-xl text-xs font-medium border text-center transition-all ${
                    academicGoal.category === cat.id
                      ? 'bg-[#5A5A40] text-white border-[#5A5A40] shadow-xs'
                      : 'bg-white text-[#2D2D2A]/80 border-[#E0D8D0] hover:bg-[#F5F5F0]'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            <div className="space-y-2 pt-1">
              <div>
                <label className="block text-[10px] font-bold text-[#2D2D2A]/60 uppercase tracking-wider mb-1">
                  Goal Title & Benchmark
                </label>
                <input
                  type="text"
                  value={academicGoal.title}
                  onChange={(e) => setAcademicGoal({ ...academicGoal, title: e.target.value })}
                  className="w-full px-3 py-1.5 text-xs rounded-xl border border-[#E0D8D0] text-[#2D2D2A] bg-white font-medium"
                  placeholder="e.g. Systems Architecture Certification"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-[#2D2D2A]/60 uppercase tracking-wider mb-1">
                    Target Mastery: {academicGoal.targetMasteryPercent}%
                  </label>
                  <input
                    type="range"
                    min="70"
                    max="99"
                    value={academicGoal.targetMasteryPercent}
                    onChange={(e) => setAcademicGoal({ ...academicGoal, targetMasteryPercent: Number(e.target.value) })}
                    className="w-full accent-[#5A5A40]"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-[#2D2D2A]/60 uppercase tracking-wider mb-1">
                    Timeline Cadence
                  </label>
                  <select
                    value={academicGoal.targetTimeline}
                    onChange={(e) => setAcademicGoal({ ...academicGoal, targetTimeline: e.target.value })}
                    className="w-full px-2.5 py-1.5 text-xs rounded-xl border border-[#E0D8D0] text-[#2D2D2A] bg-white"
                  >
                    <option value="2-Week Final Sprint">2-Week Final Sprint</option>
                    <option value="1-Month Intensive Sprint">1-Month Intensive Sprint</option>
                    <option value="3-Month Academic Term">3-Month Academic Term</option>
                    <option value="Flexible Lifelong Cadence">Flexible Lifelong Cadence</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* 4. Pacing & Current Skill Level */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-bold text-[#5A5A40] uppercase tracking-wider mb-1.5">
                Pacing Preference
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'accelerated', label: 'Fast-Track', icon: Zap },
                  { id: 'standard', label: 'Balanced', icon: Clock },
                  { id: 'deep-dive', label: 'Deep-Dive', icon: Compass },
                ].map((p) => {
                  const isSelected = pacing === p.id;
                  return (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => setPacing(p.id as PacingPreference)}
                      className={`py-2 px-2 rounded-xl text-xs font-medium border text-center transition-all ${
                        isSelected
                          ? 'bg-[#5A5A40] text-white border-[#5A5A40] shadow-xs'
                          : 'bg-white text-[#2D2D2A]/80 border-[#E0D8D0] hover:bg-[#F5F5F0]'
                      }`}
                    >
                      {p.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-[#5A5A40] uppercase tracking-wider mb-1.5">
                Mastery Baseline
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['beginner', 'intermediate', 'advanced'] as SkillLevel[]).map((lvl) => {
                  const isSelected = skillLevel === lvl;
                  return (
                    <button
                      key={lvl}
                      type="button"
                      onClick={() => setSkillLevel(lvl)}
                      className={`py-2 px-2 rounded-xl text-xs font-medium border capitalize text-center transition-all ${
                        isSelected
                          ? 'bg-[#5A5A40] text-white border-[#5A5A40] shadow-xs'
                          : 'bg-white text-[#2D2D2A]/80 border-[#E0D8D0] hover:bg-[#F5F5F0]'
                      }`}
                    >
                      {lvl}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Persistent Recommendation Notice */}
          <div className="p-3.5 rounded-2xl bg-[#E8F0E0] border border-[#B5BAA1]/40 flex items-start gap-2.5 text-xs text-[#2D2D2A]">
            <Sparkles className="w-4 h-4 text-[#5A5A40] shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-[#5A5A40] uppercase tracking-wider text-[10px] block">
                Recommendation Engine Synchronization
              </span>
              <p className="mt-0.5 font-serif italic text-[#2D2D2A]/80 leading-relaxed">
                Saving updates will automatically recalibrate the AI study resource curation engine, adapt diagnostic question banks, and reshape module roadmap priorities.
              </p>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="mt-6 pt-4 border-t border-[#E0D8D0] flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-[#2D2D2A]/60 hover:text-[#2D2D2A] transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            id="btn-save-profile"
            onClick={handleSave}
            className="px-6 py-2.5 rounded-2xl text-xs font-bold uppercase tracking-wider text-white bg-[#5A5A40] hover:bg-[#464632] shadow-xs transition-all"
          >
            Apply & Adapt Curriculum
          </button>
        </div>
      </div>
    </div>
  );
};
