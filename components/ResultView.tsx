
import React, { useState } from 'react';
import { FullPrediction, UserInput, PastEvent, AnalysisSection, FortuneRating } from '../types';
import ChartGrid from './ChartGrid';
import { 
  ArrowLeftIcon, MoonIcon, SparklesIcon, LockIcon, 
  HeartIcon, BriefcaseIcon, CurrencyYenIcon, AcademicCapIcon, 
  UserGroupIcon, PulseIcon, ChevronDownIcon, CheckIcon, XIcon 
} from './Icons';

interface ResultViewProps {
  prediction: FullPrediction;
  userData: UserInput;
  onBack: () => void;
  onPredictFuture: (verifiedEvents: PastEvent[]) => Promise<void>;
  isPredicting: boolean;
}

// --- Components for Analysis Section ---

const AnalysisCard: React.FC<{ 
  title: string; 
  data: AnalysisSection; 
  icon: React.ReactNode;
  color: string;
}> = ({ title, data, icon, color }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div 
      className={`rounded-2xl p-4 bg-white border shadow-sm transition-all duration-300 ${isOpen ? 'shadow-md ring-1 ring-purple-100' : 'hover:shadow'}`}
    >
      <div 
        className="flex items-center justify-between cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center space-x-3">
          <div className={`p-2.5 rounded-xl ${color} text-white shadow-sm`}>
            {icon}
          </div>
          <div>
            <h3 className="font-bold text-gray-800">{title}</h3>
            {!isOpen && (
              <div className="flex flex-wrap gap-1.5 mt-1">
                {data.tags.slice(0, 2).map((tag, i) => (
                  <span key={i} className="text-[10px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
        <div className={`transform transition-transform duration-300 text-gray-400 ${isOpen ? 'rotate-180' : ''}`}>
           <ChevronDownIcon className="w-5 h-5" />
        </div>
      </div>

      {isOpen && (
        <div className="mt-4 pt-3 border-t border-gray-50 animate-fade-in">
          <div className="flex flex-wrap gap-2 mb-3">
            {data.tags.map((tag, i) => (
               <span key={i} className="text-xs font-medium bg-purple-50 text-purple-700 px-2.5 py-1 rounded-lg border border-purple-100">
                 #{tag}
               </span>
            ))}
          </div>
          <p className="text-sm leading-7 text-gray-600 text-justify whitespace-pre-wrap">
            {data.content}
          </p>
        </div>
      )}
    </div>
  );
};

// --- Component for Future Month ---

const RatingBadge: React.FC<{ rating: FortuneRating }> = ({ rating }) => {
  const colors: Record<FortuneRating, string> = {
    '极佳': 'bg-red-100 text-red-600 border-red-200',
    '好': 'bg-orange-100 text-orange-600 border-orange-200',
    '平': 'bg-blue-100 text-blue-600 border-blue-200',
    '差': 'bg-gray-100 text-gray-600 border-gray-200',
    '极差': 'bg-gray-800 text-gray-200 border-gray-700',
  };

  return (
    <span className={`text-xs font-bold px-2 py-1 rounded border ${colors[rating] || colors['平']}`}>
      {rating}
    </span>
  );
};

// --- Main Result View ---

const ResultView: React.FC<ResultViewProps> = ({ prediction, userData, onBack, onPredictFuture, isPredicting }) => {
  const { chart, analysis, future } = prediction;
  const [showChart, setShowChart] = useState(false);
  const [verifiedStatus, setVerifiedStatus] = useState<Record<number, boolean>>({}); // index -> true(yes)/false(no)

  const handleVerifyToggle = (index: number, status: boolean) => {
    setVerifiedStatus(prev => ({ ...prev, [index]: status }));
  };

  const allVerified = analysis.pastEvents.length > 0 && Object.keys(verifiedStatus).length === analysis.pastEvents.length;

  const handlePredictClick = () => {
    if (!allVerified) return;
    // Filter events where user said "Yes" (true)
    const confirmedEvents = analysis.pastEvents.filter((_, i) => verifiedStatus[i]);
    onPredictFuture(confirmedEvents);
  };

  const [expandedMonth, setExpandedMonth] = useState<number | null>(0);

  return (
    <div className="w-full max-w-3xl mx-auto pb-12 animate-fade-in">
      {/* Sticky Header */}
      <div className="sticky top-0 z-30 bg-white/80 backdrop-blur-xl border-b border-gray-100 px-4 py-3 -mx-4 mb-6 flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center text-gray-500 hover:text-gray-900 transition-colors text-sm font-medium"
        >
          <ArrowLeftIcon className="w-4 h-4 mr-1" />
          返回
        </button>
        <div className="text-xs font-medium text-gray-400">
          {userData.name} 的命盘
        </div>
      </div>

      {/* Section 1: Analysis Overview */}
      <div className="mb-10">
        <div className="flex items-center mb-4 px-2">
           <div className="w-1 h-6 bg-purple-600 rounded-full mr-3"></div>
           <h2 className="text-xl font-bold text-gray-800">命盘深度解析</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <AnalysisCard 
            title="性格特质" 
            data={analysis.personality} 
            icon={<MoonIcon className="w-5 h-5" />} 
            color="bg-indigo-500"
          />
          <AnalysisCard 
            title="事业前程" 
            data={analysis.career} 
            icon={<BriefcaseIcon className="w-5 h-5" />} 
            color="bg-blue-500"
          />
          <AnalysisCard 
            title="财富机缘" 
            data={analysis.wealth} 
            icon={<CurrencyYenIcon className="w-5 h-5" />} 
            color="bg-amber-500"
          />
          <AnalysisCard 
            title="情感婚姻" 
            data={analysis.love} 
            icon={<HeartIcon className="w-5 h-5" />} 
            color="bg-rose-500"
          />
          <AnalysisCard 
            title="学业功名" 
            data={analysis.academics} 
            icon={<AcademicCapIcon className="w-5 h-5" />} 
            color="bg-emerald-500"
          />
          <AnalysisCard 
            title="家庭关系" 
            data={analysis.family} 
            icon={<UserGroupIcon className="w-5 h-5" />} 
            color="bg-teal-500"
          />
          <AnalysisCard 
            title="健康状况" 
            data={analysis.health} 
            icon={<PulseIcon className="w-5 h-5" />} 
            color="bg-red-400"
          />
        </div>
      </div>

      {/* Professional Chart Toggle */}
      <div className="mb-12 text-center">
        <button 
            onClick={() => setShowChart(!showChart)}
            className="inline-flex items-center text-xs text-gray-400 hover:text-purple-600 border border-gray-200 rounded-full px-4 py-2 transition-colors"
        >
            {showChart ? "收起专业盘" : "查看专业十二宫盘"}
            <ChevronDownIcon className={`w-3 h-3 ml-1 transition-transform ${showChart ? 'rotate-180' : ''}`} />
        </button>
        {showChart && (
            <div className="mt-6 animate-fade-in-up">
                <ChartGrid chart={chart} />
            </div>
        )}
      </div>

      <hr className="border-t border-gray-100 my-8" />

      {/* Section 2: Verification & Future */}
      <div className="bg-white rounded-3xl p-6 md:p-8 shadow-xl shadow-purple-100 border border-purple-50/50 relative overflow-hidden">
        {!future ? (
          <>
             <div className="mb-6">
                <div className="inline-block px-3 py-1 rounded-full bg-purple-100 text-purple-700 text-xs font-bold mb-3">第二步：校正</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    前运核实
                </h3>
                <p className="text-sm text-gray-500">
                    为了确保未来预测的准确性，请如实核对以下 AI 推算的过往大事件。全部勾选后即可解锁未来运势。
                </p>
            </div>

            <div className="space-y-4 mb-8">
                {analysis.pastEvents.map((event, idx) => (
                    <div key={idx} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-2xl bg-gray-50/80 border border-gray-100">
                        <div className="mb-3 sm:mb-0 pr-4">
                            <div className="flex items-center space-x-2 mb-1">
                                <span className="font-mono font-bold text-lg text-gray-800">{event.year}</span>
                                <span className={`text-[10px] px-1.5 py-0.5 rounded border ${event.impact === 'good' ? 'text-green-600 border-green-200 bg-green-50' : event.impact === 'bad' ? 'text-red-600 border-red-200 bg-red-50' : 'text-gray-500 border-gray-200'}`}>
                                    {event.impact === 'good' ? '吉' : event.impact === 'bad' ? '凶' : '平'}
                                </span>
                            </div>
                            <p className="text-sm text-gray-700 font-medium">{event.description}</p>
                        </div>

                        {/* Yes/No Toggle */}
                        <div className="flex items-center bg-white rounded-lg p-1 shadow-sm border border-gray-200">
                            <button 
                                onClick={() => handleVerifyToggle(idx, true)}
                                className={`flex items-center px-3 py-2 rounded-md text-sm font-bold transition-all ${verifiedStatus[idx] === true ? 'bg-green-500 text-white shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
                            >
                                <CheckIcon className="w-4 h-4 mr-1" /> 准
                            </button>
                            <div className="w-px h-4 bg-gray-200 mx-1"></div>
                            <button 
                                onClick={() => handleVerifyToggle(idx, false)}
                                className={`flex items-center px-3 py-2 rounded-md text-sm font-bold transition-all ${verifiedStatus[idx] === false ? 'bg-gray-700 text-white shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
                            >
                                <XIcon className="w-4 h-4 mr-1" /> 否
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            <button
                onClick={handlePredictClick}
                disabled={isPredicting || !allVerified}
                className="w-full bg-gray-900 hover:bg-black text-white py-4 rounded-2xl font-bold flex items-center justify-center transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-gray-200 active:scale-[0.98]"
            >
                {isPredicting ? (
                    <>
                       <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                         <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                         <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                       </svg>
                       正在推演流年流月...
                    </>
                ) : (
                    <>
                       <LockIcon className="w-5 h-5 mr-2" />
                       {allVerified ? "生成未来一年运势预测" : "请完成所有事件核对"}
                    </>
                )}
            </button>
          </>
        ) : (
          <div className="animate-fade-in">
             <div className="text-center mb-10">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-purple-100 text-purple-600 mb-4 shadow-inner">
                    <SparklesIcon className="w-7 h-7" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">未来一年运势</h3>
                <p className="text-gray-500 text-sm mt-2 max-w-md mx-auto">
                   {future.yearSummary}
                </p>
            </div>

            <div className="relative">
               {/* Timeline vertical line */}
               <div className="absolute left-[27px] top-6 bottom-6 w-0.5 bg-gray-200/60"></div>

               <div className="space-y-6">
                  {future.months.map((month, idx) => (
                    <div key={idx} className="relative pl-14 sm:pl-16">
                       {/* Timeline Node */}
                       <div className="absolute left-4 top-5 w-7 h-7 rounded-full border-4 border-white bg-purple-100 flex items-center justify-center shadow-sm z-10">
                          <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                       </div>

                       <div 
                          className={`group bg-white border border-gray-100 rounded-2xl p-5 transition-all cursor-pointer ${expandedMonth === idx ? 'shadow-lg ring-1 ring-purple-500/20' : 'shadow-sm hover:shadow-md'}`}
                          onClick={() => setExpandedMonth(expandedMonth === idx ? null : idx)}
                       >
                          <div className="flex justify-between items-start mb-3">
                             <div>
                                <div className="flex items-baseline space-x-2 mb-1">
                                   <span className="text-lg font-bold text-gray-900">{month.year}年{month.solarMonth}月</span>
                                   <span className="text-xs text-gray-500 font-medium">({month.lunarMonth})</span>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                   {month.tags.map((t, i) => (
                                      <span key={i} className="text-[10px] bg-gray-50 text-gray-600 px-2 py-0.5 rounded border border-gray-200/50">
                                         {t}
                                      </span>
                                   ))}
                                </div>
                             </div>
                             <RatingBadge rating={month.rating} />
                          </div>

                          {/* Summary (Always visible) */}
                          {!expandedMonth && expandedMonth !== idx && (
                              <p className="text-xs text-gray-400 line-clamp-2 mt-2">点击查看详情...</p>
                          )}

                          {/* Details (Expandable) */}
                          {expandedMonth === idx && (
                             <div className="mt-4 pt-4 border-t border-dashed border-gray-100 animate-fade-in">
                                <p className="text-sm text-gray-700 leading-relaxed mb-4 text-justify">
                                   {month.content}
                                </p>
                                
                                <div className="grid grid-cols-2 gap-4">
                                   <div className="bg-green-50/50 rounded-xl p-3 border border-green-100/50">
                                      <span className="text-xs font-bold text-green-700 block mb-2">宜</span>
                                      <div className="flex flex-wrap gap-2">
                                         {month.luckyGuides.map((g, i) => (
                                            <span key={i} className="text-xs text-green-800 bg-white px-2 py-1 rounded shadow-sm">
                                               {g}
                                            </span>
                                         ))}
                                      </div>
                                   </div>
                                   <div className="bg-red-50/50 rounded-xl p-3 border border-red-100/50">
                                      <span className="text-xs font-bold text-red-700 block mb-2">忌</span>
                                      <div className="flex flex-wrap gap-2">
                                         {month.unluckyGuides.map((g, i) => (
                                            <span key={i} className="text-xs text-red-800 bg-white px-2 py-1 rounded shadow-sm">
                                               {g}
                                            </span>
                                         ))}
                                      </div>
                                   </div>
                                </div>
                             </div>
                          )}
                       </div>
                    </div>
                  ))}
               </div>
            </div>
          </div>
        )}
      </div>

      <div className="mt-12 text-center text-[10px] text-gray-300 max-w-xs mx-auto leading-5">
        AI 算命仅供娱乐。愿您心有明灯，不畏将来。
      </div>
    </div>
  );
};

export default ResultView;
