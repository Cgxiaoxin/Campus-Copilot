# Campus Copilot 开发日志

## 项目概述

面向应届生的 AI 校招操作系统。前端 Next.js 16 + shadcn/ui + Zustand，后端 FastAPI + SQLAlchemy + SQLite/PostgreSQL。

---

## Session 1: 前端骨架搭建（2026-06-14）

### 目标
初始化前端项目，完成 6 个页面的基础骨架和导航。

### 变更
- 使用 `create-next-app` 初始化 TypeScript + Tailwind + App Router 项目
- 创建 26 个 SVG 图标组件（`src/components/icons.tsx`）
- 搭建侧边栏导航（`src/components/sidebar.tsx`）
- 实现 6 个路由页面：工作台、档案、投递、简历、任务、面试
- 中文 UI，极简设计风格

### 产出文件
```
src/app/page.tsx                    # 工作台
src/app/profile/page.tsx            # 档案
src/app/applications/page.tsx       # 投递
src/app/tasks/page.tsx              # 任务
src/app/resume/page.tsx             # 简历（占位）
src/app/interviews/page.tsx         # 面试（占位）
src/components/icons.tsx            # SVG 图标
src/components/sidebar.tsx          # 侧边栏
src/lib/utils.ts                    # cn() 工具
src/lib/use-local-storage.ts        # 本地存储 hook
src/lib/api.ts                      # API 客户端
src/types/index.ts                  # 全局类型
```

---

## Session 2: shadcn/ui 迁移 + 设计 Token（2026-06-14）

### 目标
用 shadcn/ui 替换手写 CSS @utility 类，统一设计 Token。

### 变更
- 初始化 shadcn/ui v4（Radix Nova 预设），生成 `components.json`
- 从手写 `@utility btn / card / input / badge / select / label` 迁移到 shadcn 组件
- CSS 变量设计 Token（颜色/圆角/阴影）通过 `@theme inline` 注入
- Dialog 弹窗改为 shadcn Dialog

### 安装依赖
`shadcn`, `radix-ui`, `lucide-react`, `class-variance-authority`, `tailwind-merge`, `clsx`, `tw-animate-css`

### 新增 UI 组件
`button`, `card`, `input`, `badge`, `select`, `label`, `dialog`

---

## Session 3: framer-motion 动效（2026-06-14）

### 目标
引入页面入场和卡片交错动画。

### 变更
- 创建 `src/components/motion.tsx`（PageTransition, StaggerGrid, CardMotion）
- 替换 CSS `animate-fade-in` 为 framer-motion 动画组件
- 所有 6 个页面包裹 `<PageTransition>`，工作台使用 `<CardMotion>` 交错卡片

### 安装依赖
`framer-motion`

---

## Session 4: Feature 架构抽取（2026-06-14）

### 目标
建立功能模块化架构，抽取 Profile 子组件。

### 变更
- 创建 `src/features/` 目录（dashboard / profile / applications / tasks / resume / interview）
- 抽取 Profile 子组件：Section, Field, ItemCard 到 `features/profile/components/`
- 创建 feature 级类型定义：`features/profile/types.ts` 等

---

## Session 5: Zustand 状态管理（2026-06-14）

### 目标
用 Zustand + persist 替换直接 `useLocalStorage` 调用。

### 变更
- 安装 `zustand`
- 创建 3 个 persist store：`profile-store.ts`, `application-store.ts`, `task-store.ts`
- 工作台、档案、投递、任务页面改用 store
- persist key: `"profile"`, `"applications"`, `"tasks"`

### 安装依赖
`zustand`

---

## Session 6: 高级交互组件（2026-06-14）

### 目标
深色模式、命令面板、错误边界、空状态、Toast 通知。

### 变更
- 安装 `next-themes` + `sonner` + `cmdk`
- 创建 `providers.tsx`（ThemeProvider + TooltipProvider + Toaster）
- 创建 `theme-toggle.tsx`（深色模式切换按钮）
- 创建 `command-palette.tsx`（Ctrl+K 全局导航）
- 创建 `error-boundary.tsx`（错误捕获 + 重试）
- 创建 `empty-state.tsx`（可复用空态）
- 侧边栏改为设计 Token（`bg-sidebar` 等 CSS 变量）
- layout.tsx 包裹 Providers

