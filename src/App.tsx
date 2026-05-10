import { motion } from 'framer-motion';
import { RotateCcw, Sparkles } from 'lucide-react';
import { Header } from './components/Header';
import { SalaryInput } from './components/SalaryInput';
import { InsuranceConfigPanel } from './components/InsuranceConfig';
import { SpecialDeductionsPanel } from './components/SpecialDeductions';
import { ResultCard } from './components/ResultCard';
import { IncomeChart } from './components/IncomeChart';
import { useSalaryCalc } from './hooks/useSalaryCalc';

// 页面入场动画变体
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      cubicBezier: [0.16, 1, 0.3, 1]
    }
  }
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
    incomeBreakdown
  } = useSalaryCalc();

  return (
    <div className="min-h-screen pb-24 relative">
      <Header />

      <main className="px-4 max-w-lg mx-auto">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* 结果展示 */}
          <motion.div variants={itemVariants}>
            <ResultCard result={result} />
          </motion.div>

          {/* 收入构成图表 */}
          <motion.div variants={itemVariants}>
            <IncomeChart
              data={incomeBreakdown}
              grossSalary={result.grossSalary}
            />
          </motion.div>

          {/* 科技感分割线 */}
          <motion.div variants={itemVariants} className="my-6">
            <div className="divider-cyber">
              <span className="text-white/40 text-sm flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5" />
                计算配置
                <Sparkles className="w-3.5 h-3.5" />
              </span>
            </div>
          </motion.div>

          {/* 输入区域 */}
          <motion.div variants={itemVariants}>
            <SalaryInput
              value={grossSalary}
              onChange={setGrossSalary}
            />
          </motion.div>

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
              className="w-full h-14 mt-6 mb-8 rounded-2xl bg-white/5 border border-white/10 text-white/70 font-medium flex items-center justify-center gap-2 hover:bg-white/10 hover:text-white hover:border-white/20 transition-all duration-300"
            >
              <RotateCcw className="w-4 h-4" />
              重置所有配置
            </motion.button>
          </motion.div>
        </motion.div>
      </main>

      {/* 底部信息 */}
      <motion.footer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 1 }}
        className="fixed bottom-0 left-0 right-0 py-4 text-center bg-gradient-to-t from-[#0A0A0F] via-[#0A0A0F]/90 to-transparent pointer-events-none"
      >
        <p className="text-white/30 text-xs">
          基于 2024 年最新个税政策 · 覆盖 25 个城市
        </p>
      </motion.footer>
    </div>
  );
}

export default App;
