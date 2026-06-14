import json
from abc import ABC, abstractmethod
from typing import Any

import httpx

from app.config import settings


class LLMAdapter(ABC):
    @abstractmethod
    def generate(self, prompt: str, system_prompt: str | None = None) -> str: ...

    def generate_json(self, prompt: str, system_prompt: str | None = None) -> dict[str, Any]:
        result = self.generate(prompt, system_prompt)
        cleaned = result.strip()
        if cleaned.startswith("```"):
            cleaned = cleaned.split("\n", 1)[-1]
            cleaned = cleaned.rsplit("```", 1)[0]
        return json.loads(cleaned)


class MockLLM(LLMAdapter):
    def generate(self, prompt: str, system_prompt: str | None = None) -> str:
        return json.dumps({
            "personalInfo": {"name": "张三", "email": "zhangsan@example.com", "phone": "138-0000-0000"},
            "summary": "计算机科学专业毕业生，具备扎实的编程基础。熟悉 React、Node.js、Python 等主流技术栈。",
            "skills": ["JavaScript", "TypeScript", "React", "Node.js", "Python", "Docker"],
            "education": [{"school": "示例大学", "degree": "本科", "major": "计算机科学与技术", "startDate": "2020-09", "endDate": "2024-06"}],
            "experience": [{"company": "示例科技", "position": "前端开发实习生", "description": "参与核心产品前端架构设计，使用 React + TypeScript 重构用户管理模块，性能提升 40%。", "startDate": "2023-06", "endDate": "2023-09"}],
            "projects": [{"name": "在线协作白板", "role": "核心开发者", "description": "基于 React + Canvas 实现多人实时协作白板。", "techStack": ["React", "Canvas", "WebSocket"]}],
        })


class OpenAICompatibleLLM(LLMAdapter):
    def __init__(self, api_key: str, base_url: str, model: str):
        self.api_key = api_key
        self.base_url = base_url.rstrip("/")
        self.model = model
        self.client = httpx.Client(timeout=60)

    def generate(self, prompt: str, system_prompt: str | None = None) -> str:
        messages = []
        if system_prompt:
            messages.append({"role": "system", "content": system_prompt})
        messages.append({"role": "user", "content": prompt})

        resp = self.client.post(
            f"{self.base_url}/chat/completions",
            json={"model": self.model, "messages": messages, "temperature": 0.7},
            headers={"Authorization": f"Bearer {self.api_key}"},
        )
        resp.raise_for_status()
        return resp.json()["choices"][0]["message"]["content"]


def get_llm() -> LLMAdapter:
    provider = settings.LLM_PROVIDER or "mock"
    if provider == "mock":
        return MockLLM()
    return OpenAICompatibleLLM(
        api_key=settings.LLM_API_KEY or "",
        base_url=settings.LLM_BASE_URL or "https://api.openai.com/v1",
        model=settings.LLM_MODEL or "gpt-4o-mini",
    )
