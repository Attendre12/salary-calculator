import { motion } from 'framer-motion';
import { Calculator } from 'lucide-react';

const GITHUB_URL = 'https://github.com/Attendre12/salary-calculator';

export function Header() {
  return (
    <motion.header
      initial={{ opacity: 0, y: -30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="sticky top-0 z-50 glass-card data-stream mx-4 mt-4 mb-6 px-5 py-4"
    >
      {/* 扫描线装饰 */}
      <div
        className="pointer-events-none absolute inset-0 overflow-hidden rounded-[20px]"
        aria-hidden="true"
      >
        <div
          className="absolute left-0 right-0 h-[1px] animate-[scanline-sweep_8s_linear_infinite]"
          style={{
            background:
              'linear-gradient(180deg, transparent 0%, rgba(0,212,255,0.08) 40%, rgba(0,212,255,0.15) 50%, rgba(0,212,255,0.08) 60%, transparent 100%)',
            height: '80px',
          }}
        />
      </div>

      <nav className="relative z-10 flex items-center justify-between">
        {/* Logo + 标题 */}
        <motion.div
          className="flex items-center gap-3"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
        >
          {/* Logo 带脉冲呼吸动画 */}
          <div className="relative">
            <div
              className="absolute -inset-1 rounded-xl animate-pulse-glow"
              aria-hidden="true"
            />
            <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center animate-breathe">
              <Calculator className="w-5 h-5 text-white" />
            </div>
          </div>

          <div>
            <h1 className="gradient-text font-bold text-lg leading-tight">
              税后工资计算器
            </h1>
            <p className="neon-text text-xs font-medium tracking-wider">
              2024 最新税率
            </p>
          </div>
        </motion.div>

        {/* 科技感分割线 */}
        <div className="glow-line-vertical hidden sm:block mx-4 h-8" aria-hidden="true" />

        {/* GitHub 链接 */}
        <motion.a
          href={GITHUB_URL}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="GitHub 仓库"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          whileHover={{ scale: 1.1, rotate: 3 }}
          whileTap={{ scale: 0.9 }}
          className="relative w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 hover:border-cyan-500/30 hover:shadow-[0_0_15px_rgba(0,212,255,0.2)] transition-all duration-300"
        >
          {/* GitHub SVG 图标 */}
          <svg
            className="w-4 h-4"
            viewBox="0 0 24 24"
            fill="currentColor"
            aria-hidden="true"
          >
            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
          </svg>
          {/* 悬停发光环 */}
          <span
            className="absolute inset-0 rounded-lg opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none"
            style={{
              boxShadow:
                '0 0 12px rgba(0,212,255,0.3), inset 0 0 12px rgba(0,212,255,0.05)',
            }}
            aria-hidden="true"
          />
        </motion.a>
      </nav>

      {/* 底部科技感分割线 */}
      <hr className="glow-line mt-3 mb-0" aria-hidden="true" />
    </motion.header>
  );
}
