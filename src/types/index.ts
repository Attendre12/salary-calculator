// 个税税率档位
export interface TaxBracket {
  limit: number;
  rate: number;
  deduction: number;
}

// 五险一金配置
export interface InsuranceConfig {
  pension: number;      // 养老保险 个人比例
  medical: number;      // 医疗保险 个人比例
  unemployment: number; // 失业保险 个人比例
  housingFund: number;  // 住房公积金 个人比例
}

// 专项附加扣除
export interface SpecialDeductions {
  childrenEducation: number;  // 子女教育 每个子女每月金额
  childrenCount: number;      // 子女数量
  continuingEducation: number; // 继续教育
  housingLoan: number;        // 住房贷款利息
  housingRent: number;        // 住房租金
  elderlyCare: number;        // 赡养老人
  infantCare: number;         // 3岁以下婴幼儿照护
  infantCount: number;        // 婴幼儿数量
}

// 计算输入参数
export interface CalculationInput {
  grossSalary: number;        // 税前工资
  bonus: number;              // 年终奖
  insuranceBase: number;      // 五险一金缴纳基数
  insuranceConfig: InsuranceConfig;
  specialDeductions: SpecialDeductions;
  city: string;               // 城市（用于预设比例）
}

// 五险一金明细
export interface InsuranceDetail {
  pension: number;            // 养老保险
  medical: number;            // 医疗保险
  unemployment: number;       // 失业保险
  housingFund: number;        // 住房公积金
  total: number;              // 合计
}

// 计算结果
export interface CalculationResult {
  grossSalary: number;        // 税前工资
  insuranceTotal: number;     // 五险一金总额
  insuranceDetail: InsuranceDetail;
  specialDeductionTotal: number; // 专项附加扣除总额
  taxableIncome: number;      // 应纳税所得额
  taxAmount: number;          // 个人所得税
  netSalary: number;          // 税后到手工资
  taxRate: number;            // 适用税率
  taxBracket: number;         // 税率档位
}

// 收入构成项（用于图表）
export interface IncomeBreakdown {
  name: string;
  value: number;
  color: string;
  percentage: number;
}

// 城市预设配置
export interface CityPreset {
  name: string;
  insuranceConfig: InsuranceConfig;
  maxInsuranceBase: number;
  minInsuranceBase: number;
}
