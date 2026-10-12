# Weather Application

基于 React 18、TypeScript 和 Vite 开发的响应式天气查询应用，使用 Open-Meteo API 提供全球地点的天气数据与预报。

## 快速启动

本项目选用公开的 Open-Meteo API，无需申请或配置任何 API Key 与环境变量。

```bash
# 安装依赖
npm install

# 启动本地开发环境 (默认端口 3000)
npm run dev

# 运行单元测试
npm test

# 生产构建与类型检查
npm run build
```

启动后在浏览器访问 `http://localhost:3000` 即可体验。

## 功能特性

- **地点搜索**：支持中英文城市模糊搜索（如「北京」、「上海」、「Tokyo」、「New York」），内置 300ms 防抖与下拉建议，支持键盘上下方向键与回车键选择。
- **定位功能**：支持通过 HTML5 Geolocation API 一键定位当前所在经纬度。
- **实时天气**：展示实时气温、体感温度、当日高低温、相对湿度、风速、降水概率、紫外线指数与气压指标。
- **预报信息**：
  - 24 小时逐小时预报（支持手势水平滑动与吸附效果）。
  - 7 天天气预报（含高低温温差区间条可视化与降水概率）。
- **温标切换**：支持摄氏度 (°C) 与华氏度 (°F) 无缝切换，全站实时联动计算。
- **搜索历史**：使用 LocalStorage 本地持久化保存最近搜索记录，支持快速点选与单项清除。
- **加载与错误处理**：
  - 数据加载时呈现骨架屏 (Skeleton)，避免页面闪烁。
  - 网络或接口异常时展示友好提示，并提供重新加载按钮。
- **移动端适配**：适配各尺寸手机屏幕，避让 iOS 安全区域，输入框字号设定为 16px 避免 iOS Safari 聚焦时自动缩放。

## 目录结构

```text
src/
├── api/             # API 请求封装 (Fetch client, Open-Meteo API)
├── types/           # 业务实体与 API 类型定义
├── hooks/           # 自定义 Hook (搜索防抖、定位、React Query 封装)
├── context/         # 全局状态 (温标偏好、当前选中地点、搜索历史)
├── components/
│   ├── common/      # 通用组件 (Button, Card, Skeleton, ErrorAlert, WeatherIcon)
│   ├── layout/      # 布局骨架 (Header, Footer)
│   ├── search/      # 搜索模块 (SearchBar, SearchHistory)
│   └── weather/     # 天气展示 (CurrentWeather, Metrics, Hourly, Daily)
├── utils/           # 工具函数 (WMO 天气代码解析、温标转换、日期格式化)
└── __tests__/       # 单元测试集 (Vitest + React Testing Library)
```

## 工程设计与权衡 (Trade-offs)

### 1. 为什么选择 Open-Meteo API？
- **零 API Key 门槛**：评审项目代码时，若需要注册第三方 Key 或配置本地 `.env` 容易增加运行成本。Open-Meteo 完全免密钥，拉取代码后即可直接运行。
- **数据标准化**：遵循国际世界气象组织 (WMO) 标准代码，数据规范统一，同时内置全球地理编码搜索服务 (Geocoding)。

### 2. 服务端状态管理：TanStack Query
- 天气数据本质是异步远程数据，具备缓存、时效和重试需求。
- 引入 TanStack Query 统一管理接口请求、缓存（默认 5 分钟）和自动重试，消除手写 `useEffect` 常见的竞态问题与重复请求。
- 客户端纯 UI 状态（温标单位、搜索历史）则采用轻量的 React Context + LocalStorage，保持架构简洁，避免引入 Redux 等重型库。

### 3. 搜索防抖与体验优化
- 搜索输入增加 300ms 防抖，字符少于 2 个字时不发起无意义请求。
- 引入 `AbortController` 机制，在用户连续输入时取消过期的未完成请求。
- 遵循 WAI-ARIA Combobox 无障碍规范，支持键盘上下键选词、回车确认、ESC 关闭。

### 4. 容错与错误恢复
- 自定义 `ApiError` 类型，区分断网、请求超时、未找到地点和服务器异常。
- 错误界面不仅展示原因，更提供“重新加载”操作入口，提升容错弹性。

## 测试说明

使用 Vitest 与 React Testing Library 编写单元测试：

```bash
npm test
```

测试覆盖范围：
- 温标转换与精度处理 (`temperature.test.ts`)
- WMO 天气代号及昼夜图标转换 (`wmoCodes.test.ts`)
- LocalStorage 读写与更新同步 (`useLocalStorage.test.ts`)
- 错误提示组件渲染与重试回调 (`ErrorAlert.test.tsx`)

## 后续可拓展方向

- **折线图表**：引入轻量图表库展示未来 24 小时气温与降水概率平滑趋势图。
- **离线支持**：通过 Service Worker 离线缓存最近一次天气查询结果。
- **多语言 (i18n)**：支持中英双语切换。
