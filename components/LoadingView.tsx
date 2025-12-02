import React, { useEffect, useState } from 'react';

export const LoadingView: React.FC = () => {
  const [message, setMessage] = useState("正在连接微博热搜榜...");

  useEffect(() => {
    const messages = [
      "正在扫描今日热搜...",
      "正在筛选高热度话题...",
      "正在分析网友辣评与观点...",
      "正在核实微博来源...",
      "正在汇编您的今日早报..."
    ];
    let i = 0;
    const interval = setInterval(() => {
      i = (i + 1) % messages.length;
      setMessage(messages[i]);
    }, 1500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="relative w-20 h-20 mb-8">
        <div className="absolute inset-0 border-4 border-slate-100 rounded-full"></div>
        <div className="absolute inset-0 border-4 border-red-600 rounded-full border-t-transparent animate-spin"></div>
        <div className="absolute inset-4 bg-white rounded-full flex items-center justify-center shadow-inner">
             {/* Weibo-like eye icon or just an eye */}
             <svg className="w-8 h-8 text-red-600" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
             </svg>
        </div>
      </div>
      <h3 className="text-xl font-serif font-semibold text-slate-800 mb-2">正在策划早报</h3>
      <p className="text-slate-500 animate-pulse">{message}</p>
    </div>
  );
};