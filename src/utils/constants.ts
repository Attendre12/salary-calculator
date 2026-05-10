import type { TaxBracket, CityPreset, InsuranceConfig } from '../types';

// ============================================================
// 2024年个人所得税税率表（月度，累计预扣法）
// ============================================================
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

// ============================================================
// 专项附加扣除标准（2024年）
// ============================================================
export const DEDUCTION_STANDARDS = {
  childrenEducation: { min: 1000, max: 2000, perChild: true },  // 子女教育
  continuingEducation: { academic: 400, vocational: 3600 },      // 继续教育
  housingLoan: 1000,                                             // 住房贷款利息
  elderlyCare: { onlyChild: 2000, nonOnlyChild: 1000 },          // 赡养老人
  infantCare: { min: 1000, max: 2000, perChild: true }           // 婴幼儿照护
};

// ============================================================
// 住房租金城市等级映射（2024年）
// ============================================================
export const HOUSING_RENT_CITY_TIERS: Record<string, number> = {
  // 直辖市
  '北京': 1500,
  '上海': 1500,
  '天津': 1100,
  '重庆': 1100,
  // 省会及计划单列市
  '广州': 1100,
  '深圳': 1100,
  '杭州': 1100,
  '成都': 1100,
  '南京': 1100,
  '武汉': 1100,
  '西安': 1100,
  '长沙': 1100,
  '郑州': 1100,
  '东莞': 1100,
  '青岛': 1100,
  '大连': 1100,
  '宁波': 1100,
  '厦门': 1100,
  '昆明': 1100,
  '合肥': 1100,
  '福州': 1100,
  '济南': 1100,
  '沈阳': 1100,
  '哈尔滨': 1100,
  '苏州': 1100,
};

// ============================================================
// 默认五险一金配置（全国通用参考值）
// ============================================================
export const DEFAULT_INSURANCE_CONFIG: InsuranceConfig = {
  pension: 0.08,        // 养老保险 8%
  medical: 0.02,        // 医疗保险 2%
  unemployment: 0.005,  // 失业保险 0.5%
  housingFund: 0.12     // 住房公积金 12%
};

