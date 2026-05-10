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

      <main className="px-4 max-w-lg mx-auto flex flex-col gap-3">
          {/* 结果展示 */}
          <ResultCard result={result} />

          {/* 收入构成图表 */}
          <IncomeChart data={incomeBreakdown} grossSalary={result.grossSalary} />

          {/* 输入区域 */}
          <SalaryInput value={grossSalary} onChange={setGrossSalary} />

          {/* 五险一金折叠面板 */}
          <InsuranceConfigPanel
            base={insuranceBase}
            onBaseChange={setInsuranceBase}
            config={insuranceConfig}
            onConfigChange={updateInsuranceConfig}
            city={city}
            onCityChange={setCity}
            cityLimits={cityLimits}
          />

          {/* 专项扣除折叠面板 */}
          <SpecialDeductionsPanel
            deductions={specialDeductions}
            onUpdate={updateSpecialDeduction}
          />

          {/* 重置按钮 */}
          <div className="flex justify-center">
            <button
              onClick={resetAll}
              className="text-[var(--text-tertiary)] text-xs hover:text-[var(--text-secondary)] transition-colors duration-200 flex items-center gap-1 py-2"
            >
              <RotateCcw className="w-3 h-3" />
              重置
            </button>
          </div>
      </main>

      {/* 底部信息 */}
      <p className="text-center text-[var(--text-tertiary)] text-[10px] mt-4 pb-6">
        基于 2024 年最新个税政策 · 覆盖 25 个城市
      </p>
    </div>
  );
}

export default App;
