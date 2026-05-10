import { useState, useMemo, useCallback, useRef } from 'react';
import type { 
  CalculationInput, 
  CalculationResult, 
  InsuranceConfig, 
  SpecialDeductions 
} from '../types';
import { calculateSalary, calculateIncomeBreakdown } from '../utils/taxCalculator';
import { DEFAULT_INSURANCE_CONFIG, CITY_PRESETS } from '../utils/constants';

// 默认专项附加扣除
const DEFAULT_DEDUCTIONS: SpecialDeductions = {
  childrenEducation: 0,
  childrenCount: 0,
  continuingEducation: 0,
  housingLoan: 0,
  housingRent: 0,
  elderlyCare: 0,
  infantCare: 0,
  infantCount: 0
};

const DEFAULT_SALARY = 15000;

export function useSalaryCalc() {
  // 输入状态
  const [grossSalary, setGrossSalary] = useState<number>(DEFAULT_SALARY);
  const [insuranceBase, setInsuranceBase] = useState<number>(DEFAULT_SALARY);
  const [insuranceConfig, setInsuranceConfig] = useState<InsuranceConfig>(DEFAULT_INSURANCE_CONFIG);
  const [specialDeductions, setSpecialDeductions] = useState<SpecialDeductions>(DEFAULT_DEDUCTIONS);
  const [city, setCity] = useState<string>('default');

  // 使用ref追踪，避免useCallback依赖变化
  const insuranceBaseRef = useRef(insuranceBase);
  insuranceBaseRef.current = insuranceBase;
  const grossSalaryRef = useRef(grossSalary);
  grossSalaryRef.current = grossSalary;

  // 获取当前城市的基数限制
  const cityLimits = useMemo(() => {
    if (city === 'default') return { min: 0, max: Infinity };
    const preset = CITY_PRESETS.find(c => c.name === city);
    return preset 
      ? { min: preset.minInsuranceBase, max: preset.maxInsuranceBase }
      : { min: 0, max: Infinity };
  }, [city]);

  // 计算输入对象
  const calcInput: CalculationInput = useMemo(() => ({
    grossSalary,
    bonus: 0,
    insuranceBase,
    insuranceConfig,
    specialDeductions,
    city
  }), [grossSalary, insuranceBase, insuranceConfig, specialDeductions, city]);

  // 计算结果
  const result: CalculationResult = useMemo(() => {
    try {
      return calculateSalary(calcInput, cityLimits.min, cityLimits.max);
    } catch {
      // 输入不合法时返回零值结果
      return {
        grossSalary: 0,
        insuranceTotal: 0,
        insuranceDetail: { pension: 0, medical: 0, unemployment: 0, housingFund: 0, total: 0 },
        specialDeductionTotal: 0,
        taxableIncome: 0,
        taxAmount: 0,
        netSalary: 0,
        taxRate: 0,
        taxBracket: 0
      };
    }
  }, [calcInput, cityLimits]);

  // 收入构成数据
  const incomeBreakdown = useMemo(() => {
    return calculateIncomeBreakdown(result);
  }, [result]);

  // 更新工资并同步更新缴纳基数
  const updateGrossSalary = useCallback((value: number) => {
    const clamped = Math.max(0, Math.min(9999999, value));
    setGrossSalary(clamped);
    // 如果缴纳基数等于原工资，则同步更新
    if (insuranceBaseRef.current === grossSalaryRef.current) {
      setInsuranceBase(clamped);
    }
  }, []);

  // 更新五险一金配置
  const updateInsuranceConfig = useCallback((key: keyof InsuranceConfig, value: number) => {
    setInsuranceConfig(prev => ({
      ...prev,
      [key]: Math.max(0, Math.min(1, value))
    }));
  }, []);

  // 更新专项附加扣除
  const updateSpecialDeduction = useCallback((key: keyof SpecialDeductions, value: number) => {
    setSpecialDeductions(prev => ({
      ...prev,
      [key]: Math.max(0, value)
    }));
  }, []);

  // 重置所有设置
  const resetAll = useCallback(() => {
    setGrossSalary(DEFAULT_SALARY);
    setInsuranceBase(DEFAULT_SALARY);
    setInsuranceConfig(DEFAULT_INSURANCE_CONFIG);
    setSpecialDeductions(DEFAULT_DEDUCTIONS);
    setCity('default');
  }, []);

  return {
    // 输入状态
    grossSalary,
    insuranceBase,
    insuranceConfig,
    specialDeductions,
    city,
    cityLimits,
    
    // 更新方法
    setGrossSalary: updateGrossSalary,
    setInsuranceBase,
    updateInsuranceConfig,
    updateSpecialDeduction,
    setCity,
    resetAll,
    
    // 计算结果
    result,
    incomeBreakdown
  };
}
