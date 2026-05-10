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
  { key: 'pension' as const, label: '养老' },
  { key: 'medical' as const, label: '医疗' },
  { key: 'unemployment' as const, label: '失业' },
  { key: 'housingFund' as const, label: '公积金' },
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
    <div className="card overflow-hidden">
      {/* 折叠触发器 */}
      <div
        className="collapse-trigger"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-2">
          <span className="text-[var(--text-primary)] text-sm">五险一金</span>
          {totalInsurance > 0 && (
            <span className="text-accent font-mono text-sm font-medium">
              &yen;{totalInsurance.toFixed(0)}
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
            <div className="px-4 pt-4 pb-4 space-y-3">
              {/* 城市搜索 */}
              <div ref={dropdownRef} className="relative">
                <div className="relative">
                  <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[var(--text-tertiary)]" />
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
                    className="input w-full h-9 pl-8 pr-3 text-xs"
                  />
                </div>

                <AnimatePresence>
                  {isDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -4 }}
                      transition={{ duration: 0.15 }}
                      className="absolute z-50 mt-1 w-full max-h-48 overflow-y-auto card shadow-lg"
                    >
                      <button
                        onClick={handleDefaultSelect}
                        className={`w-full text-left px-3 py-2 text-xs transition-colors rounded-t-2xl ${
                          city === 'default'
                            ? 'text-accent bg-[var(--accent)]/5'
                            : 'text-[var(--text-secondary)] hover:bg-[var(--bg-elevated)]'
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
                              ? 'text-accent bg-[var(--accent)]/5'
                              : 'text-[var(--text-secondary)] hover:bg-[var(--bg-elevated)]'
                          }`}
                        >
                          <span className="font-medium">{preset.name}</span>
                          <span className="text-[var(--text-tertiary)] ml-1.5 text-[10px]">
                            {preset.minInsuranceBase.toLocaleString()} ~ {preset.maxInsuranceBase.toLocaleString()}
                          </span>
                        </button>
                      ))}
                      {filteredCities.length === 0 && (
                        <div className="px-3 py-2 text-[var(--text-tertiary)] text-xs text-center">
                          未找到匹配城市
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* 缴纳基数 */}
              <div className="flex items-center gap-2">
                <span className="text-[var(--text-secondary)] text-xs shrink-0">
                  缴纳基数
                </span>
                <div className="relative flex-1">
                  <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)] text-xs font-mono">
                    &yen;
                  </span>
                  <input
                    type="number"
                    value={base}
                    onChange={(e) => onBaseChange(Number(e.target.value))}
                    className="input w-full h-8 pl-7 pr-3 text-xs font-mono"
                  />
                </div>
                {selectedPreset && (
                  <span className="text-[var(--text-tertiary)] text-[12px] shrink-0 font-mono">
                    {selectedPreset.minInsuranceBase.toLocaleString()}~{selectedPreset.maxInsuranceBase.toLocaleString()}
                  </span>
                )}
              </div>

              {/* 四项保险列表 */}
              <div className="space-y-1.5">
                {INSURANCE_ITEMS.map((item) => {
                  const amount = calcAmount(item.key);
                  return (
                    <div
                      key={item.key}
                      className="flex items-center gap-2 h-8"
                    >
                      <span className="text-[var(--text-secondary)] text-sm w-12 shrink-0">
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
                          className="input w-[60px] h-7 text-center text-xs font-mono"
                        />
                        <span className="text-[var(--text-tertiary)] text-xs">
                          %
                        </span>
                      </div>
                      <span className="text-[var(--text-primary)] font-mono text-sm ml-auto w-16 text-right shrink-0">
                        {amount > 0 ? `¥${amount.toFixed(0)}` : '-'}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* 合计行 */}
              <div className="flex items-center justify-between pt-2 border-t border-[var(--border)]">
                <span className="text-[var(--text-secondary)] text-sm">
                  合计
                </span>
                <span className="text-accent font-mono text-sm font-semibold">
                  &yen;{totalInsurance.toFixed(0)}
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
