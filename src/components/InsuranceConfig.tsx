import { useState, useRef, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Search } from 'lucide-react';
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
  { key: 'pension' as const, label: '养老', color: '#00D4FF' },
  { key: 'medical' as const, label: '医疗', color: '#7B61FF' },
  { key: 'unemployment' as const, label: '失业', color: '#FF006E' },
  { key: 'housingFund' as const, label: '公积金', color: '#FFB800' },
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

  const selectedPreset = useMemo(
    () => CITY_PRESETS.find((c) => c.name === city),
    [city],
  );

  const filteredCities = useMemo(() => {
    if (!searchQuery.trim()) return CITY_PRESETS;
    return CITY_PRESETS.filter((c) => c.name.includes(searchQuery.trim()));
  }, [searchQuery]);

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
      const midBase = Math.round(
        (preset.minInsuranceBase + preset.maxInsuranceBase) / 2,
      );
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

  const toDisplayPercent = (val: number): string => {
    const pct = val * 100;
    return Number.isInteger(pct) ? String(pct) : pct.toFixed(pct < 1 ? 3 : 1);
  };

  const fromDisplayPercent = (display: string): number => {
    const parsed = parseFloat(display);
    if (isNaN(parsed)) return 0;
    return Math.max(0, Math.min(parsed / 100, 1));
  };

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
      transition={{ duration: 0.5 }}
      className="glass-card mb-3 overflow-hidden"
    >
      {/* 折叠标题栏 - 显示总额 */}
      <div
        className="flex items-center justify-between cursor-pointer px-4 py-3"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-2.5">
          <span className="text-white/70 text-sm">五险一金</span>
          {totalInsurance > 0 && (
            <span className="text-cyan-400/80 text-sm font-digital font-medium">
              &yen;{totalInsurance.toFixed(0)}
            </span>
          )}
        </div>
        <motion.div
          animate={{ rotate: isExpanded ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown className="w-4 h-4 text-white/40" />
        </motion.div>
      </div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 space-y-3">
              {/* 城市选择 */}
              <div ref={dropdownRef} className="relative">
                <div className="relative">
                  <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/30" />
                  <input
                    type="text"
                    placeholder="搜索城市..."
                    value={
                      isDropdownOpen
                        ? searchQuery
                        : city === 'default'
                          ? '默认（全国通用）'
                          : city
                    }
                    onFocus={() => {
                      setIsDropdownOpen(true);
                      setSearchQuery('');
                    }}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="input-glow w-full h-9 pl-8 pr-3 text-xs"
                  />
                </div>

                <AnimatePresence>
                  {isDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -4 }}
                      transition={{ duration: 0.15 }}
                      className="absolute z-50 mt-1 w-full max-h-48 overflow-y-auto rounded-lg border border-white/10 bg-gray-900/95 backdrop-blur-xl shadow-2xl"
                    >
                      <button
                        onClick={handleDefaultSelect}
                        className={`w-full text-left px-3 py-2 text-xs transition-colors ${
                          city === 'default'
                            ? 'bg-cyan-500/20 text-cyan-300'
                            : 'text-white/60 hover:bg-white/5'
                        }`}
                      >
                        默认（全国通用）
                      </button>
                      {filteredCities.map((preset) => (
                        <button
                          key={preset.name}
                          onClick={() => handleCitySelect(preset.name)}
                          className={`w-full text-left px-3 py-2 text-xs transition-colors ${
                            city === preset.name
                              ? 'bg-cyan-500/20 text-cyan-300'
                              : 'text-white/60 hover:bg-white/5'
                          }`}
                        >
                          <span className="font-medium">{preset.name}</span>
                          <span className="text-white/25 ml-1.5 text-[10px]">
                            {preset.minInsuranceBase.toLocaleString()} ~ {preset.maxInsuranceBase.toLocaleString()}
                          </span>
                        </button>
                      ))}
                      {filteredCities.length === 0 && (
                        <div className="px-3 py-2 text-white/30 text-xs text-center">
                          未找到匹配城市
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* 缴纳基数 */}
              <div className="flex items-center gap-2">
                <span className="text-white/50 text-xs shrink-0">基数</span>
                <div className="relative flex-1">
                  <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-white/30 text-xs">
                    &yen;
                  </span>
                  <input
                    type="number"
                    value={base}
                    onChange={(e) => onBaseChange(Number(e.target.value))}
                    className="input-glow w-full h-8 pl-7 pr-3 text-xs font-digital"
                  />
                </div>
                {selectedPreset && (
                  <span className="text-white/20 text-[10px] shrink-0">
                    {selectedPreset.minInsuranceBase.toLocaleString()}~{selectedPreset.maxInsuranceBase.toLocaleString()}
                  </span>
                )}
              </div>

              {/* 各项保险 - 一行一个：名称 | 比例 | 金额 */}
              <div className="space-y-1.5">
                {INSURANCE_ITEMS.map((item) => {
                  const amount = calcAmount(item.key);
                  return (
                    <div
                      key={item.key}
                      className="flex items-center gap-2 h-8"
                    >
                      <span
                        className="text-xs w-8 shrink-0"
                        style={{ color: `${item.color}99` }}
                      >
                        {item.label}
                      </span>
                      <div className="flex items-center gap-1 flex-1 justify-end">
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
                          className="input-glow w-14 h-7 text-center text-xs font-digital"
                        />
                        <span className="text-white/30 text-[10px]">%</span>
                      </div>
                      <span
                        className="text-xs font-digital font-medium w-16 text-right shrink-0"
                        style={{ color: `${item.color}cc` }}
                      >
                        {amount > 0 ? `¥${amount.toFixed(0)}` : '-'}
                      </span>
                    </div>
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
