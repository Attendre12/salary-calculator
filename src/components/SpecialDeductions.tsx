import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Gift, ChevronDown, Baby, BookOpen, Home, Users, Heart } from 'lucide-react';
import type { SpecialDeductions as SpecialDeductionsType } from '../types';

interface SpecialDeductionsProps {
  deductions: SpecialDeductionsType;
  onUpdate: (key: keyof SpecialDeductionsType, value: number) => void;
}

export function SpecialDeductionsPanel({ deductions, onUpdate }: SpecialDeductionsProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const deductionItems = [
    {
      key: 'childrenEducation' as const,
      label: '子女教育',
      description: '每个子女每月扣除',
      icon: Baby,
      color: 'from-pink-500/20 to-rose-500/20',
      iconColor: 'text-pink-400',
      hasCount: true,
      countKey: 'childrenCount' as const,
      maxAmount: 2000,
      step: 1000
    },
    {
      key: 'continuingEducation' as const,
      label: '继续教育',
      description: '学历/职业资格',
      icon: BookOpen,
      color: 'from-blue-500/20 to-indigo-500/20',
      iconColor: 'text-blue-400',
      options: [
        { label: '无', value: 0 },
        { label: '学历教育 400元/月', value: 400 },
        { label: '职业资格 3600元/年', value: 300 }
      ]
    },
    {
      key: 'housingLoan' as const,
      label: '住房贷款利息',
      description: '首套房贷款',
      icon: Home,
      color: 'from-green-500/20 to-emerald-500/20',
      iconColor: 'text-green-400',
      options: [
        { label: '无', value: 0 },
        { label: '1000元/月', value: 1000 }
      ]
    },
    {
      key: 'housingRent' as const,
      label: '住房租金',
      description: '按城市等级',
      icon: Home,
      color: 'from-yellow-500/20 to-orange-500/20',
      iconColor: 'text-yellow-400',
      options: [
        { label: '无', value: 0 },
        { label: '1500元/月', value: 1500 },
        { label: '1100元/月', value: 1100 },
        { label: '800元/月', value: 800 }
      ]
    },
    {
      key: 'elderlyCare' as const,
      label: '赡养老人',
      description: '60岁以上父母',
      icon: Users,
      color: 'from-purple-500/20 to-violet-500/20',
      iconColor: 'text-purple-400',
      options: [
        { label: '无', value: 0 },
        { label: '独生子女 2000元/月', value: 2000 },
        { label: '非独生子女 1000元/月', value: 1000 }
      ]
    },
    {
      key: 'infantCare' as const,
      label: '婴幼儿照护',
      description: '3岁以下婴幼儿',
      icon: Heart,
      color: 'from-cyan-500/20 to-teal-500/20',
      iconColor: 'text-cyan-400',
      hasCount: true,
      countKey: 'infantCount' as const,
      maxAmount: 2000,
      step: 1000
    }
  ];

  const totalDeduction = 
    deductions.childrenEducation * deductions.childrenCount +
    deductions.continuingEducation +
    Math.max(deductions.housingLoan, deductions.housingRent) +
    deductions.elderlyCare +
    deductions.infantCare * deductions.infantCount;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="glass-card p-5 mb-4"
    >
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
              {totalDeduction > 0 ? `每月扣除 ¥${totalDeduction}` : '点击配置专项扣除'}
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
              {deductionItems.map((item) => (
                <div key={item.key} className="bg-white/5 rounded-xl p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${item.color} flex items-center justify-center`}>
                      <item.icon className={`w-4 h-4 ${item.iconColor}`} />
                    </div>
                    <div>
                      <span className="text-white font-medium">{item.label}</span>
                      <p className="text-white/40 text-xs">{item.description}</p>
                    </div>
                  </div>

                  {item.hasCount ? (
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            const countKey = item.countKey!;
                            const currentCount = deductions[countKey] || 0;
                            if (currentCount > 0) {
                              onUpdate(countKey, currentCount - 1);
                            }
                          }}
                          className="w-8 h-8 rounded-lg bg-white/10 text-white/60 hover:bg-white/20 flex items-center justify-center"
                        >
                          -
                        </button>
                        <span className="text-white w-8 text-center">
                          {deductions[item.countKey!] || 0}
                        </span>
                        <button
                          onClick={() => {
                            const countKey = item.countKey!;
                            const currentCount = deductions[countKey] || 0;
                            onUpdate(countKey, currentCount + 1);
                          }}
                          className="w-8 h-8 rounded-lg bg-white/10 text-white/60 hover:bg-white/20 flex items-center justify-center"
                        >
                          +
                        </button>
                      </div>
                      <span className="text-white/50 text-sm">个</span>
                      {deductions[item.countKey!] > 0 && (
                        <span className="text-cyan-400 text-sm ml-auto">
                          ¥{(deductions[item.key] || 0) * (deductions[item.countKey!] || 0)}/月
                        </span>
                      )}
                    </div>
                  ) : (
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
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
