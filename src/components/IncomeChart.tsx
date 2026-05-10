import { motion } from 'framer-motion';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  type TooltipProps,
} from 'recharts';
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

function CustomTooltip({ active, payload }: CustomTooltipProps) {
  if (active && payload && payload.length > 0) {
    const item = payload[0].payload;
    return (
      <div className="glass-card p-2.5 border border-white/20 shadow-lg">
        <p className="text-white font-medium text-xs">{item.name}</p>
        <p className="text-cyan-400 font-digital text-sm">
          &yen;{formatMoney(item.value)}
        </p>
        <p className="text-white/50 text-[10px]">{item.percentage}%</p>
      </div>
    );
  }
  return null;
}

function CenterLabel({
  netSalaryItem,
}: {
  netSalaryItem: IncomeBreakdown | undefined;
}) {
  if (!netSalaryItem) return null;
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
      <span className="text-white/40 text-[10px]">税后</span>
      <span className="neon-text font-digital font-bold text-sm">
        &yen;{formatMoney(netSalaryItem.value)}
      </span>
    </div>
  );
}

export function IncomeChart({ data, grossSalary }: IncomeChartProps) {
  if (data.length === 0 || grossSalary === 0) {
    return null;
  }

  const chartData = data.filter((item) => item.value > 0);
  const netSalaryItem = chartData.find((item) => item.name === '税后工资');

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="glass-card p-4 mb-3"
    >
      {/* 环形图 */}
      <div className="relative h-[120px] mb-3">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={32}
              outerRadius={50}
              paddingAngle={2}
              dataKey="value"
              animationBegin={0}
              animationDuration={800}
              strokeWidth={0}
            >
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.color}
                  stroke="rgba(255,255,255,0.06)"
                  strokeWidth={1}
                />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} cursor={false} />
          </PieChart>
        </ResponsiveContainer>
        <CenterLabel netSalaryItem={netSalaryItem} />
      </div>

      {/* 紧凑图例 - 一行一个 */}
      <div className="space-y-1.5">
        {chartData.map((item) => {
          const barColor =
            item.name === '税后工资'
              ? CHART_COLORS.netSalary
              : item.name === '个人所得税'
                ? CHART_COLORS.tax
                : CHART_COLORS.insurance;

          return (
            <div key={item.name} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div
                  className="w-2 h-2 rounded-full shrink-0"
                  style={{ backgroundColor: barColor }}
                />
                <span className="text-white/60 text-xs">{item.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-white/30 text-[10px] font-digital">
                  {item.percentage}%
                </span>
                <span className="text-white/80 font-digital text-xs">
                  &yen;{formatMoney(item.value)}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}
