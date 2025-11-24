import React, { useState } from 'react';
import { CheckCircle2, XCircle, Bot, Send } from 'lucide-react';
import { QUIZ_QUESTIONS, ARTICLE_CONTENT } from '../constants';
import { checkQuizAnswer } from '../services/geminiService';

export const QuizView: React.FC = () => {
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [feedback, setFeedback] = useState<Record<number, { isCorrect: boolean; feedback: string }>>({});
  const [loadingIds, setLoadingIds] = useState<number[]>([]);

  const fullText = ARTICLE_CONTENT.map(c => c.content).join(" ");

  const handleAnswerChange = (id: number, text: string) => {
    setAnswers(prev => ({ ...prev, [id]: text }));
  };

  const checkAnswer = async (id: number) => {
    if (!answers[id]) return;

    setLoadingIds(prev => [...prev, id]);
    
    const questionText = QUIZ_QUESTIONS.find(q => q.id === id)?.question || "";
    const result = await checkQuizAnswer(questionText, answers[id], fullText);

    setFeedback(prev => ({ ...prev, [id]: result }));
    setLoadingIds(prev => prev.filter(loadingId => loadingId !== id));
  };

  return (
    <div className="max-w-3xl mx-auto h-full overflow-y-auto pb-20">
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-bold text-slate-800 font-serif-sc">Comprehension Check</h2>
        <p className="text-slate-500 mt-2">Answer based on the text. Our AI TA will grade your response.</p>
      </div>

      <div className="space-y-6">
        {QUIZ_QUESTIONS.map((q) => (
          <div key={q.id} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h3 className="font-bold text-lg text-slate-800 mb-4 font-serif-sc flex gap-3">
              <span className="bg-slate-100 text-slate-500 w-8 h-8 flex items-center justify-center rounded-full text-sm">
                {q.id}
              </span>
              {q.question}
            </h3>

            <div className="relative">
              <textarea
                className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-slate-700"
                rows={3}
                placeholder="Type your answer in Chinese or English..."
                value={answers[q.id] || ''}
                onChange={(e) => handleAnswerChange(q.id, e.target.value)}
              />
              <button
                onClick={() => checkAnswer(q.id)}
                disabled={loadingIds.includes(q.id) || !answers[q.id]}
                className="absolute bottom-3 right-3 bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                title="Check Answer"
              >
                {loadingIds.includes(q.id) ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Send className="w-5 h-5" />
                )}
              </button>
            </div>

            {feedback[q.id] && (
              <div className={`mt-4 p-4 rounded-lg flex gap-3 ${feedback[q.id].isCorrect ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
                <div className="shrink-0 mt-1">
                  {feedback[q.id].isCorrect ? <CheckCircle2 className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
                </div>
                <div>
                  <p className="font-bold mb-1 flex items-center gap-2">
                    {feedback[q.id].isCorrect ? "Correct!" : "Needs Improvement"}
                    <span className="text-xs font-normal opacity-75 px-2 py-0.5 border border-current rounded-full flex items-center gap-1">
                      <Bot className="w-3 h-3" /> AI Feedback
                    </span>
                  </p>
                  <p className="text-sm opacity-90">{feedback[q.id].feedback}</p>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};