import React, { useState } from 'react';
import InputForm from './components/InputForm';
import ResultView from './components/ResultView';
import { UserInput, FullPrediction, PastEvent } from './types';
import { generatePrediction, generateFutureForecast } from './services/geminiService';

const App: React.FC = () => {
  const [step, setStep] = useState<'input' | 'result'>('input');
  const [isLoading, setIsLoading] = useState(false);
  const [isPredicting, setIsPredicting] = useState(false);
  const [userData, setUserData] = useState<UserInput | null>(null);
  const [prediction, setPrediction] = useState<FullPrediction | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFormSubmit = async (data: UserInput) => {
    setIsLoading(true);
    setError(null);
    setUserData(data);
    
    try {
      const result = await generatePrediction(data);
      setPrediction(result);
      setStep('result');
    } catch (err) {
      setError("排盘失败，请检查网络或稍后再试。");
    } finally {
      setIsLoading(false);
    }
  };

  const handleFuturePrediction = async (verifiedEvents: PastEvent[]) => {
    if (!prediction || !userData) return;
    
    setIsPredicting(true);
    try {
        const forecast = await generateFutureForecast(prediction.chart, userData, verifiedEvents);
        setPrediction(prev => prev ? { ...prev, future: forecast } : null);
    } catch (err) {
        alert("预测未来运势时出现错误，请重试。");
    } finally {
        setIsPredicting(false);
    }
  };

  const handleBack = () => {
    setStep('input');
    setPrediction(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-indigo-50 text-gray-900 font-sans selection:bg-purple-200">
      
      {/* Background Ambient Orbs */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-[10%] -right-[10%] w-[70%] h-[70%] rounded-full bg-purple-200/20 blur-[120px]"></div>
        <div className="absolute top-[40%] -left-[20%] w-[60%] h-[60%] rounded-full bg-indigo-200/20 blur-[120px]"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-6 md:py-10 flex flex-col min-h-screen">
        {/* Header Logo */}
        <header className="flex justify-center mb-6 md:mb-10">
          <div className="flex items-center space-x-2 bg-white/50 backdrop-blur px-4 py-2 rounded-full border border-white/50 shadow-sm">
            <div className="w-2.5 h-2.5 rounded-full bg-purple-600"></div>
            <span className="text-lg font-bold tracking-widest text-gray-800">紫微斗数 · 天机</span>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-grow flex items-center justify-center w-full">
          {error && (
            <div className="fixed top-20 left-1/2 transform -translate-x-1/2 bg-red-50 text-red-600 px-6 py-3 rounded-full shadow-lg border border-red-100 z-50 text-sm font-medium animate-bounce">
              {error}
            </div>
          )}

          {step === 'input' ? (
            <div className="w-full animate-fade-in-up">
               <InputForm onSubmit={handleFormSubmit} isLoading={isLoading} />
            </div>
          ) : (
            prediction && userData && (
              <ResultView 
                prediction={prediction} 
                userData={userData} 
                onBack={handleBack} 
                onPredictFuture={handleFuturePrediction}
                isPredicting={isPredicting}
              />
            )
          )}
        </main>

        <footer className="mt-12 text-center text-[10px] text-gray-400 pb-4">
          &copy; {new Date().getFullYear()} Ziwei Doushu AI.
        </footer>
      </div>
      
      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translate3d(0, 20px, 0);
          }
          to {
            opacity: 1;
            transform: translate3d(0, 0, 0);
          }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fade-in-up {
          animation: fadeInUp 0.6s cubic-bezier(0.2, 0.8, 0.2, 1);
        }
        .animate-fade-in {
          animation: fadeIn 0.5s ease-out;
        }
      `}</style>
    </div>
  );
};

export default App;