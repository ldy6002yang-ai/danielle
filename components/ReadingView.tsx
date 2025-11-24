import React, { useState, useEffect } from 'react';
import { BookOpen, Loader2, Search, Zap, Crosshair, Check, Trophy, RefreshCw } from 'lucide-react';
import { ARTICLE_CONTENT, ARTICLE_TITLE, SKIMMING_TIPS, VOCAB_HUNT_ITEMS } from '../constants';
import { analyzeTextSelection } from '../services/geminiService';

type ReadingMode = 'deep' | 'skim' | 'hunt';

export const ReadingView: React.FC = () => {
  const [mode, setMode] = useState<ReadingMode>('deep');
  const [selectedText, setSelectedText] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<{ pinyin: string; translation: string; culturalContext: string } | null>(null);
  const [loading, setLoading] = useState(false);

  // Skimming State
  const [foundSignposts, setFoundSignposts] = useState<string[]>([]);
  const signposts = ["首先", "其次", "最后", "综上所述"];

  // Hunt State
  const [currentHuntIndex, setCurrentHuntIndex] = useState(0);
  const [huntFound, setHuntFound] = useState(false);

  const resetActivities = () => {
    setFoundSignposts([]);
    setCurrentHuntIndex(0);
    setHuntFound(false);
    setSelectedText(null);
    setAnalysis(null);
  };

  const handleModeChange = (newMode: ReadingMode) => {
    setMode(newMode);
    resetActivities();
  };

  const handleTextSelection = async () => {
    const selection = window.getSelection();
    const text = selection?.toString().trim();
    
    if (!text || text.length === 0) return;
    setSelectedText(text);

    if (mode === 'deep') {
      setLoading(true);
      setAnalysis(null);
      const result = await analyzeTextSelection(text);
      setAnalysis(result);
      setLoading(false);
    } 
    else if (mode === 'skim') {
      if (signposts.includes(text) && !foundSignposts.includes(text)) {
        setFoundSignposts(prev => [...prev, text]);
      }
    }
    else if (mode === 'hunt') {
      const target = VOCAB_HUNT_ITEMS[currentHuntIndex].term;
      if (text === target) {
        setHuntFound(true);
        setTimeout(() => {
          if (currentHuntIndex < VOCAB_HUNT_ITEMS.length - 1) {
            setCurrentHuntIndex(prev => prev + 1);
            setHuntFound(false);
          }
        }, 1500);
      }
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-full overflow-hidden">
      {/* Main Text Area */}
      <div className="flex-1 bg-white rounded-xl shadow-sm border border-stone-200 overflow-y-auto p-4 md:p-8 relative">
        <div className="flex justify-between items-center mb-8 border-b border-stone-100 pb-4">
          <h1 className="text-3xl font-bold font-serif-sc text-stone-800 text-center">
            {ARTICLE_TITLE}
          </h1>
          
          <div className="flex bg-stone-100 p-1 rounded-lg">
            <ModeButton active={mode === 'deep'} onClick={() => handleModeChange('deep')} icon={<BookOpen className="w-4 h-4" />} label="Read" />
            <ModeButton active={mode === 'skim'} onClick={() => handleModeChange('skim')} icon={<Zap className="w-4 h-4" />} label="Skim" />
            <ModeButton active={mode === 'hunt'} onClick={() => handleModeChange('hunt')} icon={<Crosshair className="w-4 h-4" />} label="Hunt" />
          </div>
        </div>
        
        <div 
          className={`prose prose-lg prose-stone max-w-none font-serif-sc leading-loose text-stone-700 transition-all duration-500 ${mode === 'skim' ? 'blur-[0.5px] hover:blur-none' : ''}`}
          onMouseUp={handleTextSelection}
        >
          {ARTICLE_CONTENT.map((section) => (
            <p key={section.id} className="mb-6 indent-8 text-lg">
              {section.content}
            </p>
          ))}
        </div>

        {/* Tips Section (only visible in Deep Mode) */}
        {mode === 'deep' && (
          <div className="mt-8 p-4 bg-stone-50 rounded-lg border border-stone-200">
            <h3 className="flex items-center gap-2 font-bold text-stone-600 mb-2 font-serif-sc">
              <BookOpen className="w-5 h-5" />
              Skimming Tips (略读法)
            </h3>
            <ul className="list-disc list-inside text-stone-600 space-y-1 text-sm">
              {SKIMMING_TIPS.map((tip, idx) => (
                <li key={idx}>{tip}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Sidebar / Activity Panel */}
      <div className="lg:w-80 bg-[#fdfbf7] border-l border-stone-200 p-4 flex flex-col gap-4 shadow-inner lg:shadow-none h-auto shrink-0 overflow-y-auto">
        
        {/* Deep Reading Mode Panel */}
        {mode === 'deep' && (
          <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-sm sticky top-0">
            <h2 className="font-bold text-stone-800 flex items-center gap-2 mb-4 font-serif-sc">
              <Search className="w-4 h-4 text-red-700" />
              Instant Analysis
            </h2>
            
            {!selectedText ? (
              <div className="text-stone-400 text-sm text-center py-8 italic">
                Select any text to reveal its Pinyin, meaning, and cultural significance.
              </div>
            ) : (
              <div className="space-y-4">
                <div className="pb-2 border-b border-stone-100">
                  <span className="text-xs font-semibold text-stone-400 uppercase tracking-wider">Selected</span>
                  <p className="text-2xl font-serif-sc text-red-900 mt-1">{selectedText}</p>
                </div>

                {loading ? (
                  <div className="flex justify-center py-4">
                    <Loader2 className="w-6 h-6 animate-spin text-red-600" />
                  </div>
                ) : analysis ? (
                  <>
                    <div>
                      <span className="text-xs font-semibold text-stone-400 uppercase tracking-wider">Pinyin</span>
                      <p className="font-medium text-stone-700 font-serif-sc">{analysis.pinyin}</p>
                    </div>
                    <div>
                      <span className="text-xs font-semibold text-stone-400 uppercase tracking-wider">Meaning</span>
                      <p className="text-stone-700 leading-relaxed">{analysis.translation}</p>
                    </div>
                    <div className="bg-amber-50 p-3 rounded border border-amber-100">
                      <span className="text-xs font-semibold text-amber-700 uppercase tracking-wider">Context</span>
                      <p className="text-sm text-amber-900 mt-1">{analysis.culturalContext}</p>
                    </div>
                  </>
                ) : null}
              </div>
            )}
          </div>
        )}

        {/* Skimming Mode Panel */}
        {mode === 'skim' && (
          <div className="bg-white p-6 rounded-xl border border-stone-200 shadow-sm sticky top-0">
             <h2 className="font-bold text-stone-800 flex items-center gap-2 mb-4 font-serif-sc">
              <Zap className="w-4 h-4 text-amber-600" />
              Find the "Signposts"
            </h2>
            <p className="text-sm text-stone-500 mb-4">
              Highlight the transition words mentioned in the tips to understand the article structure.
            </p>
            <div className="space-y-3">
              {signposts.map(sign => (
                <div key={sign} className={`flex items-center justify-between p-3 rounded-lg border ${foundSignposts.includes(sign) ? 'bg-green-50 border-green-200' : 'bg-stone-50 border-stone-100'}`}>
                  <span className="font-serif-sc font-bold text-stone-700">{sign}</span>
                  {foundSignposts.includes(sign) ? <Check className="w-5 h-5 text-green-600" /> : <div className="w-5 h-5 rounded-full border-2 border-stone-300" />}
                </div>
              ))}
            </div>
            {foundSignposts.length === signposts.length && (
              <div className="mt-6 p-4 bg-red-50 text-red-800 rounded-lg text-center animate-bounce">
                <Trophy className="w-8 h-8 mx-auto mb-2" />
                <p className="font-bold">Master Skimmer!</p>
              </div>
            )}
          </div>
        )}

        {/* Vocab Hunt Mode Panel */}
        {mode === 'hunt' && (
          <div className="bg-white p-6 rounded-xl border border-stone-200 shadow-sm sticky top-0">
             <h2 className="font-bold text-stone-800 flex items-center gap-2 mb-4 font-serif-sc">
              <Crosshair className="w-4 h-4 text-red-600" />
              Vocabulary Hunt
            </h2>
            
            {huntFound ? (
              <div className="text-center py-8">
                <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Check className="w-6 h-6" />
                </div>
                <p className="text-green-800 font-bold text-lg">Correct!</p>
                <p className="text-stone-500">Next word coming up...</p>
              </div>
            ) : currentHuntIndex < VOCAB_HUNT_ITEMS.length ? (
              <div className="bg-red-50 p-6 rounded-xl border border-red-100 text-center">
                <span className="text-xs font-bold text-red-400 uppercase tracking-widest">Target {currentHuntIndex + 1}/{VOCAB_HUNT_ITEMS.length}</span>
                <p className="text-lg font-bold text-stone-800 mt-2 mb-4">{VOCAB_HUNT_ITEMS[currentHuntIndex].clue}</p>
                <div className="text-xs text-stone-500 bg-white/50 p-2 rounded">
                  Highlight the matching Chinese word in the text.
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <Trophy className="w-12 h-12 text-amber-500 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-stone-800">Hunt Complete!</h3>
                <button onClick={resetActivities} className="mt-4 flex items-center gap-2 mx-auto text-sm text-red-600 hover:underline">
                  <RefreshCw className="w-3 h-3" /> Play Again
                </button>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
};

const ModeButton: React.FC<{ active: boolean; onClick: () => void; icon: React.ReactNode; label: string }> = ({ active, onClick, icon, label }) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
      active 
        ? 'bg-white text-stone-800 shadow-sm' 
        : 'text-stone-500 hover:text-stone-700'
    }`}
  >
    {icon}
    {label}
  </button>
);