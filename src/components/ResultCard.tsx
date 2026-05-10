import { motion } from 'framer-motion';
import { Receipt, Shield } from 'lucide-react';
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
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="text-center mb-3"
    >
      {/* 核心结果 - 超大字号渐变色 */}
      <div className="mb-1">
        <div className="flex items-baseline justify-center gap-1.5">
          <span className="text-white/50 text-2xl font-digital">&yen;</span>
          <span className="text-5xl font-bold gradient-text font-digital">
            {formatMoney(animatedNetSalary)}
          </span>
        </div>
        <p className="text-white/40 text-sm mt-1">
          税后到手
          {result.taxRate > 0 && (
            <span className="ml-1.5">
              &middot; 税率{formatPercent(result.taxRate)}
            </span>
          )}
        </p>
      </div>

      {/* 个税和五险一金并排小卡片 */}
      <div className="grid grid-cols-2 gap-2.5">
        <div className="rounded-xl bg-white/[0.03] border border-white/[0.06] px-3 py-2.5">
          <div className="flex items-center gap-1.5 mb-1">
            <Receipt className="w-3 h-3 text-pink-400/70" />
            <span className="text-white/50 text-xs">个人所得税</span>
          </div>
          <span className="text-lg font-bold font-digital text-pink-300">
            &yen;{formatMoney(animatedTax)}
          </span>
        </div>

        <div className="rounded-xl bg-white/[0.03] border border-white/[0.06] px-3 py-2.5">
          <div className="flex items-center gap-1.5 mb-1">
            <Shield className="w-3 h-3 text-purple-400/70" />
            <span className="text-white/50 text-xs">五险一金</span>
          </div>
          <span className="text-lg font-bold font-digital text-purple-300">
            &yen;{formatMoney(animatedInsurance)}
          </span>
        </div>
      </div>
    </motion.div>
  );
}