### 新增 shadcn 组件
`tooltip`, `command`, `dropdown-menu`, `popover`, `sonner`, `textarea`, `input-group`

---

## Session 7: 后端开发（FastAPI + SQLAlchemy + JWT）（2026-06-14）

### 目标
搭建 FastAPI 后端骨架，包括认证、数据模型和 REST API。

### 变更
- 创建 conda 环境 `campus-copilot`（Python 3.12）
- 安装 FastAPI + Uvicorn + SQLAlchemy + Alembic + JWT 等依赖
- 项目结构：`app/{models,schemas,services,routes}/`
- SQLAlchemy 模型：User, Profile, Application, Task
- Pydantic Schema：camelCase 自动转换（`CamelCaseModel`）
- JWT 认证：注册/登录/token 鉴权
- API 路由：Profile/Application/Task CRUD（14 端点）
- Alembic 迁移初始化

### 后端目录
```
backend/
├── app/
│   ├── main.py, config.py, database.py, dependencies.py, fields.py
│   ├── models/{user,profile,application,task}.py
│   ├── schemas/{auth,profile,application,task}.py + __init__.py (CamelCaseModel)
│   ├── services/{auth,profile,application,task}.py
│   └── routes/{auth,profile,application,task}.py
├── alembic/
├── alembic.ini
└── requirements.txt
```

### API 端点（14）
```
POST /api/v1/auth/register, /login
GET/PUT /api/v1/profile
GET/POST/PUT/DELETE /api/v1/applications[/{id}]
GET/POST/PUT/DELETE /api/v1/tasks[/{id}]
GET /health
```

### 安装依赖
`fastapi`, `uvicorn`, `sqlalchemy`, `alembic`, `psycopg2-binary`, `python-jose`, `passlib`, `python-multipart`, `pydantic-settings`, `email-validator`

---

## Session 8: 切换 SQLite + 前端清理（2026-06-14）

### 目标
配置 SQLite 零依赖开发模式，清理前端遗留代码。

### 变更
- `config.py` 默认 `DATABASE_URL=sqlite:///./campus.db`
- `database.py` 添加 SQLite `check_same_thread=False` + PRAGMA foreign_keys
- 创建 `fields.py` 跨 DB UUID 类型（PostgreSQL UUID / SQLite String 自动适配）
- 模型字段：`JSONB` → `JSON`, `ARRAY` → `JSON`（跨 DB 兼容）
- 前端清理：删除旧 `@utility` CSS（card/btn/input/badge 等 9 个）
- 前端清理：删除 `animate-fade-in` / `animate-slide-up` CSS（已由 framer-motion 替代）
- 更新 `api.ts` 对接全部后端端点（含 token 管理）
- 更新 `types/index.ts` 匹配后端 camelCase 返回

---

## Session 9: Resume + Interview 功能开发（2026-06-14）

### 目标
填充简历生成和面试准备页面的完整功能。

### 变更

#### 后端新增（8 端点）
- Resume 模型 + Schema + Service + Routes（`/resumes/*` 5 端点）
- InterviewSession 模型 + Schema + Service + Routes（`/interviews/*` 3 端点）
- User 模型添加 `resumes` / `interview_sessions` 关系

#### 前端 Resume
- 3 模板组件（modern/minimal/professional）在 `features/resume/components/`
- 左侧控制面板：JD 输入 + 关键词提取 + 模板选择 + AI 生成按钮
- 右侧实时预览（切换模板即渲染）
- 导出按钮

#### 前端 Interview
- setup → answering → review 三阶段流程
- 公司/岗位输入 → 生成 5 题 → 逐题作答 → 评分 → 复盘报告
- 进度条 + 已评题目面板 + 综合评分

### 新增后端模型
`resumes`, `interview_sessions` 两张表

### 新增 API（8）
```
POST /api/v1/resumes/generate
GET /api/v1/resumes[/{id}]
PUT /api/v1/resumes/{id}
DELETE /api/v1/resumes/{id}
POST /api/v1/interviews/generate
POST /api/v1/interviews/submit
GET /api/v1/interviews[/{id}]
```

