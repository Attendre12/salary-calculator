import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, ChevronDown } from 'lucide-react';
import type { InsuranceConfig as InsuranceConfigType } from '../types';
import { CITY_PRESETS } from '../utils/constants';

interface InsuranceConfigProps {
  base: number;
  onBaseChange: (value: number) => void;
  config: InsuranceConfigType;
  onConfigChange: (key: keyof InsuranceConfigType, value: number) => void;
  city: string;
  onCityChange: (city: string) => void;
}

export function InsuranceConfigPanel({
  base,
  onBaseChange,
  config,
  onConfigChange,
  city,
  onCityChange
}: InsuranceConfigProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleCitySelect = (cityName: string) => {
    onCityChange(cityName);
    const preset = CITY_PRESETS.find(c => c.name === cityName);
    if (preset) {
      onConfigChange('pension', preset.insuranceConfig.pension);
      onConfigChange('medical', preset.insuranceConfig.medical);
      onConfigChange('unemployment', preset.insuranceConfig.unemployment);
      onConfigChange('housingFund', preset.insuranceConfig.housingFund);
    }
  };

  const insuranceItems = [
    { key: 'pension' as const, label: '养老保险', color: 'from-blue-500/20 to-cyan-500/20', iconColor: 'text-blue-400' },
    { key: 'medical' as const, label: '医疗保险', color: 'from-green-500/20 to-emerald-500/20', iconColor: 'text-green-400' },
    { key: 'unemployment' as const, label: '失业保险', color: 'from-yellow-500/20 to-orange-500/20', iconColor: 'text-yellow-400' },
    { key: 'housingFund' as const, label: '住房公积金', color: 'from-purple-500/20 to-pink-500/20', iconColor: 'text-purple-400' }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="glass-card p-5 mb-4"
    >
      <div 
        className="flex items-center justify-between cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center">
            <Shield className="w-5 h-5 text-purple-400" />
          </div>
          <div>
            <h3 className="text-white font-semibold">五险一金</h3>
            <p className="text-white/50 text-sm">个人缴纳比例配置</p>
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
              {/* 城市选择 */}
              <div>
                <label className="text-white/70 text-sm mb-2 block">选择城市（应用预设比例）</label>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => onCityChange('default')}
                    className={`px-3 py-1.5 rounded-lg text-sm transition-all ${
                      city === 'default'
                        ? 'bg-cyan-500/30 text-cyan-300 border border-cyan-500/50'
                        : 'bg-white/5 text-white/60 border border-white/10 hover:bg-white/10'
                    }`}
                  >
                    默认
                  </button>
                  {CITY_PRESETS.map((preset) => (
                    <button
                      key={preset.name}
                      onClick={() => handleCitySelect(preset.name)}
                      className={`px-3 py-1.5 rounded-lg text-sm transition-all ${
                        city === preset.name
                          ? 'bg-cyan-500/30 text-cyan-300 border border-cyan-500/50'
                          : 'bg-white/5 text-white/60 border border-white/10 hover:bg-white/10'
                      }`}
                    >
                      {preset.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* 缴纳基数 */}
              <div>
                <label className="text-white/70 text-sm mb-2 block">缴纳基数</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50">¥</span>
                  <input
                    type="number"
                    value={base}
                    onChange={(e) => onBaseChange(Number(e.target.value))}
                    className="input-glow w-full h-12 pl-10 pr-4"
                  />
                </div>
              </div>

              {/* 各项保险比例 */}
              <div className="space-y-3">
                {insuranceItems.map((item) => (
                  <div key={item.key} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${item.color} flex items-center justify-center`}>
                        <span className={`text-xs font-bold ${item.iconColor}`}>
                          {item.label.charAt(0)}
                        </span>
                      </div>
                      <span className="text-white/80 text-sm">{item.label}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        step="0.001"
                        min="0"
                        max="1"
                        value={config[item.key]}
                        onChange={(e) => onConfigChange(item.key, Number(e.target.value))}
                        className="input-glow w-20 h-9 text-center text-sm"
                      />
                      <span className="text-white/50 text-sm w-8">%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
