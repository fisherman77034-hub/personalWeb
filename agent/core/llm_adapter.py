"""LLM 适配器 — 统一对接 DeepSeek 和本地模型"""
from typing import List, Dict, Optional
from openai import OpenAI
from agent.config import config

class Message:
    def __init__(self, role: str, content: str):
        self.role = role
        self.content = content

    def to_dict(self) -> Dict:
        return {"role": self.role, "content": self.content}

class LLMAdapter:
    def __init__(self, base_url: str, api_key: str, model: str):
        self.client = OpenAI(api_key=api_key, base_url=base_url)
        self.model = model

    def chat(self, messages: List[Message]) -> str:
        api_messages = [m.to_dict() for m in messages]
        resp = self.client.chat.completions.create(
            model=self.model,
            messages=api_messages,
            temperature=0.5,
            max_tokens=2048,
        )
        return resp.choices[0].message.content

def get_deepseek_client() -> LLMAdapter:
    return LLMAdapter(
        base_url=config.deepseek_base_url,
        api_key=config.deepseek_api_key,
        model="deepseek-chat",
    )

def get_local_client() -> LLMAdapter:
    return LLMAdapter(
        base_url=config.local_model_base_url,
        api_key="not-needed",
        model=config.local_model_name,
    )

def get_llm() -> LLMAdapter:
    if config.local_model_enabled:
        return get_local_client()
    return get_deepseek_client()