---

## Session 10: LLM Adapter + 前后端联调（2026-06-14）

### 目标
实现 LLM 适配器层，前后端打通。

### 变更

#### LLM Adapter（`app/llm/__init__.py`）
- `LLMAdapter` 抽象基类（`generate` / `generate_json`）
- `MockLLM` — 默认，返回结构化 JSON 数据，零依赖
- `OpenAICompatibleLLM` — 兼容 OpenAI / Qwen / DeepSeek API
- `get_llm()` 工厂函数，通过 `.env` 配置切换
- `config.py` 添加 LLM 配置项（`LLM_PROVIDER`, `LLM_API_KEY`, `LLM_BASE_URL`, `LLM_MODEL`）

#### Resume Service 升级
- 使用 LLM 生成简历内容（system prompt + 用户档案 + JD → JSON）
- LLM 调用失败时自动 fallback 到 mock 数据

#### Interview Service 升级
- 使用 LLM 生成面试题（公司/岗位 → 5 题 JSON 数组）
- 使用 LLM 评估回答（问答对 → 分数 + 反馈 + 报告）
- LLM 调用失败时自动 fallback 到 mock 数据

#### 前端 Auth + 联调
- `AuthProvider` / `AuthDialog` — 登录/注册/退出弹窗
- 侧边栏底部「连接后端」入口，显示登录状态
- Resume 页：有 token 调 `POST /resumes/generate`，无 token 用 mock
- Interview 页：有 token 调 `POST /interviews/generate` + `/submit`，无 token 用 mock
- API 调用失败自动降级

### 安装依赖
`httpx`

### 新增 API 配置
```env
LLM_PROVIDER=mock              # mock | openai | qwen | deepseek
LLM_API_KEY=sk-xxx
LLM_BASE_URL=https://api.openai.com/v1
LLM_MODEL=gpt-4o-mini
```

---

## 当前状态总览

### 前端（17 工具 + 6 页面）

| 类别 | 文件 |
|------|------|
| UI 组件 | 14 个 shadcn 组件 + 自定义（icons/command-palette/theme-toggle/empty-state/error-boundary/auth-dialog）|
| 动画 | PageTransition, StaggerGrid, CardMotion |
| 状态 | 3 个 Zustand persist stores（profile/application/task）|
| 功能模块 | profile（Section/Field/ItemCard）, resume（3 模板）, interview（3 Stage）|

### 后端（22 端点 + 6 数据表）

| 模块 | 端点 |
|------|------|
| Auth | 注册 + 登录 |
| Profile | 获取 + 更新 |
| Application | CRUD + 状态筛选 |
| Task | CRUD |
| Resume | AI 生成 + CRUD |
| Interview | AI 出题 + 提交评分 + 查询 |
| LLM | Mock / OpenAI 兼容切换 |

### 依赖

**前端**: next, react, typescript, tailwindcss, framer-motion, zustand, next-themes, sonner, cmdk, lucide-react, radix-ui, class-variance-authority, clsx, tailwind-merge, tw-animate-css

**后端**: fastapi, uvicorn, sqlalchemy, alembic, python-jose, passlib, pydantic-settings, httpx, psycopg2-binary, python-multipart, email-validator

---

## 待办（Backlog）

| 优先级 | 事项 |
|--------|------|
| 高 | 启动后端并验证所有 API 端点（首次启动自动建表）|
| 高 | 前后端联调测试（注册 → 登录 → 简历生成 → 面试模拟）|
| 中 | 后端单元测试 + 前端 E2E 测试（Playwright）|
| 中 | 简历 PDF 导出（html2pdf 或 Puppeteer）|
| 中 | 投递/任务页面的完整 CRUD Dialog |
| 低 | Docker Compose（PostgreSQL + Redis）|
| 低 | CI/CD（GitHub Actions + Vercel 部署）|
| 低 | AI Agent 系统（RAG + Multi-Agent 编排）|

---

*日志格式：每次开发 Session 记录目标、变更、产出文件、新增依赖、当前状态。*
