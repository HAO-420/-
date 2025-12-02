// Define available topics for the news feed
export enum NewsTopic {
    TECHNOLOGY = '科技与AI',
    FINANCE = '金融与市场',
    POLITICS = '国际政治',
    SCIENCE = '科学与航天',
    HEALTH = '健康与养生',
    SPORTS = '体育',
    ENTERTAINMENT = '娱乐',
    CRYPTO = '加密货币',
    STARTUPS = '创业创投',
    ENVIRONMENT = '环境与气候'
  }
  
  export interface SourceLink {
    title: string;
    uri: string;
  }
  
  export interface NewsReport {
    markdownContent: string;
    sources: SourceLink[];
    timestamp: string;
  }
  
  export type WorkflowStep = 'CONFIG' | 'PROCESSING' | 'RESULT';