import React, { useState } from 'react';
import { Gender, UserInput } from '../types';
import { ChevronRightIcon, SparklesIcon } from './Icons';

interface InputFormProps {
  onSubmit: (data: UserInput) => void;
  isLoading: boolean;
}

const InputForm: React.FC<InputFormProps> = ({ onSubmit, isLoading }) => {
  const [formData, setFormData] = useState<UserInput>({
    name: '',
    gender: Gender.MALE,
    birthDate: '',
    birthTime: '',
    birthPlace: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name && formData.birthDate && formData.birthTime && formData.birthPlace) {
      onSubmit(formData);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="glass-panel rounded-3xl p-8 shadow-2xl shadow-purple-500/10">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-purple-100 mb-4 text-purple-600 animate-pulse">
            <SparklesIcon className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">开启您的命盘</h1>
          <p className="text-gray-500 text-sm">请输入准确的生辰信息，探索命运奥秘</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name Field */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 pl-1">
              姓名
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="请输入您的称呼"
              className="w-full bg-white/60 border border-gray-200 rounded-2xl px-4 py-4 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent transition-all text-lg"
              required
            />
          </div>

          {/* Gender Field */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 pl-1">
              性别
            </label>
            <div className="grid grid-cols-2 gap-4">
              {[Gender.MALE, Gender.FEMALE].map((g) => (
                <button
                  key={g}
                  type="button"
                  onClick={() => setFormData({ ...formData, gender: g })}
                  className={`
                    py-4 px-4 rounded-2xl text-base font-medium transition-all duration-200 border
                    ${formData.gender === g
                      ? 'bg-purple-600 border-purple-600 text-white shadow-lg shadow-purple-600/30 scale-[1.02]'
                      : 'bg-white/60 border-gray-200 text-gray-600 hover:bg-purple-50'}
                  `}
                >
                  {g}
                </button>
              ))}
            </div>
          </div>

          {/* Date and Time - Styled to look like clickable pickers */}
          <div className="grid grid-cols-1 gap-4">
            <div className="relative">
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 pl-1">
                出生日期 (阳历)
              </label>
              <input
                type="date"
                name="birthDate"
                value={formData.birthDate}
                onChange={handleChange}
                className="w-full bg-white/60 border border-gray-200 rounded-2xl px-4 py-4 text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all text-lg appearance-none"
                required
                style={{ minHeight: '58px' }}
              />
            </div>
            <div className="relative">
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 pl-1">
                出生时间
              </label>
              <input
                type="time"
                name="birthTime"
                value={formData.birthTime}
                onChange={handleChange}
                className="w-full bg-white/60 border border-gray-200 rounded-2xl px-4 py-4 text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all text-lg appearance-none"
                required
                style={{ minHeight: '58px' }}
              />
            </div>
          </div>

          {/* Birth Place */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 pl-1">
              出生地点
            </label>
            <input
              type="text"
              name="birthPlace"
              value={formData.birthPlace}
              onChange={handleChange}
              placeholder="例如：广东省 深圳市"
              className="w-full bg-white/60 border border-gray-200 rounded-2xl px-4 py-4 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all text-lg"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="group w-full mt-6 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold py-4 px-6 rounded-2xl shadow-xl shadow-purple-600/30 flex items-center justify-center transition-all duration-300 transform hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                天机演算中...
              </span>
            ) : (
              <span className="flex items-center">
                立即排盘 <ChevronRightIcon className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </span>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default InputForm;