// ============================================================
// 主要城市五险一金预设（2024年数据）
// 数据来源：各地人社局/公积金管理中心公布的2024年度缴费基数上下限
// ============================================================
export const CITY_PRESETS: CityPreset[] = [
  {
    name: '北京',
    insuranceConfig: {
      pension: 0.08,
      medical: 0.02,
      unemployment: 0.005,
      housingFund: 0.12
    },
    maxInsuranceBase: 35283,
    minInsuranceBase: 6821,
    housingFundRange: { min: 0.05, max: 0.12 }
  },
  {
    name: '上海',
    insuranceConfig: {
      pension: 0.08,
      medical: 0.02,
      unemployment: 0.005,
      housingFund: 0.07
    },
    maxInsuranceBase: 36549,
    minInsuranceBase: 7310,
    housingFundRange: { min: 0.05, max: 0.07 }
  },
  {
    name: '广州',
    insuranceConfig: {
      pension: 0.08,
      medical: 0.02,
      unemployment: 0.002,
      housingFund: 0.12
    },
    maxInsuranceBase: 27501,
    minInsuranceBase: 5500,
    housingFundRange: { min: 0.05, max: 0.12 }
  },
  {
    name: '深圳',
    insuranceConfig: {
      pension: 0.08,
      medical: 0.02,
      unemployment: 0.005,
      housingFund: 0.12
    },
    maxInsuranceBase: 27501,
    minInsuranceBase: 2360,
    housingFundRange: { min: 0.05, max: 0.12 }
  },
  {
    name: '杭州',
    insuranceConfig: {
      pension: 0.08,
      medical: 0.02,
      unemployment: 0.005,
      housingFund: 0.12
    },
    maxInsuranceBase: 24930,
    minInsuranceBase: 4462,
    housingFundRange: { min: 0.05, max: 0.12 }
  },
  {
    name: '成都',
    insuranceConfig: {
      pension: 0.08,
      medical: 0.02,
      unemployment: 0.004,
      housingFund: 0.12
    },
    maxInsuranceBase: 22542,
    minInsuranceBase: 4511,
    housingFundRange: { min: 0.06, max: 0.12 }
  },
  {
    name: '南京',
    insuranceConfig: {
      pension: 0.08,
      medical: 0.02,
      unemployment: 0.005,
      housingFund: 0.12
    },
    maxInsuranceBase: 24042,
    minInsuranceBase: 4494,
    housingFundRange: { min: 0.08, max: 0.12 }
  },
  {
    name: '武汉',
    insuranceConfig: {
      pension: 0.08,
      medical: 0.02,
      unemployment: 0.003,
      housingFund: 0.12
    },
    maxInsuranceBase: 22467,
    minInsuranceBase: 4494,
    housingFundRange: { min: 0.08, max: 0.12 }
  },
  {
    name: '重庆',
    insuranceConfig: {
      pension: 0.08,
      medical: 0.02,
      unemployment: 0.005,
      housingFund: 0.12
    },
    maxInsuranceBase: 21027,
    minInsuranceBase: 4206,
    housingFundRange: { min: 0.05, max: 0.12 }
  },
  {
    name: '西安',
    insuranceConfig: {
      pension: 0.08,
      medical: 0.02,
      unemployment: 0.005,
      housingFund: 0.12
    },
    maxInsuranceBase: 21393,
    minInsuranceBase: 4279,
    housingFundRange: { min: 0.05, max: 0.12 }
  },
  {
    name: '苏州',
    insuranceConfig: {
      pension: 0.08,
      medical: 0.02,
      unemployment: 0.005,
      housingFund: 0.12
    },
    maxInsuranceBase: 24042,
    minInsuranceBase: 4494,
    housingFundRange: { min: 0.05, max: 0.12 }
  },
  {
    name: '天津',
    insuranceConfig: {
      pension: 0.08,
      medical: 0.02,
      unemployment: 0.005,
      housingFund: 0.12
    },
    maxInsuranceBase: 23442,
    minInsuranceBase: 4748,
    housingFundRange: { min: 0.05, max: 0.12 }
  },
  {
    name: '长沙',
    insuranceConfig: {
      pension: 0.08,
      medical: 0.02,
      unemployment: 0.003,
      housingFund: 0.12
    },
    maxInsuranceBase: 19968,
    minInsuranceBase: 3994,
    housingFundRange: { min: 0.05, max: 0.12 }
  },
  {
    name: '郑州',
    insuranceConfig: {
      pension: 0.08,
      medical: 0.02,
      unemployment: 0.003,
      housingFund: 0.12
    },
    maxInsuranceBase: 18756,
    minInsuranceBase: 3751,
    housingFundRange: { min: 0.05, max: 0.12 }
  },
  {
    name: '东莞',
    insuranceConfig: {
      pension: 0.08,
      medical: 0.015,
      unemployment: 0.002,
      housingFund: 0.12
    },
    maxInsuranceBase: 24930,
    minInsuranceBase: 4462,
    housingFundRange: { min: 0.05, max: 0.12 }
  },
  {
    name: '青岛',
    insuranceConfig: {
      pension: 0.08,
      medical: 0.02,
      unemployment: 0.005,
      housingFund: 0.12
    },
    maxInsuranceBase: 22078,
    minInsuranceBase: 4416,
    housingFundRange: { min: 0.05, max: 0.12 }
  },
  {
    name: '大连',
    insuranceConfig: {
      pension: 0.08,
      medical: 0.02,
      unemployment: 0.005,
      housingFund: 0.12
    },
    maxInsuranceBase: 19773,
    minInsuranceBase: 3955,
    housingFundRange: { min: 0.07, max: 0.12 }
  },
  {
    name: '宁波',
    insuranceConfig: {
      pension: 0.08,
      medical: 0.02,
      unemployment: 0.005,
      housingFund: 0.12
    },
    maxInsuranceBase: 24930,
    minInsuranceBase: 4462,
    housingFundRange: { min: 0.05, max: 0.12 }
  },
  {
    name: '厦门',
    insuranceConfig: {
      pension: 0.08,
      medical: 0.02,
      unemployment: 0.005,
      housingFund: 0.12
    },
    maxInsuranceBase: 22144,
    minInsuranceBase: 2100,
    housingFundRange: { min: 0.05, max: 0.12 }
  },
  {
    name: '昆明',
    insuranceConfig: {
      pension: 0.08,
      medical: 0.02,
      unemployment: 0.003,
      housingFund: 0.12
    },
    maxInsuranceBase: 21027,
    minInsuranceBase: 4206,
    housingFundRange: { min: 0.05, max: 0.12 }
  },
  {
    name: '合肥',
    insuranceConfig: {
      pension: 0.08,
      medical: 0.02,
      unemployment: 0.005,
      housingFund: 0.12
    },
    maxInsuranceBase: 21027,
    minInsuranceBase: 4227,
    housingFundRange: { min: 0.05, max: 0.12 }
  },
  {
    name: '福州',
    insuranceConfig: {
      pension: 0.08,
      medical: 0.02,
      unemployment: 0.005,
      housingFund: 0.12
    },
    maxInsuranceBase: 21027,
    minInsuranceBase: 4212,
    housingFundRange: { min: 0.05, max: 0.12 }
  },
  {
    name: '济南',
    insuranceConfig: {
      pension: 0.08,
      medical: 0.02,
      unemployment: 0.005,
      housingFund: 0.12
    },
    maxInsuranceBase: 22078,
    minInsuranceBase: 4416,
    housingFundRange: { min: 0.05, max: 0.12 }
  },
  {
    name: '沈阳',
    insuranceConfig: {
      pension: 0.08,
      medical: 0.02,
      unemployment: 0.005,
      housingFund: 0.12
    },
    maxInsuranceBase: 19773,
    minInsuranceBase: 3990,
    housingFundRange: { min: 0.06, max: 0.12 }
  },
  {
    name: '哈尔滨',
    insuranceConfig: {
      pension: 0.08,
      medical: 0.02,
      unemployment: 0.005,
      housingFund: 0.12
    },
    maxInsuranceBase: 17907,
    minInsuranceBase: 3582,
    housingFundRange: { min: 0.05, max: 0.12 }
  }
];

// ============================================================
// 快捷工资档位
// ============================================================
export const QUICK_SALARY_OPTIONS = [
  { label: '5K', value: 5000 },
  { label: '8K', value: 8000 },
  { label: '10K', value: 10000 },
  { label: '15K', value: 15000 },
  { label: '20K', value: 20000 },
  { label: '30K', value: 30000 },
  { label: '50K', value: 50000 }
];

// ============================================================
// 图表颜色配置
// ============================================================
export const CHART_COLORS = {
  netSalary: '#00D4FF',      // 税后工资 - 科技青
  tax: '#FF006E',            // 个税 - 霓虹粉
  insurance: '#7B61FF',      // 五险一金 - 电光紫
  pension: '#00D4FF',        // 养老保险
  medical: '#7B61FF',        // 医疗保险
  unemployment: '#FF006E',   // 失业保险
  housingFund: '#FFB800'     // 住房公积金
} as const;
