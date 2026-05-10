import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { QUICK_SALARY_OPTIONS } from '../utils/constants';
import { formatMoney } from '../utils/taxCalculator';

interface SalaryInputProps {
  value: number;
  onChange: (value: number) => void;
}

const SALARY_MIN = 0;
const SALARY_MAX = 9_999_999;
const SLIDER_STEP = 100;

export function SalaryInput({ value, onChange }: SalaryInputProps) {
  const [isFocused, setIsFocused] = useState(false);

  const clampValue = useCallback(
    (num: number): number =>
      Math.min(SALARY_MAX, Math.max(SALARY_MIN, Math.round(num))),
    [],
  );

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const raw = e.target.value.replace(/[^\d.]/g, '');
      const parts = raw.split('.');
      const cleaned =
        parts.length > 2 ? `${parts[0]}.${parts.slice(1).join('')}` : raw;
      const num = cleaned ? parseFloat(cleaned) : 0;
      onChange(clampValue(isNaN(num) ? 0 : num));
    },
    [onChange, clampValue],
  );

  const handleSliderChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onChange(clampValue(Number(e.target.value)));
    },
    [onChange, clampValue],
  );

  const handleBlur = useCallback(() => {
    setIsFocused(false);
    onChange(clampValue(value));
  }, [value, onChange, clampValue]);

  const sliderPercent =
    ((value - SALARY_MIN) / (SALARY_MAX - SALARY_MIN)) * 100;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="glass-card p-4 mb-3"
    >
      {/* 单行输入：标签 + 输入框 */}
      <div className="flex items-center gap-3 mb-3">
        <label className="text-white/60 text-sm shrink-0">税前工资</label>
        <div className="relative flex-1">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30 text-sm font-digital select-none">
            &yen;
          </span>
          <input
            type="text"
            inputMode="decimal"
            value={value ? formatMoney(value) : ''}
            onChange={handleInputChange}
            onFocus={() => setIsFocused(true)}
            onBlur={handleBlur}
            placeholder="请输入税前工资"
            aria-label="税前月薪金额"
            className="input-glow w-full h-10 pl-8 pr-14 text-base font-digital"
            style={
              isFocused
                ? {
                    borderColor: 'var(--primary)',
                    boxShadow:
                      '0 0 0 2px rgba(0,212,255,0.1), 0 0 20px rgba(0,212,255,0.15)',
                  }
                : undefined
            }
          />
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-white/25 text-xs font-medium select-none">
            元/月
          </span>
        </div>
      </div>

      {/* 滑动条 */}
      <div className="mb-2.5 px-0.5">
        <input
          type="range"
          min={SALARY_MIN}
          max={SALARY_MAX}
          step={SLIDER_STEP}
          value={value}
          onChange={handleSliderChange}
          aria-label="工资滑动调节"
          className="w-full h-1.5 appearance-none rounded-full cursor-pointer"
          style={{
            background: `linear-gradient(to right, var(--primary) 0%, var(--primary) ${sliderPercent}%, rgba(255,255,255,0.08) ${sliderPercent}%, rgba(255,255,255,0.08) 100%)`,
          }}
        />
        <style>{`
          input[type="range"]::-webkit-slider-thumb {
            -webkit-appearance: none;
            appearance: none;
            width: 16px;
            height: 16px;
            border-radius: 50%;
            background: var(--primary);
            border: 2px solid var(--bg-primary);
            box-shadow: 0 0 8px rgba(0,212,255,0.4);
            cursor: pointer;
            transition: box-shadow 0.2s ease, transform 0.2s ease;
          }
          input[type="range"]::-webkit-slider-thumb:hover {
            box-shadow: 0 0 12px rgba(0,212,255,0.6);
            transform: scale(1.1);
          }
          input[type="range"]::-moz-range-thumb {
            width: 16px;
            height: 16px;
            border-radius: 50%;
            background: var(--primary);
            border: 2px solid var(--bg-primary);
            box-shadow: 0 0 8px rgba(0,212,255,0.4);
            cursor: pointer;
          }
        `}</style>
      </div>

      {/* 快捷档位按钮 */}
      <div className="flex gap-1.5">
        {QUICK_SALARY_OPTIONS.map((option) => {
          const isActive = value === option.value;
          return (
            <button
              key={option.value}
              onClick={() => onChange(option.value)}
              className={`flex-1 py-1.5 rounded-lg text-xs font-medium font-digital transition-all duration-200 ${
                isActive
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-[0_0_10px_rgba(0,212,255,0.15)]'
                  : 'bg-white/[0.03] text-white/40 border border-white/[0.06] hover:bg-white/[0.06] hover:text-white/60'
              }`}
              aria-pressed={isActive}
            >
              {option.label}
            </button>
          );
        })}
      </div>
    </motion.div>
  );
}
