import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Wallet } from 'lucide-react';
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
    (num: number): number => Math.min(SALARY_MAX, Math.max(SALARY_MIN, Math.round(num))),
    [],
  );

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const raw = e.target.value.replace(/[^\d.]/g, '');
      // 只保留第一个小数点
      const parts = raw.split('.');
      const cleaned = parts.length > 2
        ? `${parts[0]}.${parts.slice(1).join('')}`
        : raw;
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

  const sliderPercent = ((value - SALARY_MIN) / (SALARY_MAX - SALARY_MIN)) * 100;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
      className="glass-card cyber-border p-5 mb-4"
    >
      {/* 标题区 */}
      <div className="flex items-center gap-3 mb-5">
        <div className="relative">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 flex items-center justify-center border border-cyan-500/20">
            <Wallet className="w-5 h-5 text-cyan-400" />
          </div>
        </div>
        <div>
          <h3 className="neon-text font-semibold text-base">税前月薪</h3>
          <p className="text-white/40 text-xs tracking-wide">输入您的税前工资金额</p>
        </div>
      </div>

      {/* 金额输入区 */}
      <div className="relative mb-4">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 text-xl font-digital select-none">
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
          className="input-glow w-full h-14 pl-10 pr-20 text-xl font-digital"
          style={
            isFocused
              ? {
                  borderColor: 'var(--primary)',
                  boxShadow:
                    '0 0 0 3px rgba(0,212,255,0.12), 0 0 25px rgba(0,212,255,0.2), 0 0 50px rgba(0,212,255,0.08)',
                }
              : undefined
          }
        />
        {/* 单位标签 */}
        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 text-sm font-medium tracking-wider select-none">
          元/月
        </span>

        {/* 聚焦时的霓虹角标装饰 */}
        <AnimatePresence>
          {isFocused && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="pointer-events-none absolute -inset-[1px] rounded-xl"
              aria-hidden="true"
              style={{
                boxShadow:
                  'inset 0 0 20px rgba(0,212,255,0.06), 0 0 1px rgba(0,212,255,0.5)',
              }}
            />
          )}
        </AnimatePresence>
      </div>

      {/* 滑动条 */}
      <div className="mb-5 px-1">
        <div className="relative">
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
          {/* 滑块样式通过内联 style 注入 */}
          <style>{`
            input[type="range"]::-webkit-slider-thumb {
              -webkit-appearance: none;
              appearance: none;
              width: 18px;
              height: 18px;
              border-radius: 50%;
              background: var(--primary);
              border: 2px solid var(--bg-primary);
              box-shadow: 0 0 10px rgba(0,212,255,0.5), 0 0 20px rgba(0,212,255,0.2);
              cursor: pointer;
              transition: box-shadow 0.2s ease, transform 0.2s ease;
            }
            input[type="range"]::-webkit-slider-thumb:hover {
              box-shadow: 0 0 15px rgba(0,212,255,0.7), 0 0 30px rgba(0,212,255,0.3);
              transform: scale(1.15);
            }
            input[type="range"]::-moz-range-thumb {
              width: 18px;
              height: 18px;
              border-radius: 50%;
              background: var(--primary);
              border: 2px solid var(--bg-primary);
              box-shadow: 0 0 10px rgba(0,212,255,0.5), 0 0 20px rgba(0,212,255,0.2);
              cursor: pointer;
            }
          `}</style>
        </div>
        {/* 滑动条范围标注 */}
        <div className="flex justify-between mt-1.5 text-[10px] text-white/20 font-digital select-none">
          <span>0</span>
          <span>2.5M</span>
          <span>5M</span>
          <span>7.5M</span>
          <span>9.9M</span>
        </div>
      </div>

      {/* 快捷选择 */}
      <div className="flex flex-wrap gap-2">
        {QUICK_SALARY_OPTIONS.map((option, index) => {
          const isActive = value === option.value;
          return (
            <motion.button
              key={option.value}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.3,
                delay: 0.2 + index * 0.05,
                ease: [0.16, 1, 0.3, 1],
              }}
              whileHover={{ scale: 1.06 }}
              whileTap={{ scale: 0.92 }}
              onClick={() => onChange(option.value)}
              className={`relative px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                isActive
                  ? 'bg-cyan-500/25 text-cyan-300 border border-cyan-500/50 shadow-[0_0_15px_rgba(0,212,255,0.25),inset_0_0_15px_rgba(0,212,255,0.08)]'
                  : 'bg-white/5 text-white/50 border border-white/10 hover:bg-white/10 hover:text-white/70 hover:border-white/20'
              }`}
              aria-pressed={isActive}
            >
              {isActive && (
                <motion.span
                  layoutId="salary-active-indicator"
                  className="absolute inset-0 rounded-full border border-cyan-400/40"
                  style={{
                    boxShadow:
                      '0 0 12px rgba(0,212,255,0.3), inset 0 0 12px rgba(0,212,255,0.06)',
                  }}
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  aria-hidden="true"
                />
              )}
              <span className="relative z-10 font-digital">{option.label}</span>
            </motion.button>
          );
        })}
      </div>
    </motion.div>
  );
}
