import { GoogleGenAI } from "@google/genai";
import { NewsTopic, NewsReport, SourceLink } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Generates a daily news report based on selected topics using Gemini 2.5 Flash with Search Grounding.
 * Strictly focused on TODAY'S Weibo sources.
 */
export const generateDailyReport = async (topics: NewsTopic[]): Promise<NewsReport> => {
  const dateStr = new Date().toLocaleDateString('zh-CN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  
  const prompt = `
    你是一位“朝闻”（Zhaowen）栏目的资深主编。
    **今天是 ${dateStr}。**
    
    **核心任务：**
    请**仅**从**中国微博（Weibo）**平台获取**今日**的实时热点和热搜榜单，为读者制作一份深度的微博早报。
    **严禁**使用旧闻，必须是今天发生或今天正在热议的内容。
    
    主题：${topics.join(', ')}。
    
    **严格搜索指令：**
    1. 仅搜索微博平台（site:weibo.com 或 关键词“微博热搜”）。
    2. 确保内容的时间戳是**今天**。
    3. 寻找具有高讨论度（热搜前50）、高转发量的话题。
    
    **内容生成要求：**
    1. **开篇**：写一段优美的卷首语，概述今日微博舆论场的焦点（约50字）。
    2. **分栏**：为每个选定的主题创建一个带有艺术感的标题（## 主题）。
    3. **条目数量**：在每个主题下，**必须列出 7 条**最热门的新闻/话题。
    4. **条目格式**：
       - 标题：使用 ### 并带上标准的微博话题格式（如 #话题#）。
       - 内容：简述事件事实，并**必须摘录1-2条网友的典型热评或观点**（体现微博特色）。
    5. **图片元素**：尝试寻找并插入相关的图片链接（Markdown格式 \`![描述](url)\`），特别是寻找新闻配图或热搜封面图。
    
    **严格规则：**
    - 输出语言：中文。
    - 来源限制：**必须来自微博**。
    - 时间限制：**必须是今天**。
    - 风格：高级早报，排版整洁，强调舆论观点。
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        systemInstruction: "你是一份专注于微博热点的 AI 编辑。你的任务是聚合今日微博热搜，确保信息的时效性（仅限今日）和来源的准确性（仅限微博）。排版要优雅，内容要包含网友辣评。",
      },
    });

    const markdownContent = response.text || "未能生成内容。";
    
    // Extract sources from grounding metadata
    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    const sources: SourceLink[] = [];

    groundingChunks.forEach((chunk: any) => {
        if (chunk.web) {
            sources.push({
                title: chunk.web.title || '微博来源',
                uri: chunk.web.uri
            });
        }
    });

    // Deduplicate sources based on URI
    const uniqueSources = Array.from(new Map(sources.map(item => [item.uri, item])).values());

    return {
      markdownContent,
      sources: uniqueSources,
      timestamp: new Date().toISOString()
    };

  } catch (error) {
    console.error("生成热点报告时出错:", error);
    throw error;
  }
};