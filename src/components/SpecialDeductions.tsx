import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
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
  icon: typeof Baby;
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

  const isHousingLoanActive = deductions.housingLoan > 0;
  const isHousingRentActive = deductions.housingRent > 0;

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
      icon: Baby,
      hasCount: true,
      countKey: 'childrenCount',
      maxCount: MAX_CHILDREN_COUNT,
    },
    {
      key: 'continuingEducation',
      label: '继续教育',
      icon: BookOpen,
      options: [
        { label: '无', value: 0 },
        { label: '学历 400/月', value: 400 },
        { label: '资格 300/月', value: 300 },
      ],
    },
    {
      key: 'housingLoan',
      label: '住房贷款',
      icon: Home,
      options: [
        { label: '无', value: 0 },
        { label: '1000/月', value: 1000 },
      ],
      disabled: isHousingRentActive,
      disabledReason: '与住房租金互斥',
    },
    {
      key: 'housingRent',
      label: '住房租金',
      icon: Home,
      options: [
        { label: '无', value: 0 },
        { label: '1500/月', value: 1500 },
        { label: '1100/月', value: 1100 },
        { label: '800/月', value: 800 },
      ],
      disabled: isHousingLoanActive,
      disabledReason: '与住房贷款互斥',
    },
    {
      key: 'elderlyCare',
      label: '赡养老人',
      icon: Users,
      options: [
        { label: '无', value: 0 },
        { label: '独生 2000/月', value: 2000 },
        { label: '非独生 1000/月', value: 1000 },
      ],
    },
    {
      key: 'infantCare',
      label: '婴幼儿照护',
      icon: Heart,
      hasCount: true,
      countKey: 'infantCount',
      maxCount: MAX_INFANT_COUNT,
    },
  ];

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
    <div className="card overflow-hidden">
      {/* 折叠触发器 */}
      <div
        className="collapse-trigger"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-2">
          <span className="text-[var(--text-primary)] text-sm">
            专项附加扣除
          </span>
          {totalDeduction > 0 && (
            <span className="text-accent font-mono text-sm font-medium">
              {activeCount}项 &yen;{totalDeduction.toLocaleString()}
            </span>
          )}
        </div>
        <motion.div
          animate={{ rotate: isExpanded ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown className="w-4 h-4 text-[var(--text-tertiary)]" />
        </motion.div>
      </div>

      {/* 展开内容 */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="px-4 pt-4 pb-4 space-y-2">
              {/* 互斥提示 */}
              <AnimatePresence>
                {(isHousingLoanActive || isHousingRentActive) && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="flex items-center gap-1.5 rounded-lg border border-[var(--warning)]/20 bg-[var(--warning)]/5 px-2.5 py-1.5"
                  >
                    <AlertTriangle className="w-3 h-3 text-[var(--warning)] shrink-0" />
                    <p className="text-[var(--warning)] text-[10px] leading-relaxed">
                      住房贷款利息与住房租金互斥，不可同时享受
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* 各项扣除 */}
              {deductionItems.map((item) => {
                const monthlyAmount = getMonthlyAmount(item);
                const Icon = item.icon;

                return (
                  <div
                    key={item.key}
                    className={`flex items-center gap-2 py-1.5 ${
                      item.disabled ? 'opacity-40 pointer-events-none' : ''
                    }`}
                  >
                    {/* 图标 + 名称 */}
                    <div className="flex items-center gap-1.5 w-20 shrink-0">
                      <Icon className="w-4 h-4 text-[var(--text-tertiary)] shrink-0" />
                      <span className="text-[var(--text-secondary)] text-sm">
                        {item.label}
                      </span>
                    </div>

                    {/* 选项或数量 */}
                    <div className="flex-1 flex items-center gap-1">
                      {item.hasCount && item.countKey ? (
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => {
                              const currentCount =
                                deductions[item.countKey!] || 0;
                              if (currentCount > 0) {
                                onUpdate(item.countKey!, currentCount - 1);
                              }
                            }}
                            disabled={(deductions[item.countKey!] || 0) <= 0}
                            className="w-6 h-6 rounded border border-[var(--border)] text-[var(--text-secondary)] hover:bg-[var(--bg-elevated)] disabled:opacity-20 flex items-center justify-center transition-colors"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="text-[var(--text-primary)] w-5 text-center text-sm font-medium font-mono">
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
                            className="w-6 h-6 rounded border border-[var(--border)] text-[var(--text-secondary)] hover:bg-[var(--bg-elevated)] disabled:opacity-20 flex items-center justify-center transition-colors"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                          <span className="text-[var(--text-tertiary)] text-[10px]">
                            个
                          </span>
                        </div>
                      ) : (
                        <div className="flex flex-wrap gap-1">
                          {item.options?.map((option) => (
                            <button
                              key={option.value}
                              onClick={() => onUpdate(item.key, option.value)}
                              className={`btn-chip ${deductions[item.key] === option.value ? 'active' : ''}`}
                            >
                              {option.label}
                            </button>
                          ))}
                        </div>
                      )}

                      {/* 禁用提示 */}
                      {item.disabled && item.disabledReason && (
                        <div className="flex items-center gap-1 text-[10px] text-[var(--text-tertiary)]">
                          <Info className="w-3 h-3" />
                          <span>{item.disabledReason}</span>
                        </div>
                      )}
                    </div>

                    {/* 金额 */}
                    <span className="text-[var(--text-primary)] font-mono text-[13px] w-16 text-right shrink-0">
                      {monthlyAmount > 0
                        ? `¥${monthlyAmount.toLocaleString()}`
                        : '-'}
                    </span>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
