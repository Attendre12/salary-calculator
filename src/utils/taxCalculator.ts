import type {
  CalculationInput,
  CalculationResult,
  InsuranceDetail,
  IncomeBreakdown
} from '../types';
import { TAX_BRACKETS, TAX_THRESHOLD, CHART_COLORS } from './constants';

/**
 * 校验数值输入是否合法（非负有限数）
 */
function validateNonNegative(value: number, fieldName: string): void {
  if (!Number.isFinite(value) || value < 0) {
    throw new Error(`${fieldName} 必须为非负数，当前值: ${value}`);
  }
}

/**
 * 校验比例输入是否合法（0~1之间）
 */
function validateRate(value: number, fieldName: string): void {
  if (!Number.isFinite(value) || value < 0 || value > 1) {
    throw new Error(`${fieldName} 必须在 0~1 之间，当前值: ${value}`);
  }
}

/**
 * 将缴纳基数限制在城市的上下限范围内
 */
function clampInsuranceBase(
  base: number,
  minBase: number,
  maxBase: number
): number {
  return Math.max(minBase, Math.min(maxBase, base));
}

/**
 * 计算五险一金
 * @param base - 缴纳基数（原始值）
 * @param config - 五险一金比例配置
 * @param minBase - 最低缴纳基数（可选）
 * @param maxBase - 最高缴纳基数（可选）
 */
export function calculateInsurance(
  base: number,
  config: CalculationInput['insuranceConfig'],
  minBase?: number,
  maxBase?: number
): InsuranceDetail {
  validateNonNegative(base, '缴纳基数');

  // 如果提供了基数上下限，则对基数进行钳位
  const effectiveBase = (minBase !== undefined && maxBase !== undefined)
    ? clampInsuranceBase(base, minBase, maxBase)
    : base;

  const pension = Math.round(effectiveBase * config.pension);
  const medical = Math.round(effectiveBase * config.medical);
  const unemployment = Math.round(effectiveBase * config.unemployment);
  const housingFund = Math.round(effectiveBase * config.housingFund);

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
  let applicableRate = 0;
  let bracketIndex = 0;

  for (let i = 0; i < TAX_BRACKETS.length; i++) {
    const bracket = TAX_BRACKETS[i];

    if (taxableIncome <= bracket.limit) {
      // 在当前档位，直接使用速算公式
      applicableRate = bracket.rate;
      bracketIndex = i + 1;
      break;
    }
  }

  // 使用速算扣除数法计算个税
  // 公式：应纳税额 = 应纳税所得额 x 税率 - 速算扣除数
  const targetBracket = TAX_BRACKETS[bracketIndex - 1];
  const tax = taxableIncome * targetBracket.rate - targetBracket.deduction;

  return {
    tax: Math.max(0, Math.round(tax)),
    rate: applicableRate,
    bracket: bracketIndex
  };
}

/**
 * 完整工资计算
 */
export function calculateSalary(
  input: CalculationInput,
  minBase?: number,
  maxBase?: number
): CalculationResult {
  const { grossSalary, insuranceBase, insuranceConfig, specialDeductions } = input;

  // 输入值边界校验
  validateNonNegative(grossSalary, '税前工资');
  validateNonNegative(insuranceBase, '缴纳基数');

  // 校验五险一金比例
  validateRate(insuranceConfig.pension, '养老保险比例');
  validateRate(insuranceConfig.medical, '医疗保险比例');
  validateRate(insuranceConfig.unemployment, '失业保险比例');
  validateRate(insuranceConfig.housingFund, '住房公积金比例');

  // 1. 计算五险一金
  const insuranceDetail = calculateInsurance(insuranceBase, insuranceConfig, minBase, maxBase);

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
      color: CHART_COLORS.netSalary,
      percentage: Math.round((netSalary / grossSalary) * 100)
    },
    {
      name: '个人所得税',
      value: taxAmount,
      color: CHART_COLORS.tax,
      percentage: Math.round((taxAmount / grossSalary) * 100)
    },
    {
      name: '五险一金',
      value: insuranceTotal,
      color: CHART_COLORS.insurance,
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
