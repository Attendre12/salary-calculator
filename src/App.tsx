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
      staggerChildren: 0.05,
      delayChildren: 0.05,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      cubicBezier: [0.16, 1, 0.3, 1],
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
        >
          {/* 结果展示 - 最上面 */}
          <motion.div variants={itemVariants}>
            <ResultCard result={result} />
          </motion.div>

          {/* 个税和五险一金小卡片已内嵌在 ResultCard 中 */}

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
          <motion.div variants={itemVariants}>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={resetAll}
              className="w-full h-10 mt-2 mb-4 rounded-xl bg-white/[0.03] border border-white/[0.06] text-white/50 text-sm font-medium flex items-center justify-center gap-1.5 hover:bg-white/[0.06] hover:text-white/70 hover:border-white/10 transition-all duration-200"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              重置
            </motion.button>
          </motion.div>
        </motion.div>
      </main>

      {/* 底部信息 - 简单一行 */}
      <p className="text-center text-white/20 text-[10px] mt-2">
        基于 2024 年最新个税政策 · 覆盖 25 个城市
      </p>
    </div>
  );
}

export default App;
