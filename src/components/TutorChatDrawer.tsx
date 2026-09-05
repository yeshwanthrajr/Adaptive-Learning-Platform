import React, { useState, useRef, useEffect } from 'react';
import { StudentProfile, ChatMessage, LearningModuleNode } from '../types';
import {
  Bot,
  X,
  Send,
  User,
  Sparkles,
  Globe,
  Mic,
  MicOff,
  Volume2,
  ExternalLink,
  Zap,
  Layers,
  Cpu,
} from 'lucide-react';
import { pcmToBase64, base64ToFloat32Audio } from '../lib/audioLiveUtils';

interface TutorChatDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  currentStudent: StudentProfile;
  currentTopic: string;
  activeModule?: LearningModuleNode | null;
  initialPrompt?: string;
}

export const TutorChatDrawer: React.FC<TutorChatDrawerProps> = ({
  isOpen,
  onClose,
  currentStudent,
  currentTopic,
  activeModule,
  initialPrompt,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'init-1',
      sender: 'tutor',
      text: `Hi ${currentStudent.name}! I'm your adaptive AI study coach. Because you prefer ${currentStudent.learningStyle} learning and love ${currentStudent.primaryInterest} ${currentStudent.interestEmoji}, I'll break down ${activeModule?.title || currentTopic} using custom mental models and practical analogies. What concept would you like to explore?`,
      timestamp: 'Just now',
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [modelTier, setModelTier] = useState<'fast' | 'balanced' | 'deep'>('balanced');
  const [useSearchGrounding, setUseSearchGrounding] = useState(false);

  // Live Voice Conversation state
  const [isVoiceActive, setIsVoiceActive] = useState(false);
  const [isVoiceConnecting, setIsVoiceConnecting] = useState(false);
  const [voiceStatus, setVoiceStatus] = useState<string>('');

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const audioContextInputRef = useRef<AudioContext | null>(null);
  const audioContextOutputRef = useRef<AudioContext | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const audioWorkletNodeRef = useRef<ScriptProcessorNode | null>(null);

  useEffect(() => {
    if (initialPrompt && isOpen) {
      setInputText(initialPrompt);
    }
  }, [initialPrompt, isOpen]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Clean up voice when drawer closes or unmounts
  useEffect(() => {
    if (!isOpen && isVoiceActive) {
      stopVoiceSession();
    }
  }, [isOpen]);

  const stopVoiceSession = () => {
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      mediaStreamRef.current = null;
    }
    if (audioWorkletNodeRef.current) {
      audioWorkletNodeRef.current.disconnect();
      audioWorkletNodeRef.current = null;
    }
    if (audioContextInputRef.current) {
      audioContextInputRef.current.close().catch(() => {});
      audioContextInputRef.current = null;
    }
    if (audioContextOutputRef.current) {
      audioContextOutputRef.current.close().catch(() => {});
      audioContextOutputRef.current = null;
    }
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
    setIsVoiceActive(false);
    setIsVoiceConnecting(false);
    setVoiceStatus('');
  };

  const startVoiceSession = async () => {
    try {
      setIsVoiceConnecting(true);
      setVoiceStatus('Accessing microphone...');

      // Request microphone access
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          channelCount: 1,
          sampleRate: 16000,
          echoCancellation: true,
          noiseSuppression: true,
        },
      });
      mediaStreamRef.current = stream;

      // Initialize AudioContexts: 16kHz for mic, 24kHz for model output playback
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      const inputCtx = new AudioCtx({ sampleRate: 16000 });
      const outputCtx = new AudioCtx({ sampleRate: 24000 });
      audioContextInputRef.current = inputCtx;
      audioContextOutputRef.current = outputCtx;

      // Connect WebSocket to /live
      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const wsUrl = `${protocol}//${window.location.host}/live`;
      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      let nextPlayTime = outputCtx.currentTime;

      ws.onopen = () => {
        setVoiceStatus('Connected to Gemini Live (Zephyr)');
        setIsVoiceConnecting(false);
        setIsVoiceActive(true);

        // Capture mic audio and send 16kHz PCM chunks
        const source = inputCtx.createMediaStreamSource(stream);
        const processor = inputCtx.createScriptProcessor(4096, 1, 1);
        audioWorkletNodeRef.current = processor;

        processor.onaudioprocess = (e) => {
          if (ws.readyState === WebSocket.OPEN) {
            const inputData = e.inputBuffer.getChannelData(0);
            const base64Audio = pcmToBase64(inputData);
            ws.send(JSON.stringify({ audio: base64Audio }));
          }
        };

        source.connect(processor);
        processor.connect(inputCtx.destination);
      };

      ws.onmessage = async (evt) => {
        try {
          const payload = JSON.parse(evt.data);
          if (payload.interrupted) {
            nextPlayTime = outputCtx.currentTime;
          }
          if (payload.audio) {
            const float32Data = base64ToFloat32Audio(payload.audio);
            const audioBuffer = outputCtx.createBuffer(1, float32Data.length, 24000);
            audioBuffer.copyToChannel(float32Data, 0);

            const bufferSource = outputCtx.createBufferSource();
            bufferSource.buffer = audioBuffer;
            bufferSource.connect(outputCtx.destination);

            const startTime = Math.max(outputCtx.currentTime, nextPlayTime);
            bufferSource.start(startTime);
            nextPlayTime = startTime + audioBuffer.duration;
          }
          if (payload.error) {
            setVoiceStatus(`Live: ${payload.error}`);
          }
        } catch (e) {
          console.error('Error handling Live audio packet:', e);
        }
      };

      ws.onerror = () => {
        setVoiceStatus('Voice connection error. Check server key.');
        stopVoiceSession();
      };

      ws.onclose = () => {
        setIsVoiceActive(false);
        setIsVoiceConnecting(false);
        setVoiceStatus('');
      };
    } catch (err: any) {
      console.error('Failed to start voice conversation:', err);
      setIsVoiceConnecting(false);
      setIsVoiceActive(false);
      setVoiceStatus('Microphone permission denied or unavailable');
    }
  };

  const toggleVoiceSession = () => {
    if (isVoiceActive || isVoiceConnecting) {
      stopVoiceSession();
    } else {
      startVoiceSession();
    }
  };

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text || isLoading) return;

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: 'Just now',
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/tutor/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          studentProfile: currentStudent,
          currentTopic,
          currentConcept: activeModule?.title || currentTopic,
          chatHistory: messages,
          modelSpeed: modelTier,
          useSearchGrounding,
        }),
      });

      const data = await res.json();
      if (data.success) {
        const tutorMsg: ChatMessage = {
          id: `tutor-${Date.now()}`,
          sender: 'tutor',
          text: data.reply,
          timestamp: 'Just now',
          modelUsed: data.modelUsed,
          groundingSources: data.groundingSources,
        };
        setMessages((prev) => [...prev, tutorMsg]);
      }
    } catch (err) {
      console.error('Tutor chat failed:', err);
      const errorMsg: ChatMessage = {
        id: `tutor-err-${Date.now()}`,
        sender: 'tutor',
        text: `I'm analyzing this concept through the lens of ${currentStudent.primaryInterest}! Whenever you encounter a difficult state, think about breaking it into smaller sub-problems. What specific part would you like me to clarify?`,
        timestamp: 'Just now',
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const QUICK_QUESTIONS = [
    `Explain ${activeModule?.title || 'this concept'} using ${currentStudent.primaryInterest}`,
    `Draw a visual ASCII schema for this`,
    `Why is this concept crucial in real-world systems?`,
    `Give me a quick 1-minute intuition check`,
  ];

  if (!isOpen) return null;

  return (
    <div
      id="drawer-tutor-chat"
      className="fixed inset-y-0 right-0 z-50 w-full max-w-md bg-[#F8F9F4] shadow-2xl border-l border-[#E0D8D0] flex flex-col animate-in slide-in-from-right duration-200"
    >
      {/* Drawer Header */}
      <div className="p-4 border-b border-[#E0D8D0] flex items-center justify-between bg-white">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-[#5A5A40] text-white flex items-center justify-center shadow-xs">
            <Bot className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-serif font-bold text-[#2D2D2A]">Socratic AI Study Coach</span>
              <span className="w-2 h-2 rounded-full bg-[#5A5A40]"></span>
            </div>
            <p className="text-[11px] text-[#2D2D2A]/60 font-serif italic">
              Adapting for {currentStudent.name} • {currentStudent.learningStyle} mode
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1">
          {/* Live Voice Conversation Toggle Button */}
          <button
            id="btn-toggle-live-voice"
            onClick={toggleVoiceSession}
            disabled={isVoiceConnecting}
            className={`p-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
              isVoiceActive
                ? 'bg-rose-600 text-white animate-pulse shadow-xs'
                : 'bg-[#F5F5F0] text-[#5A5A40] hover:bg-[#EAE8E1] border border-[#E0D8D0]'
            }`}
            title={isVoiceActive ? 'Stop Live Voice session' : 'Start Live Voice conversation (gemini-3.1-flash-live-preview)'}
          >
            {isVoiceActive ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            <span className="text-[11px] hidden sm:inline">
              {isVoiceActive ? 'Live Voice On' : 'Voice'}
            </span>
          </button>

          <button
            id="btn-close-tutor-drawer"
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#2D2D2A]/40 hover:text-[#2D2D2A] hover:bg-[#F5F5F0] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Voice Status Alert if Active/Connecting */}
      {(isVoiceActive || isVoiceConnecting || voiceStatus) && (
        <div className="px-4 py-2 bg-[#5A5A40] text-white flex items-center justify-between text-xs animate-in fade-in">
          <div className="flex items-center gap-2">
            <Volume2 className="w-3.5 h-3.5 animate-bounce" />
            <span className="text-[11px] font-medium">
              {voiceStatus || (isVoiceConnecting ? 'Connecting Live Voice...' : 'Gemini Live Active (Speak freely)')}
            </span>
          </div>
          {isVoiceActive && (
            <button
              onClick={stopVoiceSession}
              className="text-[10px] px-2 py-0.5 bg-white/20 hover:bg-white/30 rounded text-white font-medium"
            >
              Mute / End
            </button>
          )}
        </div>
      )}

      {/* Active Context Banner */}
      <div className="px-4 py-2 bg-[#E8F0E0] border-b border-[#B5BAA1]/40 flex items-center justify-between text-[11px]">
        <span className="text-[#5A5A40] font-medium truncate">
          Context: <strong>{activeModule?.title || currentTopic}</strong>
        </span>
        <span className="text-[#5A5A40] font-bold shrink-0">
          {currentStudent.interestEmoji} {currentStudent.primaryInterest}
        </span>
      </div>

      {/* Controls Bar: Model Speed / Deep Reasoning & Google Search Grounding */}
      <div className="px-4 py-2 bg-white border-b border-[#E0D8D0] flex items-center justify-between gap-2 text-xs">
        {/* Model Selector */}
        <div className="flex items-center gap-1">
          <span className="text-[10px] uppercase font-bold text-[#2D2D2A]/50 tracking-wider mr-1">Model:</span>
          <button
            id="btn-model-fast"
            onClick={() => setModelTier('fast')}
            className={`px-2 py-0.5 rounded-lg text-[10px] font-bold transition-all flex items-center gap-1 ${
              modelTier === 'fast'
                ? 'bg-[#5A5A40] text-white'
                : 'bg-[#F5F5F0] text-[#2D2D2A]/70 hover:bg-[#EAE8E1]'
            }`}
            title="Fast: gemini-3.1-flash-lite"
          >
            <Zap className="w-2.5 h-2.5" />
            Fast
          </button>
          <button
            id="btn-model-balanced"
            onClick={() => setModelTier('balanced')}
            className={`px-2 py-0.5 rounded-lg text-[10px] font-bold transition-all flex items-center gap-1 ${
              modelTier === 'balanced'
                ? 'bg-[#5A5A40] text-white'
                : 'bg-[#F5F5F0] text-[#2D2D2A]/70 hover:bg-[#EAE8E1]'
            }`}
            title="Balanced: gemini-3.5-flash"
          >
            <Sparkles className="w-2.5 h-2.5" />
            Flash
          </button>
          <button
            id="btn-model-deep"
            onClick={() => setModelTier('deep')}
            className={`px-2 py-0.5 rounded-lg text-[10px] font-bold transition-all flex items-center gap-1 ${
              modelTier === 'deep'
                ? 'bg-[#5A5A40] text-white'
                : 'bg-[#F5F5F0] text-[#2D2D2A]/70 hover:bg-[#EAE8E1]'
            }`}
            title="Deep Reasoning: gemini-3.1-pro-preview"
          >
            <Cpu className="w-2.5 h-2.5" />
            Pro
          </button>
        </div>

        {/* Search Grounding Toggle */}
        <button
          id="btn-toggle-search-grounding"
          onClick={() => setUseSearchGrounding(!useSearchGrounding)}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-[10px] font-bold transition-all border ${
            useSearchGrounding
              ? 'bg-[#E8F0E0] text-[#5A5A40] border-[#B5BAA1]'
              : 'bg-white text-[#2D2D2A]/60 border-[#E0D8D0] hover:bg-[#F5F5F0]'
          }`}
          title="Enable Google Search Grounding with gemini-3.5-flash"
        >
          <Globe className="w-3 h-3 text-[#5A5A40]" />
          <span>Search Grounding</span>
          <span
            className={`w-1.5 h-1.5 rounded-full ${
              useSearchGrounding ? 'bg-[#5A5A40]' : 'bg-neutral-300'
            }`}
          />
        </button>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((msg) => {
          const isUser = msg.sender === 'user';
          return (
            <div
              key={msg.id}
              className={`flex items-start gap-2.5 ${isUser ? 'flex-row-reverse' : ''}`}
            >
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs shrink-0 ${
                  isUser
                    ? 'bg-[#2D2D2A] text-white'
                    : 'bg-[#E8F0E0] text-[#5A5A40] border border-[#B5BAA1]/40'
                }`}
              >
                {isUser ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
              </div>

              <div className="max-w-[85%] space-y-1">
                <div
                  className={`p-3 rounded-2xl text-xs leading-relaxed ${
                    isUser
                      ? 'bg-[#5A5A40] text-white rounded-tr-xs shadow-xs'
                      : 'bg-white border border-[#E0D8D0] text-[#2D2D2A] rounded-tl-xs whitespace-pre-line shadow-2xs'
                  }`}
                >
                  {msg.text}
                </div>

                {/* Grounding Sources (if returned by Search Grounding) */}
                {msg.groundingSources && msg.groundingSources.length > 0 && (
                  <div className="p-2 bg-[#F5F5F0] rounded-xl border border-[#E0D8D0] text-[10px] space-y-1">
                    <div className="flex items-center gap-1 font-semibold text-[#5A5A40]">
                      <Globe className="w-3 h-3" />
                      <span>Google Search Sources:</span>
                    </div>
                    <ul className="space-y-0.5">
                      {msg.groundingSources.slice(0, 3).map((src, i) => (
                        <li key={i}>
                          <a
                            href={src.uri}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 text-[#5A5A40] hover:underline truncate"
                          >
                            <ExternalLink className="w-2.5 h-2.5 shrink-0" />
                            <span className="truncate">{src.title || src.uri}</span>
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {msg.modelUsed && (
                  <div className="text-[9px] text-[#2D2D2A]/40 pl-1 font-mono">
                    via {msg.modelUsed}
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {isLoading && (
          <div className="flex items-center gap-2 text-xs text-[#2D2D2A]/50 font-serif italic pl-9">
            <div className="w-2 h-2 bg-[#5A5A40] rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-[#5A5A40] rounded-full animate-bounce [animation-delay:0.2s]"></div>
            <div className="w-2 h-2 bg-[#5A5A40] rounded-full animate-bounce [animation-delay:0.4s]"></div>
            <span>
              Synthesizing with {modelTier === 'fast' ? 'Flash Lite' : modelTier === 'deep' ? 'Pro Reasoning' : 'Flash'}
              {useSearchGrounding ? ' + Search' : ''}...
            </span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Quick Prompt Chips */}
      <div className="px-4 py-2.5 border-t border-[#E0D8D0] bg-[#F5F5F0] flex items-center gap-1.5 overflow-x-auto">
        {QUICK_QUESTIONS.map((q, i) => (
          <button
            key={i}
            disabled={isLoading}
            onClick={() => handleSendMessage(q)}
            className="text-[11px] px-3 py-1 rounded-full bg-white border border-[#E0D8D0] hover:border-[#5A5A40] hover:text-[#5A5A40] text-[#2D2D2A]/80 whitespace-nowrap transition-colors"
          >
            {q}
          </button>
        ))}
      </div>

      {/* Input Field */}
      <div className="p-4 border-t border-[#E0D8D0] bg-white">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex items-center gap-2"
        >
          <input
            id="input-tutor-message"
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={`Ask in ${currentStudent.learningStyle} style (${modelTier} mode)...`}
            disabled={isLoading}
            className="flex-1 px-3.5 py-2 text-xs rounded-xl border border-[#E0D8D0] text-[#2D2D2A] focus:outline-none focus:ring-2 focus:ring-[#5A5A40] bg-[#F8F9F4]"
          />
          <button
            id="btn-send-tutor-message"
            type="submit"
            disabled={isLoading || !inputText.trim()}
            className="p-2 rounded-xl bg-[#5A5A40] text-white hover:bg-[#464632] disabled:opacity-50 transition-all shadow-xs"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
