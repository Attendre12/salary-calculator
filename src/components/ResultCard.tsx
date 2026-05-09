import { motion } from 'framer-motion';
import { TrendingUp, Wallet, Receipt, Shield } from 'lucide-react';
import type { CalculationResult } from '../types';
import { useAnimatedNumber } from '../hooks/useAnimatedNumber';
import { formatMoney, formatPercent } from '../utils/taxCalculator';

interface ResultCardProps {
  result: CalculationResult;
}

export function ResultCard({ result }: ResultCardProps) {
  const animatedNetSalary = useAnimatedNumber(result.netSalary, { duration: 800, delay: 100 });
  const animatedTax = useAnimatedNumber(result.taxAmount, { duration: 800, delay: 200 });
  const animatedInsurance = useAnimatedNumber(result.insuranceTotal, { duration: 800, delay: 300 });

  const resultItems = [
    {
      label: '税后到手',
      value: animatedNetSalary,
      realValue: result.netSalary,
      icon: Wallet,
      color: 'from-cyan-500/20 to-blue-500/20',
      iconColor: 'text-cyan-400',
      textColor: 'text-cyan-300',
      isMain: true
    },
    {
      label: '个人所得税',
      value: animatedTax,
      realValue: result.taxAmount,
      icon: Receipt,
      color: 'from-pink-500/20 to-rose-500/20',
      iconColor: 'text-pink-400',
      textColor: 'text-pink-300',
      suffix: result.taxRate > 0 ? ` (${formatPercent(result.taxRate)})` : ''
    },
    {
      label: '五险一金',
      value: animatedInsurance,
      realValue: result.insuranceTotal,
      icon: Shield,
      color: 'from-purple-500/20 to-violet-500/20',
      iconColor: 'text-purple-400',
      textColor: 'text-purple-300'
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="glass-card p-6 mb-4"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 flex items-center justify-center">
          <TrendingUp className="w-5 h-5 text-cyan-400" />
        </div>
        <div>
          <h3 className="text-white font-semibold">计算结果</h3>
          <p className="text-white/50 text-sm">实时工资明细</p>
        </div>
      </div>

      {/* 主要结果 - 税后工资 */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="text-center mb-8"
      >
        <p className="text-white/60 text-sm mb-2">税后到手工资</p>
        <div className="flex items-baseline justify-center gap-1">
          <span className="text-white/60 text-2xl">¥</span>
          <span className="text-5xl font-bold gradient-text font-mono">
            {formatMoney(animatedNetSalary)}
          </span>
        </div>
        {result.taxRate > 0 && (
          <span className="tag-capsule mt-3 inline-block">
            适用税率 {formatPercent(result.taxRate)}
          </span>
        )}
      </motion.div>

      {/* 分项明细 */}
      <div className="grid grid-cols-2 gap-3">
        {resultItems.slice(1).map((item, index) => (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.2 + index * 0.1 }}
            className={`p-4 rounded-xl bg-gradient-to-br ${item.color} border border-white/10`}
          >
            <div className="flex items-center gap-2 mb-2">
              <item.icon className={`w-4 h-4 ${item.iconColor}`} />
              <span className="text-white/70 text-xs">{item.label}</span>
            </div>
            <div className={`text-xl font-bold font-mono ${item.textColor}`}>
              ¥{formatMoney(item.value)}
            </div>
            {item.suffix && (
              <span className="text-white/40 text-xs">{item.suffix}</span>
            )}
          </motion.div>
        ))}
      </div>

      {/* 五险一金明细 */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.5 }}
        className="mt-4 p-4 rounded-xl bg-white/5 border border-white/10"
      >
        <p className="text-white/60 text-xs mb-3">五险一金明细</p>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="flex justify-between">
            <span className="text-white/50">养老保险</span>
            <span className="text-white/80 font-mono">¥{formatMoney(result.insuranceDetail.pension)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-white/50">医疗保险</span>
            <span className="text-white/80 font-mono">¥{formatMoney(result.insuranceDetail.medical)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-white/50">失业保险</span>
            <span className="text-white/80 font-mono">¥{formatMoney(result.insuranceDetail.unemployment)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-white/50">住房公积金</span>
            <span className="text-white/80 font-mono">¥{formatMoney(result.insuranceDetail.housingFund)}</span>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
