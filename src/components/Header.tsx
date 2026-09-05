import React, { useState } from 'react';
import { StudentProfile } from '../types';
import {
  Sparkles,
  Sliders,
  Flame,
  ChevronDown,
  Check,
  Bot,
  BookOpen,
  Compass,
  CheckCircle2,
  BarChart3,
  LogIn,
  LogOut,
  User as UserIcon,
} from 'lucide-react';
import { User } from 'firebase/auth';

interface HeaderProps {
  currentStudent: StudentProfile;
  allStudents: StudentProfile[];
  onSelectStudent: (student: StudentProfile) => void;
  onOpenProfileModal: () => void;
  activeTab: 'path' | 'assessment' | 'resources' | 'analytics';
  onChangeTab: (tab: 'path' | 'assessment' | 'resources' | 'analytics') => void;
  onOpenTutor: () => void;
  isTutorOpen: boolean;
  user: User | null;
  onSignIn: () => void;
  onSignOut: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentStudent,
  allStudents,
  onSelectStudent,
  onOpenProfileModal,
  activeTab,
  onChangeTab,
  onOpenTutor,
  isTutorOpen,
  user,
  onSignIn,
  onSignOut,
}) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const getStyleLabel = (style: string) => {
    switch (style) {
      case 'visual':
        return 'Visual Schematics';
      case 'hands-on':
        return 'Hands-on Labs';
      case 'conceptual':
        return 'First-Principles';
      case 'concise':
        return 'Concise Drills';
      default:
        return style;
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#E0D8D0] shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Logo & Platform Title */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="w-10 h-10 rounded-2xl bg-[#5A5A40] flex items-center justify-center text-white font-serif italic text-xl shadow-xs">
              A
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-serif font-bold text-lg tracking-tight text-[#2D2D2A] leading-none">AuraLearn</span>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#E8F0E0] text-[#5A5A40] border border-[#B5BAA1]/40 uppercase tracking-wide">
                  <Sparkles className="w-3 h-3 text-[#5A5A40]" />
                  Adaptive
                </span>
              </div>
              <p className="text-[10px] uppercase tracking-widest text-[#2D2D2A]/50 font-bold mt-0.5 hidden sm:block">Personalized Adaptive Engine</p>
            </div>
          </div>

          {/* Primary View Navigation Tabs */}
          <nav className="flex items-center gap-1 bg-[#F5F5F0] p-1 rounded-2xl border border-[#E0D8D0]">
            <button
              id="tab-path"
              onClick={() => onChangeTab('path')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'path'
                  ? 'bg-[#5A5A40] text-white shadow-xs'
                  : 'text-[#2D2D2A]/70 hover:text-[#2D2D2A] hover:bg-white/60'
              }`}
            >
              <Compass className="w-3.5 h-3.5" />
              <span>Learning Path</span>
            </button>

            <button
              id="tab-assessment"
              onClick={() => onChangeTab('assessment')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'assessment'
                  ? 'bg-[#5A5A40] text-white shadow-xs'
                  : 'text-[#2D2D2A]/70 hover:text-[#2D2D2A] hover:bg-white/60'
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Adaptive Quiz</span>
            </button>

            <button
              id="tab-resources"
              onClick={() => onChangeTab('resources')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'resources'
                  ? 'bg-[#5A5A40] text-white shadow-xs'
                  : 'text-[#2D2D2A]/70 hover:text-[#2D2D2A] hover:bg-white/60'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Study Resources</span>
            </button>

            <button
              id="tab-analytics"
              onClick={() => onChangeTab('analytics')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'analytics'
                  ? 'bg-[#5A5A40] text-white shadow-xs'
                  : 'text-[#2D2D2A]/70 hover:text-[#2D2D2A] hover:bg-white/60'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5" />
              <span>Analytics</span>
            </button>
          </nav>

          {/* Student Persona Switcher & Controls */}
          <div className="flex items-center gap-2">
            
            {/* Quick Socratic AI Tutor Drawer Toggle */}
            <button
              id="btn-open-tutor"
              onClick={onOpenTutor}
              className={`relative inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium border transition-colors ${
                isTutorOpen
                  ? 'bg-[#5A5A40] text-white border-[#5A5A40] shadow-xs'
                  : 'bg-[#F5F5F0] text-[#5A5A40] border-[#E0D8D0] hover:bg-[#EAE8E1]'
              }`}
              title="Open Socratic AI Study Coach"
            >
              <Bot className="w-4 h-4" />
              <span className="hidden md:inline font-semibold">AI Tutor</span>
              <span className="w-2 h-2 rounded-full bg-[#D4A373] absolute -top-0.5 -right-0.5 ring-2 ring-white"></span>
            </button>

            {/* Persona Switcher Dropdown */}
            <div className="relative">
              <button
                id="btn-persona-selector"
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2 p-1.5 sm:px-3 sm:py-1.5 rounded-2xl border border-[#E0D8D0] hover:border-[#5A5A40]/40 bg-white shadow-2xs transition-all text-left"
              >
                <img
                  src={currentStudent.avatar}
                  alt={currentStudent.name}
                  className="w-7 h-7 rounded-full object-cover ring-1 ring-[#E0D8D0]"
                />
                <div className="hidden lg:block">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-[#2D2D2A] leading-none">{currentStudent.name}</span>
                    <span className="text-xs">{currentStudent.interestEmoji}</span>
                  </div>
                  <span className="text-[10px] text-[#2D2D2A]/60 font-medium leading-tight block">
                    {getStyleLabel(currentStudent.learningStyle)}
                  </span>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-[#2D2D2A]/40" />
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-72 bg-white rounded-3xl shadow-xl border border-[#E0D8D0] py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="px-4 py-2.5 border-b border-[#E0D8D0]">
                    <div className="text-[10px] font-bold text-[#2D2D2A]/40 uppercase tracking-widest">
                      Switch Student Profile
                    </div>
                    <p className="text-xs text-[#2D2D2A]/70 mt-0.5 font-serif italic">
                      Curriculum, analogies, and quizzes adapt automatically.
                    </p>
                  </div>

                  <div className="py-1">
                    {allStudents.map((student) => {
                      const isSelected = student.id === currentStudent.id;
                      return (
                        <button
                          key={student.id}
                          onClick={() => {
                            onSelectStudent(student);
                            setDropdownOpen(false);
                          }}
                          className={`w-full text-left px-4 py-2.5 flex items-center justify-between hover:bg-[#F5F5F0] transition-colors ${
                            isSelected ? 'bg-[#F5F5F0] font-semibold' : ''
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            <img
                              src={student.avatar}
                              alt={student.name}
                              className="w-8 h-8 rounded-full object-cover ring-1 ring-[#E0D8D0]"
                            />
                            <div>
                              <div className="flex items-center gap-1.5">
                                <span className="text-xs font-bold text-[#2D2D2A]">{student.name}</span>
                                <span className="text-xs">{student.interestEmoji}</span>
                              </div>
                              <div className="text-[11px] text-[#2D2D2A]/60 line-clamp-1">
                                {student.headline}
                              </div>
                            </div>
                          </div>
                          {isSelected && <Check className="w-4 h-4 text-[#5A5A40] shrink-0" />}
                        </button>
                      );
                    })}
                  </div>

                  <div className="px-3 pt-2 border-t border-[#E0D8D0]">
                    <button
                      id="btn-edit-student-preferences"
                      onClick={() => {
                        setDropdownOpen(false);
                        onOpenProfileModal();
                      }}
                      className="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-bold text-[#5A5A40] bg-[#F5F5F0] hover:bg-[#EAE8E1] border border-[#E0D8D0] transition-colors"
                    >
                      <Sliders className="w-3.5 h-3.5" />
                      <span>Customize Learning Preferences</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Quick Streak & Stats Chip */}
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 bg-[#F5F5F0] text-[#5A5A40] rounded-xl border border-[#E0D8D0] text-xs font-semibold">
              <Flame className="w-3.5 h-3.5 text-[#D4A373] fill-[#D4A373]" />
              <span>{currentStudent.currentStreakDays}d Streak</span>
            </div>

            {/* Firebase Google Auth Login/Logout Action */}
            {user ? (
              <div className="flex items-center gap-2 pl-1">
                <div
                  className="hidden xl:flex items-center gap-1.5 text-xs text-[#2D2D2A]/70 px-2.5 py-1 rounded-xl bg-[#E8F0E0] border border-[#B5BAA1]/40"
                  title={`Signed in as ${user.email}`}
                >
                  <span className="w-2 h-2 rounded-full bg-[#5A5A40]"></span>
                  <span className="font-semibold text-[11px] truncate max-w-[110px]">
                    {user.displayName || user.email?.split('@')[0]}
                  </span>
                </div>
                <button
                  id="btn-sign-out"
                  onClick={onSignOut}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-[#F5F5F0] text-[#2D2D2A]/70 hover:text-rose-600 hover:bg-rose-50 border border-[#E0D8D0] transition-colors"
                  title="Sign out of Firebase"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Sign Out</span>
                </button>
              </div>
            ) : (
              <button
                id="btn-google-sign-in"
                onClick={onSignIn}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-[#5A5A40] text-white hover:bg-[#464632] shadow-xs transition-all"
                title="Sign in with Google to sync progress to cloud"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Sign In</span>
              </button>
            )}

          </div>
        </div>
      </div>
    </header>
  );
};
