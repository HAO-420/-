import React, { useState } from 'react';
import { NewsTopic, WorkflowStep, NewsReport } from './types';
import { generateDailyReport } from './services/geminiService';
import { TopicSelector } from './components/TopicSelector';
import { LoadingView } from './components/LoadingView';
import { ReportView } from './components/ReportView';

export default function App() {
  const [step, setStep] = useState<WorkflowStep>('CONFIG');
  const [selectedTopics, setSelectedTopics] = useState<NewsTopic[]>([]);
  const [report, setReport] = useState<NewsReport | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleToggleTopic = (topic: NewsTopic) => {
    setSelectedTopics(prev => 
      prev.includes(topic) 
        ? prev.filter(t => t !== topic) 
        : [...prev, topic]
    );
  };

  const handleGenerate = async () => {
    if (selectedTopics.length === 0) return;
    
    setStep('PROCESSING');
    setError(null);
    
    try {
      const data = await generateDailyReport(selectedTopics);
      setReport(data);
      setStep('RESULT');
    } catch (err) {
      setError('生成报告失败。请检查网络连接后重试。');
      setStep('CONFIG');
    }
  };

  const handleReset = () => {
    setStep('CONFIG');
    setReport(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-stone-100 text-slate-900 font-sans pb-20">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-stone-200 sticky top-0 z-30">
        <div className="max-w-3xl mx-auto px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-red-800 text-white flex items-center justify-center font-serif font-bold text-lg shadow-sm rounded-sm">
              朝
            </div>
            <div className="flex flex-col">
                <span className="font-serif font-bold text-xl tracking-tight text-stone-900 leading-none">朝闻</span>
                <span className="text-[10px] text-stone-500 tracking-widest uppercase pt-1">Weibo Highlights</span>
            </div>
          </div>
          <div className="hidden md:block text-xs font-bold tracking-wider px-3 py-1 bg-stone-100 text-stone-600 rounded-full border border-stone-200">
            今日热搜
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 md:px-6 py-8">
        {step === 'CONFIG' && (
          <div className="space-y-8 animate-fade-in-up">
            <div className="text-center space-y-4 py-10">
              <h1 className="text-4xl md:text-5xl font-serif font-black text-stone-900">
                今日微博热点
              </h1>
              <p className="text-lg text-stone-500 max-w-xl mx-auto font-light">
                实时聚合微博热搜与热门话题，为您生成一份包含深度观点的早报。
              </p>
            </div>

            <div className="bg-white p-8 rounded-none md:rounded-xl shadow-sm border border-stone-200 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-red-700"></div>
              <h2 className="text-sm font-bold text-stone-400 uppercase tracking-wider mb-6 flex items-center gap-2">
                  <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                  定制您的热搜分类
              </h2>
              <TopicSelector 
                selectedTopics={selectedTopics} 
                onToggleTopic={handleToggleTopic} 
              />
            </div>

            {error && (
              <div className="p-4 bg-red-50 border-l-4 border-red-700 text-red-900 rounded-r-lg text-sm">
                {error}
              </div>
            )}

            <div className="sticky bottom-6 pt-4 z-20">
              <button
                onClick={handleGenerate}
                disabled={selectedTopics.length === 0}
                className={`
                  w-full py-4 rounded-xl font-serif font-bold text-xl shadow-2xl transition-all duration-300 transform
                  flex items-center justify-center gap-3
                  ${selectedTopics.length === 0
                    ? 'bg-stone-200 text-stone-400 cursor-not-allowed'
                    : 'bg-red-800 text-white hover:bg-red-900 hover:-translate-y-1 hover:shadow-red-900/30'
                  }
                `}
              >
                <span>生成今日早报</span>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
              </button>
            </div>
          </div>
        )}

        {step === 'PROCESSING' && (
          <LoadingView />
        )}

        {step === 'RESULT' && report && (
          <ReportView report={report} onReset={handleReset} />
        )}
      </main>
    </div>
  );
}