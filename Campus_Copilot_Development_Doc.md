# Campus Copilot 开发文档（Technical Design）

## 架构概览

```
┌─────────────────────────────────────────────────────────┐
│                    Frontend (Next.js)                     │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐  │
│  │ Dashboard│ │ Profile  │ │Resume Gen│ │ Time     │  │
│  │          │ │          │ │          │ │ Agent    │  │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘  │
│  ┌──────────┐ ┌──────────┐ ┌──────────────────────┐   │
│  │Interviews│ │Application│ │ Shared Components    │   │
│  │          │ │          │ │ (Sidebar, Layout...) │   │
│  └──────────┘ └──────────┘ └──────────────────────┘   │
└──────────────────────┬──────────────────────────────────┘
                       │ REST API (JSON)
┌──────────────────────▼──────────────────────────────────┐
│                   Backend (FastAPI)                       │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐  │
│  │Profile   │ │Resume    │ │Application│ │ Time     │  │
│  │Service   │ │Service   │ │Agent     │ │ Agent    │  │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘  │
│  ┌──────────┐ ┌──────────────────────────────────────┐ │
│  │Interview │ │ LLM Adapter (Qwen/DeepSeek/GPT)       │ │
│  │Agent    │ │ RAG Engine + Embedding Pipeline       │ │
│  └──────────┘ └──────────────────────────────────────┘ │
└──────┬──────────────┬──────────────┬─────────────────────┘
       │              │              │
┌──────▼──────┐ ┌─────▼──────┐ ┌────▼──────────┐
│ PostgreSQL  │ │   Redis    │ │  Vector DB    │
│ (主存储)    │ │ (缓存/队列) │ │ (RAG 检索)    │
└─────────────┘ └────────────┘ └───────────────┘
```

## 推荐技术栈

### 前端
- **框架**：Next.js 16 + App Router — 文件系统路由、SSR/SSG 按需选择
- **样式**：Tailwind CSS v4 — 原子化 CSS，无运行时开销
- **语言**：TypeScript — 全栈类型安全
- **状态管理**：React Context + useReducer，复杂场景引入 Zustand
- **HTTP 客户端**：原生 fetch 封装为 api.ts 客户端

### 后端
- **框架**：FastAPI — 异步原生，自动 OpenAPI 文档
- **ORM**：SQLAlchemy 2.0 + Alembic 迁移管理
- **数据库**：PostgreSQL 15+
- **缓存**：Redis — 热点缓存 / 任务队列 Broker
- **任务队列**：Celery — 异步处理 AI 请求等耗时任务
- **认证**：FastAPI + python-jose (JWT) + OAuth2

### AI 能力
- **LLM**：Qwen / DeepSeek / GPT 通过统一 Adapter 切换
- **Embedding**：text-embedding-3-small 或 BGE 系列
- **RAG**：LangChain / LlamaIndex 或自建检索管线
- **向量数据库**：pgvector（PostgreSQL 扩展）或 Milvus
- **Multi-Agent**：LangGraph / CrewAI 或自建编排

## 核心服务与 API 设计

### Profile Service

```
GET    /api/v1/profile          — 获取当前用户档案
PUT    /api/v1/profile          — 更新档案
POST   /api/v1/profile/import   — 导入简历解析
```

### Resume Service

```
POST   /api/v1/resume/generate  — 根据 JD 生成简历
GET    /api/v1/resume/:id       — 获取简历
PUT    /api/v1/resume/:id       — 手动调整简历
```

### Application Agent

```
GET    /api/v1/applications           — 投递列表
POST   /api/v1/applications           — 新建投递
PUT    /api/v1/applications/:id       — 更新状态
POST   /api/v1/applications/generate  — AI 生成网申内容
```

### Time Agent

```
GET    /api/v1/tasks            — 任务列表
POST   /api/v1/tasks            — 新建任务
PUT    /api/v1/tasks/:id        — 更新任务状态
POST   /api/v1/tasks/generate   — AI 生成每日计划
```

### Interview Agent

```
POST   /api/v1/interviews/generate    — 生成面试题
POST   /api/v1/interviews/evaluate    — 评估回答
GET    /api/v1/interviews/:id/report  — 获取复盘报告
```

## 数据模型

### user

| 字段 | 类型 | 说明 |
|------|------|------|
| id | UUID | 主键 |
| name | VARCHAR(100) | 用户名 |
| email | VARCHAR(255), UNIQUE | 登录邮箱 |
| password_hash | VARCHAR(255) | 密码哈希 |
| role | ENUM('user', 'admin') | 角色 |
| created_at | TIMESTAMP | 创建时间 |
| updated_at | TIMESTAMP | 更新时间 |

### profile

