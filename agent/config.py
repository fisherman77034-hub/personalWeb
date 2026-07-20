"""配置管理"""
import os
import secrets
from pathlib import Path
from dotenv import load_dotenv
from pydantic import BaseModel, Field

load_dotenv()


class Config(BaseModel):
    """应用配置 — 从环境变量加载，避免硬编码敏感信息"""
    deepseek_api_key: str = Field(default_factory=lambda: os.getenv("DEEPSEEK_API_KEY", ""))
    deepseek_base_url: str = Field(default_factory=lambda: os.getenv("DEEPSEEK_BASE_URL", "https://api.deepseek.com"))
    local_model_enabled: bool = Field(default_factory=lambda: os.getenv("LOCAL_MODEL_ENABLED", "false").lower() == "true")
    local_model_name: str = Field(default_factory=lambda: os.getenv("LOCAL_MODEL_NAME", "qwen2.5:latest"))
    local_model_base_url: str = Field(default_factory=lambda: os.getenv("LOCAL_MODEL_BASE_URL", "http://localhost:11434"))
    web_host: str = Field(default_factory=lambda: os.getenv("WEB_HOST", "127.0.0.1"))
    web_port: int = Field(default_factory=lambda: int(os.getenv("WEB_PORT", "8000")))
    admin_token: str = ""
    allowed_origins: str = ""
    data_dir: Path = Path("./data")
    api_request_timeout: float = 60.0

    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        # 如果 admin_token 仍未设置，生成一个随机令牌
        if not self.admin_token:
            self.admin_token = secrets.token_hex(32)
        self.data_dir.mkdir(parents=True, exist_ok=True)


config = Config()
