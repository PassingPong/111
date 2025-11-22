
export enum Gender {
  MALE = '男',
  FEMALE = '女'
}

export interface UserInput {
  name: string;
  gender: Gender;
  birthDate: string; // YYYY-MM-DD
  birthTime: string; // HH:mm
  birthPlace: string;
}

export interface Star {
  name: string;
  brightness?: string; // e.g., 庙, 旺, 平, 陷
  type: 'major' | 'minor' | 'bad' | 'flow';
}

export interface PalaceData {
  name: string; // e.g., 命宫, 财帛宫
  earthBranch: string; // 地支 e.g., 子, 丑
  heavenStem: string; // 天干 e.g., 甲, 乙
  majorStars: Star[];
  minorStars: Star[];
  ageRange: string; // e.g., 14-23
}

export interface ChartResponse {
  palaces: PalaceData[]; // Should always be 12
  fiveElement: string; // 五行局 e.g., 木三局
  lifeMaster: string; // 命主
  bodyMaster: string; // 身主
}

export interface PastEvent {
  year: string;
  description: string;
  type: 'career' | 'love' | 'health' | 'wealth' | 'family';
  impact: 'good' | 'bad' | 'neutral'; // New: helps user identify tone
  confirmed?: boolean; // For UI state
}

export interface AnalysisSection {
  tags: string[];   // 3-4 keywords e.g., "坚韧不拔", "晚器大成"
  content: string;  // Detailed warm description
  score: number;    // 0-100 abstract score for visual graph if needed
}

export interface AnalysisResult {
  personality: AnalysisSection;
  family: AnalysisSection;
  academics: AnalysisSection;
  career: AnalysisSection;
  wealth: AnalysisSection;
  love: AnalysisSection;
  health: AnalysisSection; // Added Health
  pastEvents: PastEvent[];
}

export type FortuneRating = '极佳' | '好' | '平' | '差' | '极差';

export interface MonthlyFortune {
  year: number;
  solarMonth: number;
  lunarMonth: string; // e.g. 农历九月
  rating: FortuneRating;
  tags: string[]; // e.g. "注意身体", "财运爆发"
  content: string; // Detailed prediction
  luckyGuides: string[]; // 宜: e.g. "签约", "出行"
  unluckyGuides: string[]; // 忌: e.g. "争吵", "投资"
}

export interface FutureForecast {
  yearSummary: string;
  months: MonthlyFortune[];
}

export interface FullPrediction {
  chart: ChartResponse;
  analysis: AnalysisResult;
  future?: FutureForecast;
}