| 字段 | 类型 | 说明 |
|------|------|------|
| id | UUID | 主键 |
| user_id | UUID, FK | 关联用户 |
| full_name | VARCHAR(100) | 姓名 |
| phone | VARCHAR(20) | 电话 |
| avatar | TEXT | 头像 URL |
| summary | TEXT | 个人简介 |
| education | JSONB | 教育经历数组 |
| projects | JSONB | 项目经历数组 |
| internships | JSONB | 实习经历数组 |
| skills | TEXT[] | 技能标签 |
| awards | TEXT[] | 获奖信息 |
| created_at | TIMESTAMP | 创建时间 |
| updated_at | TIMESTAMP | 更新时间 |

### application

| 字段 | 类型 | 说明 |
|------|------|------|
| id | UUID | 主键 |
| user_id | UUID, FK | 关联用户 |
| company | VARCHAR(200) | 公司名称 |
| position | VARCHAR(200) | 岗位名称 |
| status | ENUM('draft','applied','screening','interview','offer','rejected') | 投递状态 |
| deadline | DATE | 截止日期 |
| applied_date | DATE | 投递日期 |
| next_step | TEXT | 下一步动作 |
| notes | TEXT | 备注 |
| resume_id | UUID, FK | 关联简历 |
| created_at | TIMESTAMP | 创建时间 |
| updated_at | TIMESTAMP | 更新时间 |

### task

| 字段 | 类型 | 说明 |
|------|------|------|
| id | UUID | 主键 |
| user_id | UUID, FK | 关联用户 |
| application_id | UUID, FK | 关联投递（可选） |
| title | VARCHAR(300) | 任务标题 |
| priority | ENUM('high','medium','low') | 优先级 |
| due_time | TIMESTAMP | 截止时间 |
| completed | BOOLEAN | 是否完成 |
| created_at | TIMESTAMP | 创建时间 |

## 测试策略

| 层级 | 工具 | 范围 |
|------|------|------|
| 单元测试 | pytest (后端) / Vitest (前端) | Service 层逻辑、工具函数 |
| 集成测试 | pytest + httpx.AsyncClient | API 端点、数据库交互 |
| E2E 测试 | Playwright | 核心用户流程：创建档案→生成简历→添加投递→管理任务 |
| AI 测试 | Mock LLM + 固定 prompt | Resume / Interview Agent 的确定性输出验证 |

### 测试原则
- 测试外部行为，而非实现细节
- 每个 Service 的核心方法需有单元测试覆盖
- API 端点需有集成测试验证正确状态码和响应结构
- E2E 测试覆盖 MVP 的 P0 功能路径

## 开发路线

### Phase 1 — MVP（当前阶段）

| 模块 | 前端 | 后端 | 状态 |
|------|------|------|------|
| 登录/注册 | NextAuth 页面 | JWT 认证 | 待开发 |
| Career Profile | 档案表单页 | Profile Service | 前端 ✅ |
| Dashboard | 工作台概览页 | — (静态) | 前端 ✅ |
| AI 简历生成 | 简历配置页 | Resume Service | 前端 ✅ |

### Phase 2 — 增强功能

| 模块 | 说明 |
|------|------|
| AI 网申助手 | 字段映射、一键复制 |
| Time Agent | 任务管理、日历提醒 |
| 日历集成 | 与 Google Calendar / 本地日历同步 |

### Phase 3 — 完整版

| 模块 | 说明 |
|------|------|
| AI 面试助手 | 模拟面试、评估、复盘 |
| Offer 管理 | Offer 对比、决策辅助 |
| 数据分析 | 投递漏斗、进度趋势 |

## 项目结构

```
Campus-Copilot/
├── frontend/
│   └── src/
│       ├── app/              # Next.js App Router 页面
│       │   ├── page.tsx      # Dashboard 工作台
│       │   ├── layout.tsx    # 根布局
│       │   ├── profile/      # 档案管理
│       │   ├── applications/ # 投递管理
│       │   ├── resume/       # 简历生成
│       │   ├── tasks/        # 任务管理
│       │   └── interviews/   # 面试准备
│       ├── components/       # 共享组件
│       ├── lib/              # 工具函数、API 客户端
│       └── types/            # TypeScript 类型定义
├── backend/
│   ├── app/
│   │   ├── main.py           # FastAPI 入口
│   │   ├── models/           # SQLAlchemy 模型
│   │   ├── schemas/          # Pydantic schemas
│   │   ├── services/         # 业务逻辑层
│   │   └── routes/           # API 路由
│   └── requirements.txt
└── docs/
```

## 比赛演示亮点

一句话输入目标 → AI 自动生成校招作战计划 → 定制简历 → 网申建议 → 每日任务 → 面试准备 → Offer 跟踪。

---

*文档版本：v2.0 — 优化了架构描述、API 设计、数据模型和测试策略*
