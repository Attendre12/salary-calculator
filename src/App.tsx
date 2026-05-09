import { motion } from 'framer-motion';
import { RotateCcw } from 'lucide-react';
import { Header } from './components/Header';
import { SalaryInput } from './components/SalaryInput';
import { InsuranceConfigPanel } from './components/InsuranceConfig';
import { SpecialDeductionsPanel } from './components/SpecialDeductions';
import { ResultCard } from './components/ResultCard';
import { IncomeChart } from './components/IncomeChart';
import { useSalaryCalc } from './hooks/useSalaryCalc';

function App() {
  const {
    grossSalary,
    insuranceBase,
    insuranceConfig,
    specialDeductions,
    city,
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
    <div className="min-h-screen pb-20">
      <Header />
      
      <main className="px-4 max-w-lg mx-auto">
        {/* 结果展示 */}
        <ResultCard result={result} />
        
        {/* 收入构成图表 */}
        <IncomeChart 
          data={incomeBreakdown} 
          grossSalary={result.grossSalary} 
        />
        
        {/* 输入区域 */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="flex items-center gap-2 mb-4">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
            <span className="text-white/40 text-sm">计算配置</span>
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
          </div>
          
          <SalaryInput 
            value={grossSalary} 
            onChange={setGrossSalary} 
          />
          
          <InsuranceConfigPanel
            base={insuranceBase}
            onBaseChange={setInsuranceBase}
            config={insuranceConfig}
            onConfigChange={updateInsuranceConfig}
            city={city}
            onCityChange={setCity}
          />
          
          <SpecialDeductionsPanel
            deductions={specialDeductions}
            onUpdate={updateSpecialDeduction}
          />
        </motion.div>

        {/* 重置按钮 */}
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={resetAll}
          className="w-full h-14 mt-6 mb-8 rounded-2xl bg-white/5 border border-white/10 text-white/70 font-medium flex items-center justify-center gap-2 hover:bg-white/10 hover:text-white transition-all"
        >
          <RotateCcw className="w-4 h-4" />
          重置所有配置
        </motion.button>
      </main>

      {/* 底部信息 */}
      <motion.footer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="fixed bottom-0 left-0 right-0 py-4 text-center"
      >
        <p className="text-white/30 text-xs">
          基于 2024 年最新个税政策计算
        </p>
      </motion.footer>
    </div>
  );
}

export default App;
