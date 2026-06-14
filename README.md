# Campus Copilot

面向应届生的 AI 校招操作系统 — 岗位发现 → AI 简历定制 → 网申管理 → 面试准备 → Offer 跟踪

## 技术栈

| 层 | 技术 |
|---|------|
| 前端 | Next.js 16 + TypeScript + Tailwind CSS v4 + shadcn/ui + framer-motion + Zustand |
| 后端 | FastAPI + SQLAlchemy 2.0 + Alembic + JWT 认证 |
| 数据库 | SQLite（开发）/ PostgreSQL（生产） |
| AI | OpenAI 兼容接口（Qwen / DeepSeek / GPT） |

## 项目结构

```
Campus-Copilot/
├── frontend/          # Next.js 前端
│   └── src/
│       ├── app/       # 6 个页面（工作台/档案/投递/简历/任务/面试）
│       ├── components/# shadcn UI + 自定义组件
│       ├── features/  # 功能模块（类型 + 子组件）
│       ├── stores/    # Zustand 状态管理
│       └── lib/       # API 客户端 + 工具函数
├── backend/           # FastAPI 后端
│   └── app/
│       ├── models/    # SQLAlchemy 模型
│       ├── schemas/   # Pydantic 请求/响应（camelCase）
│       ├── services/  # 业务逻辑层
│       ├── routes/    # API 路由（22 端点）
│       └── llm/       # LLM 适配器（Mock / OpenAI 兼容）
└── docs/
```

## 本地启动

### 前置条件

- Node.js 24+
- conda（推荐）或 Python 3.12+

### 后端

```bash
cd backend

# 创建 conda 环境（首次）
conda create -n campus-copilot python=3.12 -y
conda activate campus-copilot
pip install -r requirements.txt

# 启动开发服务器（自动建表）
uvicorn app.main:app --reload --port 8000
```

API 文档：http://localhost:8000/docs

### 前端

```bash
cd frontend
npm install
npm run dev
```

打开 http://localhost:3000

### LLM 配置（可选）

默认使用 Mock 模式（无需 API Key）。要对接真实 LLM，创建 `backend/.env`：

```env
LLM_PROVIDER=openai      # openai | qwen | deepseek
LLM_API_KEY=sk-your-key
LLM_BASE_URL=https://api.openai.com/v1
LLM_MODEL=gpt-4o-mini
```

## API 概览（共 22 端点）

```
认证     POST /api/v1/auth/register, /login
档案     GET/PUT /api/v1/profile
投递     GET/POST/PUT/DELETE /api/v1/applications[/{id}]
任务     GET/POST/PUT/DELETE /api/v1/tasks[/{id}]
简历     POST /api/v1/resumes/generate, GET /api/v1/resumes[/{id}], PUT/DELETE
面试     POST /api/v1/interviews/generate, /submit, GET /api/v1/interviews[/{id}]
健康     GET /health
```
