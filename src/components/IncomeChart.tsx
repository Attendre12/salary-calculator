import { motion } from 'framer-motion';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  type TooltipProps
} from 'recharts';
import { PieChartIcon } from 'lucide-react';
import type { IncomeBreakdown } from '../types';
import { CHART_COLORS } from '../utils/constants';
import { formatMoney } from '../utils/taxCalculator';

interface IncomeChartProps {
  data: IncomeBreakdown[];
  grossSalary: number;
}

interface CustomTooltipPayloadEntry {
  payload: IncomeBreakdown;
}

interface CustomTooltipProps extends TooltipProps<number, string> {
  payload?: CustomTooltipPayloadEntry[];
}

// 提取到组件外部避免重复创建
function CustomTooltip({ active, payload }: CustomTooltipProps) {
  if (active && payload && payload.length > 0) {
    const item = payload[0].payload;
    return (
      <div className="glass-card p-3 border border-white/20 shadow-lg">
        <p className="text-white font-medium text-sm">{item.name}</p>
        <p className="text-cyan-400 font-digital text-base">
          ¥{formatMoney(item.value)}
        </p>
        <p className="text-white/50 text-xs">{item.percentage}%</p>
      </div>
    );
  }
  return null;
}

// 环形图中心文本组件
function CenterLabel({ netSalaryItem }: { netSalaryItem: IncomeBreakdown | undefined }) {
  if (!netSalaryItem) return null;
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
      <span className="text-white/50 text-xs">税后工资</span>
      <span className="neon-text font-digital font-bold text-lg">
        ¥{formatMoney(netSalaryItem.value)}
      </span>
    </div>
  );
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.3
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] as const }
  }
};

export function IncomeChart({ data, grossSalary }: IncomeChartProps) {
  if (data.length === 0 || grossSalary === 0) {
    return null;
  }

  const chartData = data.filter((item) => item.value > 0);
  const netSalaryItem = chartData.find((item) => item.name === '税后工资');

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="glass-card p-5 mb-4 relative overflow-hidden"
    >
      {/* 顶部装饰线 */}
      <div className="data-stream absolute top-0 left-0 w-full h-1" />

      {/* 标题区域 */}
      <motion.div variants={itemVariants} className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500/20 to-emerald-500/20 flex items-center justify-center">
          <PieChartIcon className="w-5 h-5 text-green-400" />
        </div>
        <div>
          <h3 className="text-white font-semibold">收入构成</h3>
          <p className="text-white/50 text-sm">税前工资分配</p>
        </div>
      </motion.div>

      {/* 环形图 */}
      <motion.div variants={itemVariants} className="relative h-56 mb-4">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={55}
              outerRadius={80}
              paddingAngle={3}
              dataKey="value"
              animationBegin={0}
              animationDuration={1000}
              strokeWidth={0}
            >
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.color}
                  stroke="rgba(255,255,255,0.08)"
                  strokeWidth={2}
                />
              ))}
            </Pie>
            <Tooltip
              content={<CustomTooltip />}
              cursor={false}
            />
          </PieChart>
        </ResponsiveContainer>
        {/* 中心显示税后工资金额 */}
        <CenterLabel netSalaryItem={netSalaryItem} />
      </motion.div>

      {/* glow-line 分割线 */}
      <motion.div variants={itemVariants} className="glow-line my-4" />

      {/* 图例 - data-card 样式 + 百分比进度条 */}
      <div className="space-y-3">
        {chartData.map((item, index) => {
          const barColor =
            item.name === '税后工资'
              ? CHART_COLORS.netSalary
              : item.name === '个人所得税'
                ? CHART_COLORS.tax
                : CHART_COLORS.insurance;

          return (
            <motion.div
              key={item.name}
              variants={itemVariants}
              className="data-card rounded-lg p-3"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full shrink-0"
                    style={{ backgroundColor: barColor }}
                  />
                  <span className="text-white/80 text-sm">{item.name}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-white/50 text-xs font-digital">
                    {item.percentage}%
                  </span>
                  <span className="text-white font-digital text-sm font-medium">
                    ¥{formatMoney(item.value)}
                  </span>
                </div>
              </div>
              {/* 百分比进度条 */}
              <div className="w-full h-1.5 rounded-full bg-white/5 overflow-hidden">
                <motion.div
                  className="h-full rounded-full"
                  style={{ backgroundColor: barColor }}
                  initial={{ width: 0 }}
                  animate={{ width: `${item.percentage}%` }}
                  transition={{
                    duration: 0.8,
                    delay: 0.5 + index * 0.15,
                    ease: [0.16, 1, 0.3, 1] as const
                  }}
                />
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
