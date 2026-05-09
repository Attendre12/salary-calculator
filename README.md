# 💰 税后工资到手计算器

一款采用赛博朋克科技感设计的移动端税后工资计算器，基于 2024 年最新个税政策，帮助您快速准确地计算个人所得税和实际到手收入。

![Tech Stack](https://img.shields.io/badge/React-18-61DAFB?logo=react)
![Tech Stack](https://img.shields.io/badge/TypeScript-5.0-3178C6?logo=typescript)
![Tech Stack](https://img.shields.io/badge/Tailwind-CSS-06B6D4?logo=tailwindcss)
![License](https://img.shields.io/badge/License-MIT-green)

## ✨ 功能特性

### 核心计算
- ✅ **税前工资输入** - 支持快捷档位选择
- ✅ **五险一金计算** - 可自定义缴纳比例
- ✅ **专项附加扣除** - 支持全部6项扣除
- ✅ **实时个税计算** - 基于2024最新税率表
- ✅ **税后工资展示** - 数字滚动动画效果

### 城市预设
- 北京、上海、广州、深圳
- 杭州、成都等主流城市
- 自动应用当地缴纳比例

### 专项附加扣除
- 子女教育（每个子女1000-2000元/月）
- 继续教育（学历/职业资格）
- 住房贷款利息（1000元/月）
- 住房租金（按城市800-1500元/月）
- 赡养老人（独生子女2000元/月）
- 3岁以下婴幼儿照护

### 科技感UI
- 🌙 深色主题 + 霓虹光效
- 💎 玻璃拟态卡片设计
- 📊 收入构成环形图
- ✨ 流畅的交互动画

## 🚀 在线体验

访问链接：`https://[你的用户名].github.io/salary-calculator/`

## 📱 本地开发

```bash
# 克隆项目
git clone https://github.com/[你的用户名]/salary-calculator.git
cd salary-calculator

# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build
```

## 🛠 技术栈

- **框架**: React 18 + TypeScript
- **构建**: Vite
- **样式**: Tailwind CSS
- **动画**: Framer Motion
- **图表**: Recharts
- **图标**: Lucide React

## 📂 项目结构

```
salary-calculator/
├── src/
│   ├── components/       # UI组件
│   ├── hooks/           # 自定义Hooks
│   ├── utils/           # 工具函数
│   ├── types/           # TypeScript类型
│   └── App.tsx          # 主应用
├── .github/workflows/   # GitHub Actions
└── README.md
```

## 🚀 部署到 GitHub Pages

### 方式一：GitHub Actions 自动部署

1. 在 GitHub 创建新仓库 `salary-calculator`
2. 将代码推送到仓库：
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/[你的用户名]/salary-calculator.git
git push -u origin main
```
3. 进入仓库 Settings → Pages
4. Source 选择 "GitHub Actions"
5. 推送代码后会自动触发部署

### 方式二：手动部署

```bash
npm run build
git add dist -f
git commit -m "Deploy to GitHub Pages"
git subtree push --prefix dist origin gh-pages
```

## 📄 许可证

MIT License © 2024

---

Made with ❤️ using React + TypeScript
