"""知识库管理 — 存储从 PDF 提取的知识"""
import json
from pathlib import Path
from typing import List, Dict, Optional
from datetime import datetime
from agent.config import config

class KnowledgeBase:
    """知识库"""

    def __init__(self):
        self.storage_file = config.data_dir / "knowledge.json"
        self._ensure_file()

    def _ensure_file(self):
        if not self.storage_file.exists():
            self.storage_file.write_text(
                json.dumps({"entries": []}, ensure_ascii=False),
                encoding="utf-8"
            )

    def _load(self) -> dict:
        return json.loads(self.storage_file.read_text(encoding="utf-8"))

    def _save(self, data: dict):
        self.storage_file.write_text(
            json.dumps(data, indent=2, ensure_ascii=False),
            encoding="utf-8"
        )

    def add_document(self, filename: str, content: str, chunk_size: int = 500) -> List[str]:
        """添加文档内容到知识库，返回所有 chunk ID"""
        chunks = self._chunk_content(content, chunk_size)
        kb = self._load()
        chunk_ids = []

        for i, chunk in enumerate(chunks):
            chunk_id = f"{filename}_chunk_{i}"
            entry = {
                "id": chunk_id,
                "source": filename,
                "content": chunk,
                "added_at": datetime.now().isoformat(),
            }
            kb["entries"].append(entry)
            chunk_ids.append(chunk_id)

        self._save(kb)
        return chunk_ids

    def _chunk_content(self, content: str, chunk_size: int) -> List[str]:
        """将长文本切分为 chunks"""
        if len(content) <= chunk_size:
            return [content] if content.strip() else []

        chunks = []
        start = 0
        while start < len(content):
            end = start + chunk_size
            chunk = content[start:end]
            # 尽量在句子边界切断
            for sep in ["。", ".", "\n\n", "\n"]:
                if sep in chunk:
                    last_sep = chunk.rfind(sep)
                    chunk = chunk[:last_sep + len(sep)]
                    break
            chunks.append(chunk.strip())
            start += len(chunk)

        return chunks if chunks else [content]

    def get_all_content(self) -> str:
        """获取知识库全部内容（用于构建系统提示）"""
        kb = self._load()
        contents = [entry["content"] for entry in kb["entries"]]
        return "\n\n".join(contents)

    def get_document_count(self) -> int:
        """获取文档数量"""
        kb = self._load()
        sources = set(entry["source"] for entry in kb["entries"])
        return len(sources)

    def clear(self):
        """清空知识库"""
        self._save({"entries": []})

    def list_documents(self) -> List[Dict]:
        """列出所有文档"""
        kb = self._load()
        sources = {}
        for entry in kb["entries"]:
            src = entry["source"]
            if src not in sources:
                sources[src] = {
                    "filename": src,
                    "chunks": 0,
                    "added_at": entry["added_at"],
                }
            sources[src]["chunks"] += 1
        return list(sources.values())
