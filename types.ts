export interface ArticleSection {
  id: string;
  title?: string;
  content: string;
}

export interface QuizQuestion {
  id: number;
  question: string;
  context?: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  timestamp: number;
}

export type ViewMode = 'reading' | 'quiz' | 'culture' | 'chat';

export interface AnalysisResult {
  pinyin: string;
  translation: string;
  culturalNote?: string;
}