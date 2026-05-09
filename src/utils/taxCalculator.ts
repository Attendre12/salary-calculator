import type { 
  CalculationInput, 
  CalculationResult, 
  InsuranceDetail, 
  IncomeBreakdown 
} from '../types';
import { TAX_BRACKETS, TAX_THRESHOLD } from './constants';

/**
 * 计算五险一金
 */
export function calculateInsurance(
  base: number,
  config: CalculationInput['insuranceConfig']
): InsuranceDetail {
  const pension = Math.round(base * config.pension);
  const medical = Math.round(base * config.medical);
  const unemployment = Math.round(base * config.unemployment);
  const housingFund = Math.round(base * config.housingFund);
  
  return {
    pension,
    medical,
    unemployment,
    housingFund,
    total: pension + medical + unemployment + housingFund
  };
}

/**
 * 计算专项附加扣除总额
 */
export function calculateSpecialDeductions(
  deductions: CalculationInput['specialDeductions']
): number {
  const {
    childrenEducation,
    childrenCount,
    continuingEducation,
    housingLoan,
    housingRent,
    elderlyCare,
    infantCare,
    infantCount
  } = deductions;

  // 子女教育扣除
  const childrenDeduction = childrenEducation * childrenCount;
  
  // 婴幼儿照护扣除
  const infantDeduction = infantCare * infantCount;
  
  // 住房租金和房贷利息只能选其一
  const housingDeduction = Math.max(housingLoan, housingRent);
  
  return childrenDeduction + continuingEducation + housingDeduction + elderlyCare + infantDeduction;
}

/**
 * 计算个人所得税
 * 使用累计预扣法（简化版，按月计算）
 */
export function calculateIncomeTax(taxableIncome: number): { 
  tax: number; 
  rate: number; 
  bracket: number 
} {
  if (taxableIncome <= 0) {
    return { tax: 0, rate: 0, bracket: 0 };
  }

  // 找到适用税率档位
  let previousLimit = 0;
  let tax = 0;
  let applicableRate = 0;
  let bracketIndex = 0;

  for (let i = 0; i < TAX_BRACKETS.length; i++) {
    const bracket = TAX_BRACKETS[i];
    const bracketWidth = Math.min(taxableIncome, bracket.limit) - previousLimit;
    
    if (bracketWidth <= 0) break;
    
    if (taxableIncome <= bracket.limit) {
      // 在当前档位
      tax = taxableIncome * bracket.rate - bracket.deduction;
      applicableRate = bracket.rate;
      bracketIndex = i + 1;
      break;
    }
    
    previousLimit = bracket.limit;
  }

  // 如果超过最高档位
  if (taxableIncome > TAX_BRACKETS[TAX_BRACKETS.length - 2].limit) {
    const topBracket = TAX_BRACKETS[TAX_BRACKETS.length - 1];
    tax = taxableIncome * topBracket.rate - topBracket.deduction;
    applicableRate = topBracket.rate;
    bracketIndex = TAX_BRACKETS.length;
  }

  return { 
    tax: Math.max(0, Math.round(tax)), 
    rate: applicableRate, 
    bracket: bracketIndex 
  };
}

/**
 * 完整工资计算
 */
export function calculateSalary(input: CalculationInput): CalculationResult {
  const { grossSalary, insuranceBase, insuranceConfig, specialDeductions } = input;
  
  // 1. 计算五险一金
  const insuranceDetail = calculateInsurance(insuranceBase, insuranceConfig);
  
  // 2. 计算专项附加扣除
  const specialDeductionTotal = calculateSpecialDeductions(specialDeductions);
  
  // 3. 计算应纳税所得额
  const taxableIncome = Math.max(0, 
    grossSalary - insuranceDetail.total - specialDeductionTotal - TAX_THRESHOLD
  );
  
  // 4. 计算个税
  const { tax: taxAmount, rate: taxRate, bracket: taxBracket } = calculateIncomeTax(taxableIncome);
  
  // 5. 计算税后工资
  const netSalary = grossSalary - insuranceDetail.total - taxAmount;
  
  return {
    grossSalary,
    insuranceTotal: insuranceDetail.total,
    insuranceDetail,
    specialDeductionTotal,
    taxableIncome,
    taxAmount,
    netSalary,
    taxRate,
    taxBracket
  };
}

/**
 * 计算收入构成（用于图表）
 */
export function calculateIncomeBreakdown(result: CalculationResult): IncomeBreakdown[] {
  const { grossSalary, netSalary, taxAmount, insuranceTotal } = result;
  
  if (grossSalary === 0) {
    return [];
  }
  
  return [
    {
      name: '税后工资',
      value: netSalary,
      color: '#00D4FF',
      percentage: Math.round((netSalary / grossSalary) * 100)
    },
    {
      name: '个人所得税',
      value: taxAmount,
      color: '#FF006E',
      percentage: Math.round((taxAmount / grossSalary) * 100)
    },
    {
      name: '五险一金',
      value: insuranceTotal,
      color: '#7B61FF',
      percentage: Math.round((insuranceTotal / grossSalary) * 100)
    }
  ];
}

/**
 * 格式化金额（添加千分位）
 */
export function formatMoney(amount: number): string {
  return amount.toLocaleString('zh-CN', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  });
}

/**
 * 格式化百分比
 */
export function formatPercent(value: number): string {
  return (value * 100).toFixed(0) + '%';
}
