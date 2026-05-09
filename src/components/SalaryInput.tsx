import { motion } from 'framer-motion';
import { Wallet } from 'lucide-react';
import { QUICK_SALARY_OPTIONS } from '../utils/constants';
import { formatMoney } from '../utils/taxCalculator';

interface SalaryInputProps {
  value: number;
  onChange: (value: number) => void;
}

export function SalaryInput({ value, onChange }: SalaryInputProps) {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/[^\d]/g, '');
    const numValue = rawValue ? parseInt(rawValue, 10) : 0;
    onChange(numValue);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="glass-card p-5 mb-4"
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 flex items-center justify-center">
          <Wallet className="w-5 h-5 text-cyan-400" />
        </div>
        <div>
          <h3 className="text-white font-semibold">税前月薪</h3>
          <p className="text-white/50 text-sm">输入您的税前工资金额</p>
        </div>
      </div>

      <div className="relative mb-4">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50 text-lg">¥</span>
        <input
          type="text"
          inputMode="numeric"
          value={value ? formatMoney(value) : ''}
          onChange={handleInputChange}
          placeholder="请输入税前工资"
          className="input-glow w-full h-14 pl-10 pr-4 text-xl font-mono"
        />
      </div>

      {/* 快捷选择 */}
      <div className="flex flex-wrap gap-2">
        {QUICK_SALARY_OPTIONS.map((option) => (
          <motion.button
            key={option.value}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onChange(option.value)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              value === option.value
                ? 'bg-cyan-500/30 text-cyan-300 border border-cyan-500/50'
                : 'bg-white/5 text-white/60 border border-white/10 hover:bg-white/10'
            }`}
          >
            {option.label}
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
}
