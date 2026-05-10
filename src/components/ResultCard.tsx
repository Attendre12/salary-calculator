import { motion } from 'framer-motion';
import type { CalculationResult } from '../types';
import { useAnimatedNumber } from '../hooks/useAnimatedNumber';
import { formatMoney, formatPercent } from '../utils/taxCalculator';

interface ResultCardProps {
  result: CalculationResult;
}

export function ResultCard({ result }: ResultCardProps) {
  const animatedNetSalary = useAnimatedNumber(result.netSalary, {
    duration: 1000,
    delay: 200,
  });
  const animatedTax = useAnimatedNumber(result.taxAmount, {
    duration: 800,
    delay: 400,
  });
  const animatedInsurance = useAnimatedNumber(result.insuranceTotal, {
    duration: 800,
    delay: 500,
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      className="card p-6"
    >
      {/* 核心金额区 */}
      <div className="text-center">
        <p className="text-[var(--text-tertiary)] text-xs tracking-wider uppercase mb-1">
          税后到手
        </p>
        <div className="flex items-baseline justify-center gap-1">
          <span className="text-[var(--text-tertiary)] text-2xl font-mono">
            &yen;
          </span>
          <span className="text-gradient text-[40px] font-bold font-mono leading-tight">
            {formatMoney(animatedNetSalary)}
          </span>
        </div>
        {result.taxRate > 0 && (
          <p className="text-[var(--text-tertiary)] text-[13px] mt-1">
            适用税率 {formatPercent(result.taxRate)}
          </p>
        )}
      </div>

      {/* 分割线 */}
      <div className="my-4 border-t border-[var(--border)]" />

      {/* 两列网格 */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <p className="text-[var(--text-secondary)] text-xs mb-0.5">
            个人所得税
          </p>
          <p className="text-[var(--text-primary)] text-lg font-semibold font-mono">
            &yen;{formatMoney(animatedTax)}
          </p>
        </div>
        <div>
          <p className="text-[var(--text-secondary)] text-xs mb-0.5">
            五险一金
          </p>
          <p className="text-[var(--text-primary)] text-lg font-semibold font-mono">
            &yen;{formatMoney(animatedInsurance)}
          </p>
        </div>
      </div>
    </motion.div>
  );
}
