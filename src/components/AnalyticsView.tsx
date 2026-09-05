import React from 'react';
import { StudentProfile } from '../types';
import { 
  BarChart3, 
  Award, 
  Flame, 
  Brain, 
  AlertCircle, 
  CheckCircle2, 
  Sparkles, 
  Layers, 
  Clock,
  Compass,
  ArrowUpRight,
  RotateCcw
} from 'lucide-react';

interface AnalyticsViewProps {
  currentStudent: StudentProfile;
  onOpenProfileModal: () => void;
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({
  currentStudent,
  onOpenProfileModal,
}) => {
  const subSkills = Object.entries(currentStudent.subSkillMasteries || {}) as [string, number][];

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-in fade-in duration-150">
      
      {/* Top Overview Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-[24px] p-5 border border-[#E0D8D0] shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[#E8F0E0] text-[#5A5A40] flex items-center justify-center shrink-0 border border-[#B5BAA1]/40">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs text-[#2D2D2A]/60 font-serif italic">Overall Mastery</div>
            <div className="text-2xl font-serif font-bold text-[#2D2D2A] mt-0.5">
              {currentStudent.overallMasteryScore}%
            </div>
            <div className="text-[10px] text-[#5A5A40] font-bold flex items-center gap-0.5 mt-0.5">
              <ArrowUpRight className="w-3 h-3" />
              <span>+6% this week</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-[24px] p-5 border border-[#E0D8D0] shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[#FDF6E2] text-[#D4A373] flex items-center justify-center shrink-0 border border-[#E4D19E]">
            <Flame className="w-6 h-6 fill-[#D4A373]" />
          </div>
          <div>
            <div className="text-xs text-[#2D2D2A]/60 font-serif italic">Learning Streak</div>
            <div className="text-2xl font-serif font-bold text-[#2D2D2A] mt-0.5">
              {currentStudent.currentStreakDays} Days
            </div>
            <div className="text-[10px] text-[#8C6B1C] font-bold mt-0.5">
              Consistency Booster
            </div>
          </div>
        </div>

        <div className="bg-white rounded-[24px] p-5 border border-[#E0D8D0] shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[#F5F5F0] text-[#5A5A40] flex items-center justify-center shrink-0 border border-[#E0D8D0]">
            <Layers className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs text-[#2D2D2A]/60 font-serif italic">Completed Modules</div>
            <div className="text-2xl font-serif font-bold text-[#2D2D2A] mt-0.5">
              {currentStudent.completedModulesCount}
            </div>
            <div className="text-[10px] text-[#5A5A40] font-bold mt-0.5">
              Adaptive checkpoints
            </div>
          </div>
        </div>

        <div className="bg-white rounded-[24px] p-5 border border-[#E0D8D0] shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[#E8F0E0] text-[#5A5A40] flex items-center justify-center shrink-0 border border-[#B5BAA1]/40">
            <Brain className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs text-[#2D2D2A]/60 font-serif italic">Cognitive Modality</div>
            <div className="text-base font-serif font-bold text-[#2D2D2A] capitalize mt-0.5">
              {currentStudent.learningStyle}
            </div>
            <div className="text-[10px] text-[#2D2D2A]/50 font-medium mt-0.5">
              Pacing: {currentStudent.pacing}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left 7 Cols: Sub-skill Mastery Matrix */}
        <div className="lg:col-span-7 bg-white rounded-[32px] p-6 sm:p-8 border border-[#E0D8D0] shadow-xs space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-[#E0D8D0]">
            <div>
              <h3 className="text-base font-serif font-bold text-[#2D2D2A]">
                Cognitive Skill Mastery Breakdown
              </h3>
              <p className="text-xs text-[#2D2D2A]/60 font-serif italic">
                Calibrated by adaptive diagnostic assessments
              </p>
            </div>
            <span className="text-[10px] uppercase tracking-wider px-3 py-1 rounded-full font-bold bg-[#E8F0E0] text-[#5A5A40] border border-[#B5BAA1]/40">
              {subSkills.length} Sub-skills Monitored
            </span>
          </div>

          <div className="space-y-4">
            {subSkills.map(([skill, score]) => {
              let scoreColor = 'bg-[#5A5A40]';
              let badgeColor = 'bg-[#F5F5F0] text-[#2D2D2A] border border-[#E0D8D0]';
              let statusLabel = 'Proficient';

              if (score >= 85) {
                scoreColor = 'bg-[#5A5A40]';
                badgeColor = 'bg-[#E8F0E0] text-[#5A5A40] border border-[#B5BAA1]/40';
                statusLabel = 'Mastered';
              } else if (score < 50) {
                scoreColor = 'bg-[#D4A373]';
                badgeColor = 'bg-[#FDF6E2] text-[#8C6B1C] border border-[#E4D19E]';
                statusLabel = 'Needs Scaffold';
              }

              return (
                <div key={skill} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-[#2D2D2A]">{skill}</span>
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${badgeColor}`}>
                        {statusLabel}
                      </span>
                      <span className="font-serif font-bold text-[#2D2D2A] w-8 text-right">{score}%</span>
                    </div>
                  </div>
                  <div className="h-2 w-full bg-[#F5F5F0] rounded-full overflow-hidden border border-[#E0D8D0]/60">
                    <div
                      className={`h-full rounded-full ${scoreColor} transition-all duration-500`}
                      style={{ width: `${score}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="pt-3 border-t border-[#E0D8D0] flex items-center justify-between">
            <span className="text-xs text-[#2D2D2A]/60 font-serif italic">
              Interest Context: <strong className="text-[#2D2D2A] font-bold not-italic">{currentStudent.primaryInterest}</strong>
            </span>
            <button
              onClick={onOpenProfileModal}
              className="text-xs font-bold uppercase tracking-wider text-[#5A5A40] hover:text-[#464632] underline transition-colors"
            >
              Update Preferences →
            </button>
          </div>
        </div>

        {/* Right 5 Cols: Misconceptions Log & AI Adaptation History */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Diagnosed Misconceptions */}
          <div className="bg-white rounded-[32px] p-6 border border-[#E0D8D0] shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-serif font-bold text-[#2D2D2A] flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-[#D4A373]" />
                <span>Misconceptions Diagnosis Log</span>
              </h4>
              <span className="text-[10px] text-[#2D2D2A]/40 uppercase font-bold tracking-wider">AI Psychometrics</span>
            </div>

            <div className="space-y-3">
              {currentStudent.diagnosedMisconceptions.map((misc) => (
                <div
                  key={misc.id}
                  className={`p-3.5 rounded-2xl border text-xs space-y-1 ${
                    misc.resolved
                      ? 'bg-[#E8F0E0]/60 border-[#B5BAA1]/40'
                      : 'bg-[#FDF6E2] border-[#E4D19E]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[#2D2D2A]">{misc.concept}</span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        misc.resolved
                          ? 'bg-[#E8F0E0] text-[#5A5A40] border border-[#B5BAA1]/50'
                          : 'bg-[#FDF6E2] text-[#8C6B1C] border border-[#E4D19E]'
                      }`}
                    >
                      {misc.resolved ? 'Resolved' : 'Active Scaffold'}
                    </span>
                  </div>
                  <p className="text-[#2D2D2A]/70 text-[11px] leading-relaxed font-serif italic">
                    {misc.description}
                  </p>
                  <div className="text-[10px] text-[#2D2D2A]/40 pt-1">
                    Detected: {misc.detectedAt}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* AI Automated Adaptation History */}
          <div className="bg-[#2D2D2A] text-[#F8F9F4] rounded-[32px] p-6 border border-[#464632] space-y-3">
            <div className="flex items-center gap-2 text-[#B5BAA1] text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-4 h-4 text-[#D4A373]" />
              <span>Real-Time Adaptation Feed</span>
            </div>

            <div className="space-y-2.5 text-xs text-[#F8F9F4]/80">
              <div className="p-3 rounded-2xl bg-white/5 border border-white/10">
                <span className="font-bold text-[#F8F9F4] block text-[11px] mb-0.5">Scaffold Injected</span>
                <span className="font-serif italic text-white/70">Inserted "Visualizing the Call Stack" module before Binary Trees to address recursion misconception.</span>
              </div>

              <div className="p-3 rounded-2xl bg-white/5 border border-white/10">
                <span className="font-bold text-[#F8F9F4] block text-[11px] mb-0.5">Interest Hook Updated</span>
                <span className="font-serif italic text-white/70">Framed all spatial partition problems using 2D/3D video game tilemap examples.</span>
              </div>

              <div className="p-3 rounded-2xl bg-white/5 border border-white/10">
                <span className="font-bold text-[#F8F9F4] block text-[11px] mb-0.5">Modality Calibrated</span>
                <span className="font-serif italic text-white/70">Loaded ASCII mental flowcharts into memory management study guides.</span>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
