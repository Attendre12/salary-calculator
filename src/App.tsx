import { motion } from 'framer-motion';
import { RotateCcw } from 'lucide-react';
import { Header } from './components/Header';
import { SalaryInput } from './components/SalaryInput';
import { InsuranceConfigPanel } from './components/InsuranceConfig';
import { SpecialDeductionsPanel } from './components/SpecialDeductions';
import { ResultCard } from './components/ResultCard';
import { IncomeChart } from './components/IncomeChart';
import { useSalaryCalc } from './hooks/useSalaryCalc';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.03,
      delayChildren: 0.03,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.3,
      ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
    },
  },
};

function App() {
  const {
    grossSalary,
    insuranceBase,
    insuranceConfig,
    specialDeductions,
    city,
    cityLimits,
    setGrossSalary,
    setInsuranceBase,
    updateInsuranceConfig,
    updateSpecialDeduction,
    setCity,
    resetAll,
    result,
    incomeBreakdown,
  } = useSalaryCalc();

  return (
    <div className="min-h-screen pb-6">
      <Header />

      <main className="px-4 max-w-lg mx-auto">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-col gap-3"
        >
          {/* 结果展示 */}
          <motion.div variants={itemVariants}>
            <ResultCard result={result} />
          </motion.div>

          {/* 收入构成图表 */}
          <motion.div variants={itemVariants}>
            <IncomeChart data={incomeBreakdown} grossSalary={result.grossSalary} />
          </motion.div>

          {/* 输入区域 */}
          <motion.div variants={itemVariants}>
            <SalaryInput value={grossSalary} onChange={setGrossSalary} />
          </motion.div>

          {/* 五险一金折叠面板 */}
          <motion.div variants={itemVariants}>
            <InsuranceConfigPanel
              base={insuranceBase}
              onBaseChange={setInsuranceBase}
              config={insuranceConfig}
              onConfigChange={updateInsuranceConfig}
              city={city}
              onCityChange={setCity}
              cityLimits={cityLimits}
            />
          </motion.div>

          {/* 专项扣除折叠面板 */}
          <motion.div variants={itemVariants}>
            <SpecialDeductionsPanel
              deductions={specialDeductions}
              onUpdate={updateSpecialDeduction}
            />
          </motion.div>

          {/* 重置按钮 */}
          <motion.div variants={itemVariants} className="flex justify-center">
            <button
              onClick={resetAll}
              className="text-[var(--text-tertiary)] text-xs hover:text-[var(--text-secondary)] transition-colors duration-200 flex items-center gap-1 py-2"
            >
              <RotateCcw className="w-3 h-3" />
              重置
            </button>
          </motion.div>
        </motion.div>
      </main>

      {/* 底部信息 */}
      <p className="text-center text-[var(--text-tertiary)] text-[10px] mt-4 pb-6">
        基于 2024 年最新个税政策 · 覆盖 25 个城市
      </p>
    </div>
  );
}

export default App;
