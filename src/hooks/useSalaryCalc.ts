import { useState, useMemo, useCallback } from 'react';
import type { 
  CalculationInput, 
  CalculationResult, 
  InsuranceConfig, 
  SpecialDeductions 
} from '../types';
import { calculateSalary, calculateIncomeBreakdown } from '../utils/taxCalculator';
import { DEFAULT_INSURANCE_CONFIG } from '../utils/constants';

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

export function useSalaryCalc() {
  // 输入状态
  const [grossSalary, setGrossSalary] = useState<number>(15000);
  const [insuranceBase, setInsuranceBase] = useState<number>(15000);
  const [insuranceConfig, setInsuranceConfig] = useState<InsuranceConfig>(DEFAULT_INSURANCE_CONFIG);
  const [specialDeductions, setSpecialDeductions] = useState<SpecialDeductions>(DEFAULT_DEDUCTIONS);
  const [city, setCity] = useState<string>('default');

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
    return calculateSalary(calcInput);
  }, [calcInput]);

  // 收入构成数据
  const incomeBreakdown = useMemo(() => {
    return calculateIncomeBreakdown(result);
  }, [result]);

  // 更新工资并同步更新缴纳基数
  const updateGrossSalary = useCallback((value: number) => {
    setGrossSalary(value);
    // 如果缴纳基数等于原工资，则同步更新
    if (insuranceBase === grossSalary) {
      setInsuranceBase(value);
    }
  }, [grossSalary, insuranceBase]);

  // 更新五险一金配置
  const updateInsuranceConfig = useCallback((key: keyof InsuranceConfig, value: number) => {
    setInsuranceConfig(prev => ({
      ...prev,
      [key]: value
    }));
  }, []);

  // 更新专项附加扣除
  const updateSpecialDeduction = useCallback((key: keyof SpecialDeductions, value: number) => {
    setSpecialDeductions(prev => ({
      ...prev,
      [key]: value
    }));
  }, []);

  // 重置所有设置
  const resetAll = useCallback(() => {
    setGrossSalary(15000);
    setInsuranceBase(15000);
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
