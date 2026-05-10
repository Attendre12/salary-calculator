import { useState, useRef, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, ChevronDown, Search, AlertCircle } from 'lucide-react';
import type { InsuranceConfig as InsuranceConfigType } from '../types';
import { CITY_PRESETS } from '../utils/constants';

interface InsuranceConfigProps {
  base: number;
  onBaseChange: (value: number) => void;
  config: InsuranceConfigType;
  onConfigChange: (key: keyof InsuranceConfigType, value: number) => void;
  city: string;
  onCityChange: (city: string) => void;
  cityLimits?: { min: number; max: number };
}

const INSURANCE_ITEMS = [
  { key: 'pension' as const, label: '养老保险', color: 'from-blue-500/20 to-cyan-500/20', iconColor: 'text-blue-400', accentColor: '#00D4FF' },
  { key: 'medical' as const, label: '医疗保险', color: 'from-green-500/20 to-emerald-500/20', iconColor: 'text-green-400', accentColor: '#7B61FF' },
  { key: 'unemployment' as const, label: '失业保险', color: 'from-yellow-500/20 to-orange-500/20', iconColor: 'text-yellow-400', accentColor: '#FF006E' },
  { key: 'housingFund' as const, label: '住房公积金', color: 'from-purple-500/20 to-pink-500/20', iconColor: 'text-purple-400', accentColor: '#FFB800' },
] as const;

