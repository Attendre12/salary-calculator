import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { PieChartIcon } from 'lucide-react';
import type { IncomeBreakdown } from '../types';
import { formatMoney } from '../utils/taxCalculator';

interface IncomeChartProps {
  data: IncomeBreakdown[];
  grossSalary: number;
}

export function IncomeChart({ data, grossSalary }: IncomeChartProps) {
  if (data.length === 0 || grossSalary === 0) {
    return null;
  }

  const chartData = data.filter(item => item.value > 0);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const item = payload[0].payload;
      return (
        <div className="glass-card p-3 border border-white/20">
          <p className="text-white font-medium">{item.name}</p>
          <p className="text-cyan-400 font-mono">¥{formatMoney(item.value)}</p>
          <p className="text-white/50 text-sm">{item.percentage}%</p>
        </div>
      );
    }
    return null;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="glass-card p-5 mb-4"
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500/20 to-emerald-500/20 flex items-center justify-center">
          <PieChartIcon className="w-5 h-5 text-green-400" />
        </div>
        <div>
          <h3 className="text-white font-semibold">收入构成</h3>
          <p className="text-white/50 text-sm">税前工资分配</p>
        </div>
      </div>

      <div className="h-48 mb-4">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={50}
              outerRadius={70}
              paddingAngle={3}
              dataKey="value"
              animationBegin={0}
              animationDuration={1000}
            >
              {chartData.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={entry.color}
                  stroke="rgba(255,255,255,0.1)"
                  strokeWidth={2}
                />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* 图例 */}
      <div className="space-y-2">
        {chartData.map((item, index) => (
          <motion.div
            key={item.name}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.5 + index * 0.1 }}
            className="flex items-center justify-between"
          >
            <div className="flex items-center gap-2">
              <div 
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: item.color }}
              />
              <span className="text-white/70 text-sm">{item.name}</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-white/50 text-xs">{item.percentage}%</span>
              <span className="text-white font-mono text-sm">¥{formatMoney(item.value)}</span>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
