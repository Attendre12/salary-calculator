import { useCallback } from 'react';
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
    onChange(clampValue(value));
  }, [value, onChange, clampValue]);

  const sliderPercent =
    ((value - SALARY_MIN) / (SALARY_MAX - SALARY_MIN)) * 100;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      className="card p-4"
    >
      {/* 标签 */}
      <label className="text-[var(--text-secondary)] text-[13px] mb-2 block">
        税前月薪
      </label>

      {/* 输入行 */}
      <div className="flex items-center gap-2">
        <span className="text-[var(--text-tertiary)] text-lg font-mono select-none">
          &yen;
        </span>
        <input
          type="text"
          inputMode="decimal"
          value={value ? formatMoney(value) : ''}
          onChange={handleInputChange}
          onFocus={() => {}}
          onBlur={handleBlur}
          placeholder="请输入税前工资"
          aria-label="税前月薪金额"
          className="input flex-1 text-[24px] font-mono font-semibold text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] h-12 px-0 border-0 bg-transparent focus:ring-0 focus:outline-none"
          style={{
            caretColor: 'var(--accent)',
          }}
        />
        <span className="text-[var(--text-tertiary)] text-[13px] shrink-0">
          元/月
        </span>
      </div>

      {/* Range Slider */}
      <div className="mt-3">
        <input
          type="range"
          min={SALARY_MIN}
          max={SALARY_MAX}
          step={SLIDER_STEP}
          value={value}
          onChange={handleSliderChange}
          aria-label="工资滑动调节"
          className="w-full h-1 appearance-none rounded-full cursor-pointer"
          style={{
            background: `linear-gradient(to right, var(--accent) 0%, var(--accent) ${sliderPercent}%, var(--border) ${sliderPercent}%, var(--border) 100%)`,
          }}
        />
        <style>{`
          input[type="range"]::-webkit-slider-thumb {
            -webkit-appearance: none;
            appearance: none;
            width: 14px;
            height: 14px;
            border-radius: 50%;
            background: var(--accent);
            border: 2px solid var(--bg-primary);
            cursor: pointer;
            transition: transform 0.15s ease;
          }
          input[type="range"]::-webkit-slider-thumb:hover {
            transform: scale(1.15);
          }
          input[type="range"]::-moz-range-thumb {
            width: 14px;
            height: 14px;
            border-radius: 50%;
            background: var(--accent);
            border: 2px solid var(--bg-primary);
            cursor: pointer;
          }
        `}</style>
      </div>

      {/* 快捷档位 */}
      <div className="flex gap-1.5 mt-3">
        {QUICK_SALARY_OPTIONS.map((option) => {
          const isActive = value === option.value;
          return (
            <button
              key={option.value}
              onClick={() => onChange(option.value)}
              className={`btn-chip ${isActive ? 'active' : ''} font-mono`}
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
