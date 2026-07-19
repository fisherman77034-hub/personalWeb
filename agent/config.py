"""配置管理"""
import os
from pathlib import Path
from dotenv import load_dotenv
from pydantic import BaseModel

load_dotenv()

class Config(BaseModel):
    deepseek_api_key: str = os.getenv("DEEPSEEK_API_KEY", "")
    deepseek_base_url: str = os.getenv("DEEPSEEK_BASE_URL", "https://api.deepseek.com")
    local_model_enabled: bool = os.getenv("LOCAL_MODEL_ENABLED", "false").lower() == "true"
    local_model_name: str = os.getenv("LOCAL_MODEL_NAME", "qwen2.5:latest")
    local_model_base_url: str = os.getenv("LOCAL_MODEL_BASE_URL", "http://localhost:11434")
    web_host: str = os.getenv("WEB_HOST", "127.0.0.1")
    web_port: int = int(os.getenv("WEB_PORT", "8000"))
    admin_token: str = os.getenv("ADMIN_TOKEN", "admin-secret-token")
    data_dir: Path = Path("./data")

    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        self.data_dir.mkdir(parents=True, exist_ok=True)

config = Config()