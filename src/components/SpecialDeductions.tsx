import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Gift,
  ChevronDown,
  Baby,
  BookOpen,
  Home,
  Users,
  Heart,
  AlertTriangle,
  Minus,
  Plus,
  Info,
} from 'lucide-react';
import type { SpecialDeductions as SpecialDeductionsType } from '../types';

interface SpecialDeductionsProps {
  deductions: SpecialDeductionsType;
  onUpdate: (key: keyof SpecialDeductionsType, value: number) => void;
}

const MAX_CHILDREN_COUNT = 10;
const MAX_INFANT_COUNT = 10;

interface DeductionItemOption {
  label: string;
  value: number;
}

interface DeductionItem {
  key: keyof SpecialDeductionsType;
  label: string;
  description: string;
  icon: typeof Baby;
  color: string;
  iconColor: string;
  accentColor: string;
  hasCount?: boolean;
  countKey?: keyof SpecialDeductionsType;
  maxCount?: number;
  options?: DeductionItemOption[];
  disabled?: boolean;
  disabledReason?: string;
}

export function SpecialDeductionsPanel({
  deductions,
  onUpdate,
}: SpecialDeductionsProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  // 住房贷款与住房租金互斥逻辑
  const isHousingLoanActive = deductions.housingLoan > 0;
  const isHousingRentActive = deductions.housingRent > 0;

  // 计算每项扣除的月度金额
  const getMonthlyAmount = (item: DeductionItem): number => {
    if (item.hasCount && item.countKey) {
      const count = deductions[item.countKey] || 0;
      return (deductions[item.key] || 0) * count;
    }
    return deductions[item.key] || 0;
  };

  const deductionItems: DeductionItem[] = [
    {
      key: 'childrenEducation',
      label: '子女教育',
      description: '每个子女每月扣除',
      icon: Baby,
      color: 'from-pink-500/20 to-rose-500/20',
      iconColor: 'text-pink-400',
      accentColor: '#FF6B9D',
      hasCount: true,
      countKey: 'childrenCount',
      maxCount: MAX_CHILDREN_COUNT,
    },
    {
      key: 'continuingEducation',
      label: '继续教育',
      description: '学历/职业资格',
      icon: BookOpen,
      color: 'from-blue-500/20 to-indigo-500/20',
      iconColor: 'text-blue-400',
      accentColor: '#60A5FA',
      options: [
        { label: '无', value: 0 },
        { label: '学历教育 400元/月', value: 400 },
        { label: '职业资格 3600元/年', value: 300 },
      ],
    },
    {
      key: 'housingLoan',
      label: '住房贷款利息',
      description: '首套房贷款',
      icon: Home,
      color: 'from-green-500/20 to-emerald-500/20',
      iconColor: 'text-green-400',
      accentColor: '#34D399',
      options: [
        { label: '无', value: 0 },
        { label: '1000元/月', value: 1000 },
      ],
      disabled: isHousingRentActive,
      disabledReason: '住房贷款利息与住房租金不可同时享受',
    },
    {
      key: 'housingRent',
      label: '住房租金',
      description: '按城市等级',
      icon: Home,
      color: 'from-yellow-500/20 to-orange-500/20',
      iconColor: 'text-yellow-400',
      accentColor: '#FBBF24',
      options: [
        { label: '无', value: 0 },
        { label: '1500元/月', value: 1500 },
        { label: '1100元/月', value: 1100 },
        { label: '800元/月', value: 800 },
      ],
      disabled: isHousingLoanActive,
      disabledReason: '住房租金与住房贷款利息不可同时享受',
    },
    {
      key: 'elderlyCare',
      label: '赡养老人',
      description: '60岁以上父母',
      icon: Users,
      color: 'from-purple-500/20 to-violet-500/20',
      iconColor: 'text-purple-400',
      accentColor: '#A78BFA',
      options: [
        { label: '无', value: 0 },
        { label: '独生子女 2000元/月', value: 2000 },
        { label: '非独生子女 1000元/月', value: 1000 },
      ],
    },
    {
      key: 'infantCare',
      label: '婴幼儿照护',
      description: '3岁以下婴幼儿',
      icon: Heart,
      color: 'from-cyan-500/20 to-teal-500/20',
      iconColor: 'text-cyan-400',
      accentColor: '#22D3EE',
      hasCount: true,
      countKey: 'infantCount',
      maxCount: MAX_INFANT_COUNT,
    },
  ];

  // 计算总扣除
  const totalDeduction =
    deductions.childrenEducation * deductions.childrenCount +
    deductions.continuingEducation +
    deductions.housingLoan +
    deductions.housingRent +
    deductions.elderlyCare +
    deductions.infantCare * deductions.infantCount;

  const activeCount = deductionItems.filter(
    (item) => getMonthlyAmount(item) > 0,
  ).length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="glass-card p-5 mb-4"
    >
      {/* 标题栏 */}
      <div
        className="flex items-center justify-between cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-500/20 to-rose-500/20 flex items-center justify-center">
            <Gift className="w-5 h-5 text-pink-400" />
          </div>
          <div>
            <h3 className="text-white font-semibold">专项附加扣除</h3>
            <p className="text-white/50 text-sm">
              {totalDeduction > 0
                ? `每月扣除 ¥${totalDeduction.toLocaleString()}`
                : '点击配置专项扣除'}
            </p>
          </div>
        </div>
        <motion.div
          animate={{ rotate: isExpanded ? 180 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <ChevronDown className="w-5 h-5 text-white/50" />
        </motion.div>
      </div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="pt-4 space-y-4">
              {/* 顶部汇总区域 - 渐变背景 */}
              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 }}
                className="rounded-xl p-4 bg-gradient-to-r from-cyan-500/10 via-purple-500/10 to-pink-500/10 border border-white/5"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white/50 text-xs mb-1">专项附加扣除合计</p>
                    <p
                      className="neon-text text-2xl font-bold"
                      style={{ color: '#00D4FF' }}
                    >
                      ¥{totalDeduction.toLocaleString()}
                      <span className="text-sm font-normal text-white/40 ml-1">
                        /月
                      </span>
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-white/50 text-xs mb-1">已启用项</p>
                    <p className="text-white/80 text-lg font-semibold">
                      {activeCount}
                      <span className="text-sm font-normal text-white/40">
                        /{deductionItems.length}
                      </span>
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* 互斥提示 */}
              <AnimatePresence>
                {(isHousingLoanActive || isHousingRentActive) && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="flex items-start gap-2 rounded-lg bg-amber-500/10 border border-amber-500/20 p-3"
                  >
                    <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                    <p className="text-amber-300/80 text-xs leading-relaxed">
                      住房贷款利息与住房租金属于互斥项，不可同时享受扣除。当前已选择
                      {isHousingLoanActive ? '住房贷款利息' : '住房租金'}
                      ，另一项已自动置灰。
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="glow-line" />

              {/* 各项扣除 */}
              <div className="space-y-3">
                {deductionItems.map((item, index) => {
                  const monthlyAmount = getMonthlyAmount(item);
                  return (
                    <motion.div
                      key={item.key}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.04 }}
                      className={`data-card rounded-xl p-4 transition-opacity ${
                        item.disabled ? 'opacity-50 pointer-events-none' : ''
                      }`}
                    >
                      {/* 标题行 */}
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-9 h-9 rounded-lg bg-gradient-to-br ${item.color} flex items-center justify-center`}
                          >
                            <item.icon
                              className={`w-4 h-4 ${item.iconColor}`}
                            />
                          </div>
                          <div>
                            <span className="text-white/90 text-sm font-medium">
                              {item.label}
                            </span>
                            <p className="text-white/40 text-xs">
                              {item.description}
                            </p>
                          </div>
                        </div>
                        {monthlyAmount > 0 && (
                          <span
                            className="neon-text text-sm font-semibold"
                            style={{ color: item.accentColor }}
                          >
                            ¥{monthlyAmount.toLocaleString()}/月
                          </span>
                        )}
                      </div>

                      {/* 禁用提示 */}
                      {item.disabled && item.disabledReason && (
                        <div className="flex items-center gap-1.5 mb-3 text-xs text-white/30">
                          <Info className="w-3 h-3" />
                          <span>{item.disabledReason}</span>
                        </div>
                      )}

                      {/* 数量选择器 */}
                      {item.hasCount && item.countKey ? (
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => {
                                const currentCount =
                                  deductions[item.countKey!] || 0;
                                if (currentCount > 0) {
                                  onUpdate(item.countKey!, currentCount - 1);
                                }
                              }}
                              disabled={
                                (deductions[item.countKey!] || 0) <= 0
                              }
                              className="w-8 h-8 rounded-lg bg-white/10 text-white/60 hover:bg-white/20 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center transition-colors"
                            >
                              <Minus className="w-3.5 h-3.5" />
                            </button>
                            <span className="text-white w-8 text-center font-medium">
                              {deductions[item.countKey!] || 0}
                            </span>
                            <button
                              onClick={() => {
                                const currentCount =
                                  deductions[item.countKey!] || 0;
                                if (currentCount < (item.maxCount ?? 99)) {
                                  onUpdate(item.countKey!, currentCount + 1);
                                }
                              }}
                              disabled={
                                (deductions[item.countKey!] || 0) >=
                                (item.maxCount ?? 99)
                              }
                              className="w-8 h-8 rounded-lg bg-white/10 text-white/60 hover:bg-white/20 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center transition-colors"
                            >
                              <Plus className="w-3.5 h-3.5" />
                            </button>
                          </div>
                          <span className="text-white/50 text-sm">个</span>
                          {item.maxCount && (
                            <span className="text-white/20 text-xs">
                              （最多{item.maxCount}个）
                            </span>
                          )}
                          {deductions[item.countKey!]! > 0 && (
                            <span
                              className="neon-text text-sm ml-auto font-medium"
                              style={{ color: item.accentColor }}
                            >
                              ¥
                              {(deductions[item.key] || 0) *
                                (deductions[item.countKey!] || 0)}
                              /月
                            </span>
                          )}
                        </div>
                      ) : (
                        /* 选项按钮组 */
                        <div className="flex flex-wrap gap-2">
                          {item.options?.map((option) => (
                            <button
                              key={option.value}
                              onClick={() => onUpdate(item.key, option.value)}
                              className={`px-3 py-1.5 rounded-lg text-sm transition-all ${
                                deductions[item.key] === option.value
                                  ? 'bg-cyan-500/30 text-cyan-300 border border-cyan-500/50'
                                  : 'bg-white/5 text-white/60 border border-white/10 hover:bg-white/10'
                              }`}
                            >
                              {option.label}
                            </button>
                          ))}
                        </div>
                      )}
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