export function InsuranceConfigPanel({
  base,
  onBaseChange,
  config,
  onConfigChange,
  city,
  onCityChange,
}: InsuranceConfigProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const selectedPreset = useMemo(
    () => CITY_PRESETS.find((c) => c.name === city),
    [city],
  );

  const filteredCities = useMemo(() => {
    if (!searchQuery.trim()) return CITY_PRESETS;
    return CITY_PRESETS.filter((c) => c.name.includes(searchQuery.trim()));
  }, [searchQuery]);

  // 点击外部关闭下拉
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleCitySelect = (cityName: string) => {
    onCityChange(cityName);
    const preset = CITY_PRESETS.find((c) => c.name === cityName);
    if (preset) {
      onConfigChange('pension', preset.insuranceConfig.pension);
      onConfigChange('medical', preset.insuranceConfig.medical);
      onConfigChange('unemployment', preset.insuranceConfig.unemployment);
      onConfigChange('housingFund', preset.insuranceConfig.housingFund);
      // 自动设置缴纳基数（取基数中值或当前工资）
      const midBase = Math.round((preset.minInsuranceBase + preset.maxInsuranceBase) / 2);
      onBaseChange(midBase);
    }
    setIsDropdownOpen(false);
    setSearchQuery('');
  };

  const handleDefaultSelect = () => {
    onCityChange('default');
    setIsDropdownOpen(false);
    setSearchQuery('');
  };

  // 百分比转换：显示值 = 内部值 * 100
  const toDisplayPercent = (val: number): string => {
    const pct = val * 100;
    // 如果是整数则不显示小数，否则显示合理位数
    return Number.isInteger(pct) ? String(pct) : pct.toFixed(pct < 1 ? 3 : 1);
  };

  const fromDisplayPercent = (display: string): number => {
    const parsed = parseFloat(display);
    if (isNaN(parsed)) return 0;
    return Math.max(0, Math.min(parsed / 100, 1));
  };

  // 计算实际缴纳金额
  const calcAmount = (key: keyof InsuranceConfigType): number => {
    return base * config[key];
  };

  const totalInsurance = INSURANCE_ITEMS.reduce(
    (sum, item) => sum + calcAmount(item.key),
    0,
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="glass-card p-5 mb-4"
    >
      {/* 标题栏 */}
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
            <p className="text-white/50 text-sm">
              {totalInsurance > 0
                ? `每月缴纳 ¥${totalInsurance.toFixed(2)}`
                : '个人缴纳比例配置'}
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
              {/* 搜索式城市选择 */}
              <div ref={dropdownRef} className="relative">
                <label className="text-white/70 text-sm mb-2 block">
                  选择城市（应用预设比例与基数范围）
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                  <input
                    ref={searchInputRef}
                    type="text"
                    placeholder="搜索城市..."
                    value={isDropdownOpen ? searchQuery : city === 'default' ? '默认（全国通用）' : city}
                    onFocus={() => {
                      setIsDropdownOpen(true);
                      setSearchQuery('');
                    }}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="input-glow w-full h-11 pl-10 pr-4 text-sm"
                  />
                </div>

                <AnimatePresence>
                  {isDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -4 }}
                      transition={{ duration: 0.15 }}
                      className="absolute z-50 mt-1 w-full max-h-56 overflow-y-auto rounded-xl border border-white/10 bg-gray-900/95 backdrop-blur-xl shadow-2xl"
                    >
                      {/* 默认选项 */}
                      <button
                        onClick={handleDefaultSelect}
                        className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${
                          city === 'default'
                            ? 'bg-cyan-500/20 text-cyan-300'
                            : 'text-white/70 hover:bg-white/5'
                        }`}
                      >
                        默认（全国通用）
                      </button>
                      <div className="glow-line mx-2" />
                      {filteredCities.map((preset) => (
                        <button
                          key={preset.name}
                          onClick={() => handleCitySelect(preset.name)}
                          className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${
                            city === preset.name
                              ? 'bg-cyan-500/20 text-cyan-300'
                              : 'text-white/70 hover:bg-white/5'
                          }`}
                        >
                          <span className="font-medium">{preset.name}</span>
                          <span className="text-white/30 ml-2 text-xs">
                            基数 {preset.minInsuranceBase.toLocaleString()} ~ {preset.maxInsuranceBase.toLocaleString()}
                          </span>
                        </button>
                      ))}
                      {filteredCities.length === 0 && (
                        <div className="px-4 py-3 text-white/40 text-sm text-center">
                          未找到匹配城市
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* 缴纳基数 */}
              <div>
                <label className="text-white/70 text-sm mb-2 block">缴纳基数</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50">
                    ¥
                  </span>
                  <input
                    type="number"
                    value={base}
                    onChange={(e) => onBaseChange(Number(e.target.value))}
                    className="input-glow w-full h-12 pl-10 pr-4"
                  />
                </div>
                {selectedPreset && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-2 flex items-center gap-2 text-xs"
                  >
                    <AlertCircle className="w-3.5 h-3.5 text-amber-400/70 flex-shrink-0" />
                    <span className="text-white/40">
                      {selectedPreset.name}允许范围：
                      <span className="neon-text text-amber-300/80">
                        ¥{selectedPreset.minInsuranceBase.toLocaleString()}
                      </span>
                      {' ~ '}
                      <span className="neon-text text-amber-300/80">
                        ¥{selectedPreset.maxInsuranceBase.toLocaleString()}
                      </span>
                      {base < selectedPreset.minInsuranceBase && (
                        <span className="text-red-400/80 ml-1">（当前低于下限）</span>
                      )}
                      {base > selectedPreset.maxInsuranceBase && (
                        <span className="text-red-400/80 ml-1">（当前超出上限）</span>
                      )}
                    </span>
                  </motion.div>
                )}
              </div>

              <div className="glow-line" />

              {/* 各项保险 */}
              <div className="space-y-3">
                {INSURANCE_ITEMS.map((item, index) => {
                  const amount = calcAmount(item.key);
                  return (
                    <motion.div
                      key={item.key}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="data-card rounded-xl p-4"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-9 h-9 rounded-lg bg-gradient-to-br ${item.color} flex items-center justify-center`}
                          >
                            <span
                              className={`text-xs font-bold ${item.iconColor}`}
                            >
                              {item.label.charAt(0)}
                            </span>
                          </div>
                          <div>
                            <span className="text-white/90 text-sm font-medium">
                              {item.label}
                            </span>
                            {item.key === 'housingFund' && selectedPreset && (
                              <p className="text-white/30 text-xs">
                                允许范围 {selectedPreset.housingFundRange.min * 100}% ~ {selectedPreset.housingFundRange.max * 100}%
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="text-right">
                            {amount > 0 && (
                              <span
                                className="neon-text text-sm font-semibold block"
                                style={{ color: item.accentColor }}
                              >
                                ¥{amount.toFixed(2)}
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-1">
                            <input
                              type="number"
                              step="0.1"
                              min="0"
                              max="100"
                              value={toDisplayPercent(config[item.key])}
                              onChange={(e) =>
                                onConfigChange(
                                  item.key,
                                  fromDisplayPercent(e.target.value),
                                )
                              }
                              className="input-glow w-20 h-9 text-center text-sm"
                            />
                            <span className="text-white/50 text-sm">%</span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              {/* 合计 */}
              <div className="glow-line" />
              <div className="flex items-center justify-between px-2">
                <span className="text-white/60 text-sm">五险一金合计</span>
                <span className="neon-text text-lg font-bold" style={{ color: '#00D4FF' }}>
                  ¥{totalInsurance.toFixed(2)} / 月
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
