import React, { useState } from 'react';
import { ArrowRight, Printer, History, Users, RefreshCw, Sparkles, Scale, BookOpenCheck } from 'lucide-react';
import { generateCulturalComparison } from '../services/geminiService';
import { DEBATE_ARGUMENTS } from '../constants';

export const CultureView: React.FC = () => {
  const [compareInput, setCompareInput] = useState("");
  const [comparison, setComparison] = useState<{traditional: string, simplified: string, explanation: string} | null>(null);
  const [loading, setLoading] = useState(false);

  // Debate State
  const [sortedArgs, setSortedArgs] = useState<Record<string, 'pro' | 'anti'>>({});

  const handleCompare = async () => {
    if(!compareInput) return;
    setLoading(true);
    const result = await generateCulturalComparison(compareInput);
    setComparison(result);
    setLoading(false);
  };

  const toggleSort = (id: string, side: 'pro' | 'anti') => {
    setSortedArgs(prev => ({ ...prev, [id]: side }));
  };

  const getScore = () => {
    let score = 0;
    Object.entries(sortedArgs).forEach(([id, side]) => {
      const correctSide = DEBATE_ARGUMENTS.find(a => a.id === id)?.side;
      if (side === correctSide) score++;
    });
    return score;
  };

  const presetConcepts = ["Horse (Ma)", "Door (Men)", "Learn (Xue)", "Dragon (Long)"];

  return (
    <div className="h-full overflow-y-auto pb-20">
      <div className="max-w-5xl mx-auto space-y-12">
        
        {/* Hero Section */}
        <div className="relative bg-[#7f1d1d] rounded-2xl p-8 text-amber-50 shadow-lg overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[url('https://www.transparenttextures.com/patterns/black-scales.png')] opacity-10 pointer-events-none"></div>
          <h2 className="text-4xl font-bold font-serif-sc mb-4 relative z-10">Historical Evolution</h2>
          <p className="text-red-100 text-lg max-w-2xl font-serif-sc relative z-10">
            From Oracle Bones to Simplified Characters: A journey of efficiency, aesthetics, and accessibility.
          </p>
        </div>

        {/* 3 Pillars from Text */}
        <div className="grid md:grid-cols-3 gap-6">
          <PillarCard 
            icon={<History className="w-6 h-6" />}
            title="Recording Efficiency"
            desc="Originally carved on bones. Complex strokes meant slow recording. Simplification began as early as handwriting existed."
            color="blue"
          />
          <PillarCard 
            icon={<Printer className="w-6 h-6" />}
            title="Printing Tech"
            desc="Complex characters blurred when printed cheaply. Standardization was driven by the need for clear mass production."
            color="amber"
          />
          <PillarCard 
            icon={<Users className="w-6 h-6" />}
            title="Literacy for All"
            desc="Historically for the elite. Simplification in the 1950s aimed to teach 400 million citizens how to read."
            color="red"
          />
        </div>

        {/* Debate Activity */}
        <div className="bg-stone-100 rounded-2xl p-8 border border-stone-200 relative overflow-hidden">
             <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-stone-300 via-stone-400 to-stone-300"></div>
             <div className="flex items-center gap-3 mb-6 relative z-10">
                <Scale className="w-8 h-8 text-stone-600" />
                <div>
                    <h3 className="text-2xl font-bold text-stone-800 font-serif-sc">The Great Debate</h3>
                    <p className="text-stone-500 text-sm">Sort the arguments based on the perspectives mentioned in the article.</p>
                </div>
                <div className="ml-auto bg-stone-200 px-4 py-2 rounded-full font-bold text-stone-600">
                    Score: {getScore()} / {DEBATE_ARGUMENTS.length}
                </div>
             </div>

             <div className="grid md:grid-cols-2 gap-8">
                <div className="bg-white p-4 rounded-xl border-t-4 border-t-red-800 shadow-sm min-h-[300px]">
                    <h4 className="text-center font-bold text-red-900 mb-4 font-serif-sc border-b pb-2">Support Traditional (Keep Complexity)</h4>
                    <div className="space-y-3">
                        {DEBATE_ARGUMENTS.filter(a => sortedArgs[a.id] === 'anti').map(a => (
                            <div key={a.id} className="p-3 bg-red-50 text-red-900 rounded border border-red-100 text-sm cursor-pointer hover:bg-red-100" onClick={() => setSortedArgs(prev => { const n = {...prev}; delete n[a.id]; return n; })}>
                                {a.text}
                            </div>
                        ))}
                         {Object.keys(sortedArgs).length < DEBATE_ARGUMENTS.length && (
                            <div className="border-2 border-dashed border-stone-200 rounded p-4 text-center text-stone-400 text-xs mt-4">
                                Drop arguments here
                            </div>
                        )}
                    </div>
                </div>

                <div className="bg-white p-4 rounded-xl border-t-4 border-t-emerald-700 shadow-sm min-h-[300px]">
                    <h4 className="text-center font-bold text-emerald-900 mb-4 font-serif-sc border-b pb-2">Support Simplified (Increase Efficiency)</h4>
                    <div className="space-y-3">
                         {DEBATE_ARGUMENTS.filter(a => sortedArgs[a.id] === 'pro').map(a => (
                            <div key={a.id} className="p-3 bg-emerald-50 text-emerald-900 rounded border border-emerald-100 text-sm cursor-pointer hover:bg-emerald-100" onClick={() => setSortedArgs(prev => { const n = {...prev}; delete n[a.id]; return n; })}>
                                {a.text}
                            </div>
                        ))}
                    </div>
                </div>
             </div>

             <div className="mt-8">
                <p className="text-center text-stone-500 mb-4 text-sm font-serif-sc uppercase tracking-widest">- Unsorted Arguments -</p>
                <div className="flex flex-wrap justify-center gap-3">
                    {DEBATE_ARGUMENTS.filter(a => !sortedArgs[a.id]).map(a => (
                        <div key={a.id} className="bg-white border border-stone-300 shadow-sm px-4 py-2 rounded-lg hover:shadow-md transition-shadow flex gap-2 items-center group">
                            <span className="text-stone-700 text-sm font-medium">{a.text}</span>
                            <div className="flex gap-1 ml-2 opacity-20 group-hover:opacity-100 transition-opacity">
                                <button onClick={() => toggleSort(a.id, 'anti')} className="w-6 h-6 rounded bg-red-100 text-red-700 hover:bg-red-200 flex items-center justify-center" title="Traditional">T</button>
                                <button onClick={() => toggleSort(a.id, 'pro')} className="w-6 h-6 rounded bg-emerald-100 text-emerald-700 hover:bg-emerald-200 flex items-center justify-center" title="Simplified">S</button>
                            </div>
                        </div>
                    ))}
                    {DEBATE_ARGUMENTS.filter(a => !sortedArgs[a.id]).length === 0 && (
                        <p className="text-stone-400 italic">All arguments sorted!</p>
                    )}
                </div>
             </div>
        </div>

        {/* Interactive Comparison Tool */}
        <div className="bg-white border border-stone-200 rounded-2xl p-8 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <RefreshCw className="w-6 h-6 text-red-600" />
            <h3 className="text-2xl font-bold text-stone-800 font-serif-sc">Simplification Analyzer</h3>
          </div>
          
          <div className="flex flex-col md:flex-row gap-8">
            <div className="flex-1 space-y-6">
              <p className="text-stone-600 leading-relaxed">
                Enter a concept or character to see how and why it changed. This tool uses AI to explain the phonetic substitutions or component removals.
              </p>
              
              <div className="relative">
                <input 
                  type="text" 
                  value={compareInput}
                  onChange={(e) => setCompareInput(e.target.value)}
                  placeholder="e.g., Love, Dragon, Car..."
                  className="w-full p-4 pl-4 pr-32 bg-stone-50 border border-stone-300 rounded-lg focus:ring-2 focus:ring-red-500 outline-none transition-all font-serif-sc"
                />
                <button 
                  onClick={handleCompare}
                  disabled={loading || !compareInput}
                  className="absolute right-2 top-2 bottom-2 bg-[#7f1d1d] text-white px-4 rounded-md font-medium hover:bg-red-900 disabled:opacity-50 transition-colors flex items-center gap-2"
                >
                  {loading ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Sparkles className="w-4 h-4" />}
                  Analyze
                </button>
              </div>

              <div>
                <span className="text-xs font-bold text-stone-400 uppercase tracking-widest block mb-2">Try these concepts</span>
                <div className="flex flex-wrap gap-2">
                  {presetConcepts.map(concept => (
                    <button 
                      key={concept}
                      onClick={() => { setCompareInput(concept); }}
                      className="text-sm bg-stone-50 border border-stone-200 px-4 py-2 rounded-full text-stone-600 hover:border-red-300 hover:text-red-700 transition-colors"
                    >
                      {concept}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex-1">
              {comparison ? (
                <div className="bg-[#fffcf5] p-6 rounded-xl border border-stone-200 shadow-inner h-full flex flex-col justify-center">
                  <div className="flex items-center justify-center gap-8 mb-8 relative">
                    <div className="absolute inset-0 flex items-center justify-center opacity-5">
                        <span className="text-9xl font-serif-sc">文</span>
                    </div>
                    <div className="text-center relative z-10">
                      <div className="text-6xl font-serif-sc font-bold text-stone-400 mb-2">{comparison.traditional}</div>
                      <span className="text-xs uppercase tracking-wider text-stone-500 font-bold">Traditional</span>
                    </div>
                    <ArrowRight className="text-red-800 w-8 h-8 relative z-10" />
                    <div className="text-center relative z-10">
                      <div className="text-6xl font-serif-sc font-bold text-red-800 mb-2">{comparison.simplified}</div>
                      <span className="text-xs uppercase tracking-wider text-red-800 font-bold">Simplified</span>
                    </div>
                  </div>
                  <div className="bg-white/60 p-4 rounded border border-stone-100 backdrop-blur-sm">
                    <p className="text-stone-700 text-sm italic leading-relaxed text-center">
                        "{comparison.explanation}"
                    </p>
                  </div>
                </div>
              ) : (
                <div className="h-full min-h-[200px] flex items-center justify-center text-stone-300 bg-stone-50 rounded-xl border-2 border-dashed border-stone-200 p-8">
                    <div className="text-center">
                        <BookOpenCheck className="w-12 h-12 mx-auto mb-2 opacity-50" />
                        <p>Results will appear here</p>
                    </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const PillarCard: React.FC<{icon: React.ReactNode, title: string, desc: string, color: 'red' | 'blue' | 'amber'}> = ({icon, title, desc, color}) => {
    const colorClasses = {
        red: 'bg-red-50 text-red-700 border-red-100',
        blue: 'bg-blue-50 text-blue-700 border-blue-100',
        amber: 'bg-amber-50 text-amber-700 border-amber-100'
    };

    return (
        <div className="bg-white p-6 rounded-xl border border-stone-200 shadow-sm hover:shadow-md transition-shadow group">
            <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 transition-colors ${colorClasses[color]}`}>
              {icon}
            </div>
            <h3 className="font-bold text-lg mb-3 text-stone-800 font-serif-sc group-hover:text-[#7f1d1d] transition-colors">{title}</h3>
            <p className="text-stone-600 text-sm leading-relaxed">
              {desc}
            </p>
        </div>
    );
}