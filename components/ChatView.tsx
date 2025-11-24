import React, { useState, useEffect, useRef } from 'react';
import { Send, User, Bot, Loader2 } from 'lucide-react';
import { chatWithTutor } from '../services/geminiService';
import { ChatMessage } from '../types';

export const ChatView: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', text: "Hello! I am your AI tutor. I can help you understand the text about Chinese Simplification, explain grammar points, or discuss the history of characters. What would you like to know?", timestamp: Date.now() }
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg: ChatMessage = { role: 'user', text: input, timestamp: Date.now() };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    try {
      // Format history for Gemini API
      const history = messages.map(m => ({
        role: m.role,
        parts: [{ text: m.text }]
      }));

      const responseText = await chatWithTutor(history, userMsg.text);
      
      const botMsg: ChatMessage = { role: 'model', text: responseText, timestamp: Date.now() };
      setMessages(prev => [...prev, botMsg]);
    } catch (error) {
      const errorMsg: ChatMessage = { role: 'model', text: "I'm having trouble connecting to the knowledge base. Please try again.", timestamp: Date.now() };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden max-w-4xl mx-auto">
      <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${msg.role === 'user' ? 'bg-blue-600 text-white' : 'bg-emerald-600 text-white'}`}>
              {msg.role === 'user' ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
            </div>
            <div className={`max-w-[80%] p-4 rounded-2xl shadow-sm ${msg.role === 'user' ? 'bg-blue-600 text-white rounded-tr-none' : 'bg-white text-slate-700 border border-slate-200 rounded-tl-none'}`}>
              <p className="leading-relaxed whitespace-pre-wrap">{msg.text}</p>
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex gap-4">
             <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0">
              <Bot className="w-5 h-5" />
            </div>
            <div className="bg-white p-4 rounded-2xl rounded-tl-none border border-slate-200 shadow-sm flex items-center">
              <Loader2 className="w-4 h-4 animate-spin text-slate-400" />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 bg-white border-t border-slate-200">
        <div className="relative">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Ask about grammar, history, or vocabulary..."
            className="w-full p-4 pr-12 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isTyping}
            className="absolute right-3 top-3 p-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50 transition-colors"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};