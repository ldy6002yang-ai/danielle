import React, { useState } from 'react';
import JSZip from 'jszip';
import { ViewMode } from './types';
import { ReadingView } from './components/ReadingView';
import { QuizView } from './components/QuizView';
import { CultureView } from './components/CultureView';
import { ChatView } from './components/ChatView';
import { BookOpen, HelpCircle, Globe, MessageSquareText, ScrollText, Feather, Download, Loader2, Share2 } from 'lucide-react';

const App: React.FC = () => {
  const [view, setView] = useState<ViewMode>('reading');
  const [isDownloading, setIsDownloading] = useState(false);

  const renderView = () => {
    switch (view) {
      case 'reading': return <ReadingView />;
      case 'quiz': return <QuizView />;
      case 'culture': return <CultureView />;
      case 'chat': return <ChatView />;
      default: return <ReadingView />;
    }
  };

  const handleDownload = async () => {
    setIsDownloading(true);
    try {
        const zip = new JSZip();
        
        // 1. Source Files
        const files = [
            'index.html',
            'index.tsx',
            'App.tsx',
            'types.ts',
            'constants.ts',
            'metadata.json',
            'services/geminiService.ts',
            'components/ReadingView.tsx',
            'components/QuizView.tsx',
            'components/CultureView.tsx',
            'components/ChatView.tsx'
        ];

        for (const file of files) {
            try {
                const response = await fetch(`/${file}`);
                if (!response.ok) throw new Error(`Failed to fetch ${file}`);
                let content = await response.text();
                
                // Fix imports for local Vite environment if needed
                if (file === 'index.html') {
                    // Remove the CDN importmap for local development as Vite handles it
                    content = content.replace(/<script type="importmap">[\s\S]*?<\/script>/, '');
                }
                zip.file(file, content);
            } catch (err) {
                console.warn(`Could not add ${file} to zip:`, err);
            }
        }

        // 2. Configuration Files for Deployment (Vite/Tailwind/Typescript)
        const packageJson = {
          "name": "hanzi-evolution-explorer",
          "private": true,
          "version": "1.0.0",
          "type": "module",
          "scripts": {
            "dev": "vite",
            "build": "tsc && vite build",
            "preview": "vite preview"
          },
          "dependencies": {
            "react": "^18.2.0",
            "react-dom": "^18.2.0",
            "lucide-react": "^0.292.0",
            "@google/genai": "^0.1.1",
            "jszip": "^3.10.1"
          },
          "devDependencies": {
            "@types/react": "^18.2.37",
            "@types/react-dom": "^18.2.15",
            "@vitejs/plugin-react": "^4.2.0",
            "autoprefixer": "^10.4.16",
            "postcss": "^8.4.31",
            "tailwindcss": "^3.3.5",
            "typescript": "^5.2.2",
            "vite": "^5.0.0"
          }
        };

        const viteConfig = `
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
})
        `;

        const tailwindConfig = `
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
        `;

        const postcssConfig = `
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
        `;

        const tsConfig = `
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": false,
    "noUnusedParameters": false,
    "noFallthroughCasesInSwitch": true
  },
  "include": ["**/*.ts", "**/*.tsx"]
}
        `;

        // Inject configs
        zip.file("package.json", JSON.stringify(packageJson, null, 2));
        zip.file("vite.config.ts", viteConfig);
        zip.file("tailwind.config.js", tailwindConfig);
        zip.file("postcss.config.js", postcssConfig);
        zip.file("tsconfig.json", tsConfig);

        // 3. Instructions
        zip.file("README.md", `# Hanzi Evolution Explorer

## How to get a URL for this project

Since this is a static React application, you can deploy it easily for free.

### Option 1: CodeSandbox (Easiest)
1. Go to https://codesandbox.io/dashboard
2. Click "Create Devbox" -> "Import Project"
3. Upload this entire folder.
4. Done! You will get a URL.

### Option 2: Netlify Drop
1. Run \`npm install\` then \`npm run build\` locally.
2. Drag the generated \`dist\` folder to https://app.netlify.com/drop.

### Option 3: Local Development
1. Install Node.js
2. Run \`npm install\`
3. Run \`npm run dev\`
4. Open http://localhost:5173

**Note regarding API Keys:**
To make the AI features work effectively, create a \`.env\` file in the root directory and add:
\`VITE_API_KEY=your_google_gemini_api_key\`
(You may need to update the code to use \`import.meta.env.VITE_API_KEY\` instead of process.env if using Vite).
`);

        const blob = await zip.generateAsync({ type: 'blob' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'hanzi-explorer-project.zip';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    } catch (error) {
        console.error("Download failed", error);
        alert("Failed to generate download. Please try again.");
    } finally {
        setIsDownloading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row text-stone-900 font-sans">
      {/* Mobile Header */}
      <div className="md:hidden bg-[#7f1d1d] text-white p-4 shadow-md flex items-center justify-between sticky top-0 z-20">
        <div className="flex items-center gap-2 font-bold font-serif-sc">
          <ScrollText className="w-6 h-6 text-amber-400" />
          <span className="text-lg">Hanzi Explorer</span>
        </div>
        <button 
          onClick={handleDownload}
          disabled={isDownloading}
          className="text-white/80 hover:text-white"
          title="Download App Source"
        >
           {isDownloading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Download className="w-5 h-5" />}
        </button>
      </div>

      {/* Sidebar Navigation */}
      <nav className="hidden md:flex flex-col w-20 lg:w-72 bg-[#1c1917] text-stone-400 h-screen sticky top-0 shrink-0 border-r-4 border-[#7f1d1d]">
        <div className="p-8 flex flex-col items-center text-center gap-3 text-white border-b border-stone-800 bg-[#0c0a09]">
          <div className="w-12 h-12 bg-[#7f1d1d] rounded-full flex items-center justify-center shadow-lg shadow-red-900/50">
             <span className="font-calligraphy text-2xl">文</span>
          </div>
          <div className="hidden lg:block">
            <h1 className="font-bold text-xl font-serif-sc tracking-wide text-[#e7e5e4]">汉字演变</h1>
            <span className="text-xs text-stone-500 uppercase tracking-widest">Hanzi Explorer</span>
          </div>
        </div>

        <div className="flex-1 py-8 px-4 space-y-3 overflow-y-auto">
          <NavButton 
            active={view === 'reading'} 
            onClick={() => setView('reading')} 
            icon={<BookOpen />} 
            label="Reading Text" 
            subLabel="阅读训练"
          />
          <NavButton 
            active={view === 'quiz'} 
            onClick={() => setView('quiz')} 
            icon={<HelpCircle />} 
            label="Comprehension" 
             subLabel="技能训练"
          />
          <NavButton 
            active={view === 'culture'} 
            onClick={() => setView('culture')} 
            icon={<Globe />} 
            label="Culture & History" 
             subLabel="文化背景"
          />
          <NavButton 
            active={view === 'chat'} 
            onClick={() => setView('chat')} 
            icon={<MessageSquareText />} 
            label="AI Tutor" 
             subLabel="智能辅导"
          />
        </div>

        <div className="p-4 border-t border-stone-800 hidden lg:block bg-[#0c0a09] space-y-4">
          <div className="bg-stone-900 p-3 rounded-lg border border-stone-800">
             <p className="text-xs text-stone-500 mb-2">Want a shareable URL?</p>
             <button 
                onClick={handleDownload}
                disabled={isDownloading}
                className="w-full flex items-center gap-2 px-3 py-2 rounded bg-[#7f1d1d] text-white text-xs font-medium hover:bg-red-900 transition-all justify-center"
              >
                {isDownloading ? <Loader2 className="w-3 h-3 animate-spin" /> : <Download className="w-3 h-3" />}
                Download & Deploy
              </button>
          </div>

          <div className="flex items-center gap-3 opacity-60 px-3">
            <Feather className="w-4 h-4" />
            <p className="text-xs font-serif-sc">
              Lesson 4: Evolution of Language
            </p>
          </div>
        </div>
      </nav>

      {/* Mobile Tab Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-[#fffcf5] border-t border-stone-200 flex justify-around p-2 z-20 pb-safe shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
        <MobileNavButton active={view === 'reading'} onClick={() => setView('reading')} icon={<BookOpen />} label="Read" />
        <MobileNavButton active={view === 'quiz'} onClick={() => setView('quiz')} icon={<HelpCircle />} label="Quiz" />
        <MobileNavButton active={view === 'culture'} onClick={() => setView('culture')} icon={<Globe />} label="Culture" />
        <MobileNavButton active={view === 'chat'} onClick={() => setView('chat')} icon={<MessageSquareText />} label="Tutor" />
      </div>

      {/* Main Content Area */}
      <main className="flex-1 h-[calc(100vh-60px)] md:h-screen overflow-hidden p-4 md:p-8 bg-[#fdfbf7]">
        <div className="h-full max-w-7xl mx-auto">
          {renderView()}
        </div>
      </main>
    </div>
  );
};

const NavButton: React.FC<{ active: boolean; onClick: () => void; icon: React.ReactNode; label: string; subLabel: string }> = ({ active, onClick, icon, label, subLabel }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-4 px-4 py-4 rounded-xl transition-all group ${
      active 
        ? 'bg-[#292524] text-white shadow-lg border border-stone-700' 
        : 'hover:bg-[#292524] hover:text-white'
    }`}
  >
    <span className={`p-2 rounded-lg transition-colors ${active ? 'bg-[#7f1d1d] text-white' : 'bg-stone-800 text-stone-500 group-hover:text-stone-300'}`}>
        <span className="[&>svg]:w-5 [&>svg]:h-5">{icon}</span>
    </span>
    <div className="hidden lg:flex flex-col items-start">
        <span className="font-medium text-sm">{label}</span>
        <span className="text-xs text-stone-600 group-hover:text-stone-500 font-serif-sc">{subLabel}</span>
    </div>
  </button>
);

const MobileNavButton: React.FC<{ active: boolean; onClick: () => void; icon: React.ReactNode; label: string }> = ({ active, onClick, icon, label }) => (
  <button
    onClick={onClick}
    className={`flex flex-col items-center gap-1 p-2 rounded-lg ${
      active ? 'text-[#7f1d1d]' : 'text-stone-400'
    }`}
  >
    <span className="[&>svg]:w-5 [&>svg]:h-5">{icon}</span>
    <span className="text-[10px] font-medium font-serif-sc">{label}</span>
  </button>
);

export default App;