import React, { useRef, useState } from 'react';
import { NewsReport } from '../types';
import { toPng } from 'html-to-image';

interface ReportViewProps {
  report: NewsReport;
  onReset: () => void;
}

export const ReportView: React.FC<ReportViewProps> = ({ report, onReset }) => {
  const reportRef = useRef<HTMLDivElement>(null);
  const [isExporting, setIsExporting] = useState(false);

  const handleExportImage = async () => {
    if (reportRef.current === null) return;
    
    setIsExporting(true);
    try {
      // Wait a moment for layout to stabilize if needed
      const dataUrl = await toPng(reportRef.current, { cacheBust: true, backgroundColor: '#fffbf7' });
      const link = document.createElement('a');
      link.download = `朝闻-早报-${new Date().toISOString().slice(0, 10)}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('导出图片失败', err);
      alert('导出图片失败，请重试');
    } finally {
      setIsExporting(false);
    }
  };

  const renderContent = (text: string) => {
    return text.split('\n').map((line, index) => {
      // Clean up markdown images if they are broken or generic text placeholders, 
      // but try to render them if they look like real URLs.
      // Simplified for this view:
      
      if (line.startsWith('## ')) {
        return (
          <div key={index} className="mt-10 mb-6">
            <h2 className="text-2xl md:text-3xl font-serif font-black text-red-900 border-l-4 border-red-700 pl-4 leading-none">
              {line.replace('## ', '')}
            </h2>
          </div>
        );
      }
      if (line.startsWith('### ')) {
        return (
          <h3 key={index} className="text-lg md:text-xl font-bold text-slate-900 mt-6 mb-2 flex items-start gap-2">
            <span className="text-red-600 mt-1">●</span>
            {line.replace('### ', '')}
          </h3>
        );
      }
      if (line.startsWith('- ') || line.startsWith('* ')) {
        return <li key={index} className="ml-6 list-none text-slate-700 mb-2 pl-0 relative leading-relaxed text-justify">
             {line.replace(/^[-*]\s/, '')}
        </li>;
      }
      // Image handling (Basic)
      const imgMatch = line.match(/!\[(.*?)\]\((.*?)\)/);
      if (imgMatch) {
          return (
              <div key={index} className="my-4 rounded-lg overflow-hidden shadow-md">
                  <img src={imgMatch[2]} alt={imgMatch[1]} className="w-full h-auto object-cover" onError={(e) => (e.currentTarget.style.display = 'none')} />
                  <p className="text-xs text-slate-500 mt-1 text-center">{imgMatch[1]}</p>
              </div>
          )
      }

      if (line.trim() === '') {
        return <div key={index} className="h-3"></div>;
      }
      return <p key={index} className="text-slate-700 mb-2 leading-relaxed text-justify">{line}</p>;
    });
  };

  return (
    <div className="animate-fade-in pb-12">
      {/* Control Bar */}
      <div className="flex justify-between items-center mb-6 px-2 sticky top-20 z-20 mix-blend-multiply">
        <button 
          onClick={onReset}
          className="px-4 py-2 bg-white/80 backdrop-blur border border-slate-200 rounded-full text-sm text-slate-600 hover:text-red-700 hover:border-red-300 font-medium shadow-sm transition-all"
        >
          ←以此为鉴，重新探索
        </button>
        
        <button 
          onClick={handleExportImage}
          disabled={isExporting}
          className="px-4 py-2 bg-red-700 text-white rounded-full text-sm font-medium shadow-lg hover:bg-red-800 flex items-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isExporting ? (
             <span>生成中...</span>
          ) : (
            <>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
              <span>保存早报卡片</span>
            </>
          )}
        </button>
      </div>

      {/* Capture Area */}
      <div ref={reportRef} className="paper-texture mx-auto max-w-3xl shadow-2xl relative overflow-hidden text-slate-800">
        
        {/* Decorative Top Band */}
        <div className="h-2 bg-red-800 w-full"></div>
        
        {/* Header Section */}
        <div className="bg-red-50 border-b-4 border-red-800 p-8 md:p-12 text-center relative overflow-hidden">
            {/* Decorative background element */}
            <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
                <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full fill-red-900">
                    <path d="M0 100 C 20 0 50 0 100 100 Z" />
                </svg>
            </div>

            <div className="relative z-10">
                <h1 className="text-5xl md:text-7xl font-serif font-black text-red-900 mb-4 tracking-tight">朝 闻</h1>
                <div className="flex items-center justify-center gap-4 text-red-800 font-serif text-sm md:text-base tracking-widest uppercase border-t border-b border-red-200 py-2 inline-block px-8">
                    <span>热点</span>
                    <span>•</span>
                    <span>深度</span>
                    <span>•</span>
                    <span>洞察</span>
                </div>
                <p className="text-red-700/80 mt-4 font-medium">
                    {new Date(report.timestamp).toLocaleDateString('zh-CN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </p>
            </div>
        </div>

        {/* Main Content */}
        <div className="p-8 md:p-12 min-h-[600px]">
            {/* Introduction block if exists (first paragraph usually) */}
            <div className="prose prose-slate prose-lg max-w-none font-serif">
                {renderContent(report.markdownContent)}
            </div>
        </div>

        {/* Footer */}
        <div className="bg-neutral-900 text-neutral-400 p-8 text-center border-t-4 border-red-800">
            <div className="mb-6 flex justify-center flex-wrap gap-2">
                {report.sources.slice(0, 5).map((source, idx) => (
                     <span key={idx} className="text-[10px] px-2 py-1 border border-neutral-700 rounded text-neutral-500">
                        {source.title}
                     </span>
                ))}
            </div>
            <div className="flex flex-col items-center gap-2">
                <div className="w-12 h-12 bg-red-800 rounded text-white flex items-center justify-center font-serif font-bold text-xl">
                    朝
                </div>
                <p className="text-xs tracking-widest uppercase">Gemini AI · 每日汇编</p>
            </div>
        </div>
      </div>
    </div>
  );
};