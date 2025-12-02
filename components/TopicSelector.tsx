import React from 'react';
import { NewsTopic } from '../types';

interface TopicSelectorProps {
  selectedTopics: NewsTopic[];
  onToggleTopic: (topic: NewsTopic) => void;
}

export const TopicSelector: React.FC<TopicSelectorProps> = ({ selectedTopics, onToggleTopic }) => {
  const allTopics = Object.values(NewsTopic);

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
      {allTopics.map((topic) => {
        const isSelected = selectedTopics.includes(topic);
        return (
          <button
            key={topic}
            onClick={() => onToggleTopic(topic)}
            className={`
              relative px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ease-in-out border
              flex items-center justify-center gap-2 shadow-sm
              ${isSelected 
                ? 'bg-blue-600 text-white border-blue-600 shadow-blue-200' 
                : 'bg-white text-slate-600 border-slate-200 hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50'
              }
            `}
          >
            {isSelected && (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
            )}
            {topic}
          </button>
        );
      })}
    </div>
  );
};