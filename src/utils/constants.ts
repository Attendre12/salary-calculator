import type { TaxBracket, CityPreset, InsuranceConfig } from '../types';

// 2024年个人所得税税率表（月度）
export const TAX_BRACKETS: TaxBracket[] = [
  { limit: 3000, rate: 0.03, deduction: 0 },
  { limit: 12000, rate: 0.10, deduction: 210 },
  { limit: 25000, rate: 0.20, deduction: 1410 },
  { limit: 35000, rate: 0.25, deduction: 2660 },
  { limit: 55000, rate: 0.30, deduction: 4410 },
  { limit: 80000, rate: 0.35, deduction: 7160 },
  { limit: Infinity, rate: 0.45, deduction: 15160 }
];

// 个税起征点
export const TAX_THRESHOLD = 5000;

// 专项附加扣除标准（2024年）
export const DEDUCTION_STANDARDS = {
  childrenEducation: { min: 1000, max: 2000, perChild: true },  // 子女教育
  continuingEducation: { academic: 400, vocational: 3600 },      // 继续教育
  housingLoan: 1000,                                             // 住房贷款
  housingRent: { tier1: 1500, tier2: 1100, tier3: 800 },         // 住房租金
  elderlyCare: { onlyChild: 2000, nonOnlyChild: 1000 },          // 赡养老人
  infantCare: { min: 1000, max: 2000, perChild: true }           // 婴幼儿照护
};

// 默认五险一金配置（全国通用参考值）
export const DEFAULT_INSURANCE_CONFIG: InsuranceConfig = {
  pension: 0.08,        // 养老保险 8%
  medical: 0.02,        // 医疗保险 2%
  unemployment: 0.005,  // 失业保险 0.5%
  housingFund: 0.12     // 住房公积金 12%
};

// 主要城市预设
export const CITY_PRESETS: CityPreset[] = [
  {
    name: '北京',
    insuranceConfig: {
      pension: 0.08,
      medical: 0.02,
      unemployment: 0.005,
      housingFund: 0.12
    },
    maxInsuranceBase: 31884,
    minInsuranceBase: 6326
  },
  {
    name: '上海',
    insuranceConfig: {
      pension: 0.08,
      medical: 0.02,
      unemployment: 0.005,
      housingFund: 0.07
    },
    maxInsuranceBase: 31014,
    minInsuranceBase: 5975
  },
  {
    name: '广州',
    insuranceConfig: {
      pension: 0.08,
      medical: 0.02,
      unemployment: 0.002,
      housingFund: 0.12
    },
    maxInsuranceBase: 26421,
    minInsuranceBase: 5284
  },
  {
    name: '深圳',
    insuranceConfig: {
      pension: 0.08,
      medical: 0.02,
      unemployment: 0.005,
      housingFund: 0.12
    },
    maxInsuranceBase: 26421,
    minInsuranceBase: 2360
  },
  {
    name: '杭州',
    insuranceConfig: {
      pension: 0.08,
      medical: 0.02,
      unemployment: 0.005,
      housingFund: 0.12
    },
    maxInsuranceBase: 22311,
    minInsuranceBase: 4462
  },
  {
    name: '成都',
    insuranceConfig: {
      pension: 0.08,
      medical: 0.02,
      unemployment: 0.004,
      housingFund: 0.12
    },
    maxInsuranceBase: 18630,
    minInsuranceBase: 3726
  }
];

// 快捷工资档位
export const QUICK_SALARY_OPTIONS = [
  { label: '5K', value: 5000 },
  { label: '8K', value: 8000 },
  { label: '10K', value: 10000 },
  { label: '15K', value: 15000 },
  { label: '20K', value: 20000 },
  { label: '30K', value: 30000 },
  { label: '50K', value: 50000 }
];

// 图表颜色配置
export const CHART_COLORS = {
  netSalary: '#00D4FF',      // 税后工资 - 科技青
  tax: '#FF006E',            // 个税 - 霓虹粉
  insurance: '#7B61FF',      // 五险一金 - 电光紫
  pension: '#00D4FF',
  medical: '#7B61FF',
  unemployment: '#FF006E',
  housingFund: '#FFB800'
};
