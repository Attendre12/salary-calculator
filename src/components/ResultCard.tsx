import { motion } from 'framer-motion';
import {
  TrendingUp,
  Receipt,
  Shield,
  Heart,
  Home,
  Briefcase,
  AlertCircle
} from 'lucide-react';
import type { CalculationResult } from '../types';
import { useAnimatedNumber } from '../hooks/useAnimatedNumber';
import { formatMoney, formatPercent } from '../utils/taxCalculator';

interface ResultCardProps {
  result: CalculationResult;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as const }
  }
};

const insuranceItems = [
  {
    key: 'pension' as const,
    label: '养老保险',
    icon: Heart,
    color: '#00D4FF',
    bgClass: 'from-cyan-500/20 to-blue-500/20'
  },
  {
    key: 'medical' as const,
    label: '医疗保险',
    icon: Briefcase,
    color: '#7B61FF',
    bgClass: 'from-purple-500/20 to-violet-500/20'
  },
  {
    key: 'unemployment' as const,
    label: '失业保险',
    icon: AlertCircle,
    color: '#FF006E',
    bgClass: 'from-pink-500/20 to-rose-500/20'
  },
  {
    key: 'housingFund' as const,
    label: '住房公积金',
    icon: Home,
    color: '#FFB800',
    bgClass: 'from-amber-500/20 to-yellow-500/20'
  }
];

export function ResultCard({ result }: ResultCardProps) {
  const animatedNetSalary = useAnimatedNumber(result.netSalary, {
    duration: 1000,
    delay: 200
  });
  const animatedTax = useAnimatedNumber(result.taxAmount, {
    duration: 800,
    delay: 400
  });
  const animatedInsurance = useAnimatedNumber(result.insuranceTotal, {
    duration: 800,
    delay: 500
  });

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="glass-card p-6 mb-4 relative overflow-hidden"
    >
      {/* data-stream 装饰线条 */}
      <div className="data-stream absolute top-0 left-0 w-full h-1" />
      <div className="data-stream absolute bottom-0 left-0 w-full h-0.5 opacity-50" />

      {/* 标题区域 */}
      <motion.div variants={itemVariants} className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 flex items-center justify-center">
          <TrendingUp className="w-5 h-5 text-cyan-400" />
        </div>
        <div>
          <h3 className="text-white font-semibold">计算结果</h3>
          <p className="text-white/50 text-sm">实时工资明细</p>
        </div>
      </motion.div>

      {/* 主要结果 - 税后到手金额 (cyber-border 旋转边框动画包裹) */}
      <motion.div variants={itemVariants} className="mb-8">
        <div className="cyber-border rounded-2xl p-6 text-center">
          <p className="text-white/60 text-sm mb-3">税后到手工资</p>
          <div className="flex items-baseline justify-center gap-2">
            <span className="text-white/60 text-2xl font-digital">¥</span>
            <span className="text-6xl font-bold gradient-text font-digital animate-pulse-slow">
              {formatMoney(animatedNetSalary)}
            </span>
          </div>
          {result.taxRate > 0 && (
            <div className="mt-4">
              <span className="neon-text px-4 py-1.5 rounded-full text-sm font-medium">
                适用税率 {formatPercent(result.taxRate)}
              </span>
            </div>
          )}
        </div>
      </motion.div>

      {/* glow-line 分割线 */}
      <motion.div variants={itemVariants} className="glow-line my-6" />

      {/* 个税和五险一金 - data-card 样式，左侧带渐变色指示条 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        {/* 个人所得税 */}
        <motion.div
          variants={itemVariants}
          className="data-card relative overflow-hidden rounded-xl"
        >
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-pink-500 to-rose-500" />
          <div className="pl-4 pr-4 py-4">
            <div className="flex items-center gap-2 mb-2">
              <Receipt className="w-4 h-4 text-pink-400" />
              <span className="text-white/70 text-sm">个人所得税</span>
            </div>
            <div className="text-2xl font-bold font-digital text-pink-300">
              ¥{formatMoney(animatedTax)}
            </div>
            {result.taxRate > 0 && (
              <span className="text-white/40 text-xs mt-1 block">
                税率 {formatPercent(result.taxRate)}
              </span>
            )}
          </div>
        </motion.div>

        {/* 五险一金 */}
        <motion.div
          variants={itemVariants}
          className="data-card relative overflow-hidden rounded-xl"
        >
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-purple-500 to-violet-500" />
          <div className="pl-4 pr-4 py-4">
            <div className="flex items-center gap-2 mb-2">
              <Shield className="w-4 h-4 text-purple-400" />
              <span className="text-white/70 text-sm">五险一金</span>
            </div>
            <div className="text-2xl font-bold font-digital text-purple-300">
              ¥{formatMoney(animatedInsurance)}
            </div>
            <span className="text-white/40 text-xs mt-1 block">
              合计扣除
            </span>
          </div>
        </motion.div>
      </div>

      {/* glow-line 分割线 */}
      <motion.div variants={itemVariants} className="glow-line my-4" />

      {/* 五险一金明细 - 网格布局，每项带图标和颜色标识 */}
      <motion.div variants={itemVariants}>
        <p className="text-white/60 text-xs mb-3 font-medium tracking-wider uppercase">
          五险一金明细
        </p>
        <div className="grid grid-cols-2 gap-3">
          {insuranceItems.map((item) => {
            const value = result.insuranceDetail[item.key];
            const Icon = item.icon;
            return (
              <motion.div
                key={item.key}
                variants={itemVariants}
                className="data-card rounded-lg p-3 flex items-center gap-3"
              >
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                  style={{
                    backgroundColor: `${item.color}15`,
                    border: `1px solid ${item.color}30`
                  }}
                >
                  <Icon
                    className="w-4 h-4"
                    style={{ color: item.color }}
                  />
                </div>
                <div className="min-w-0">
                  <p className="text-white/50 text-xs truncate">{item.label}</p>
                  <p
                    className="font-digital font-bold text-sm"
                    style={{ color: item.color }}
                  >
                    ¥{formatMoney(value)}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* 底部 data-stream 装饰 */}
      <motion.div variants={itemVariants} className="mt-6">
        <div className="data-stream h-0.5 rounded-full opacity-30" />
      </motion.div>
    </motion.div>
  );
}
