"""PDF 解析器"""
import fitz  # PyMuPDF
from pathlib import Path
from typing import Optional

def parse_pdf(pdf_path: str) -> str:
    """解析 PDF 文件并返回纯文本内容"""
    doc = fitz.open(pdf_path)
    text_parts = []

    for page_num in range(len(doc)):
        page = doc[page_num]
        text = page.get_text()
        if text.strip():
            text_parts.append(f"--- 第 {page_num + 1} 页 ---\n{text}")

    doc.close()
    return "\n\n".join(text_parts)

def parse_pdf_to_chunks(pdf_path: str, chunk_size: int = 500) -> list:
    """解析 PDF 并直接返回 chunks"""
    text = parse_pdf(pdf_path)
    chunks = []
    start = 0
    while start < len(text):
        end = start + chunk_size
        chunk = text[start:end]
        for sep in ["。", ".", "\n\n", "\n"]:
            if sep in chunk:
                last_sep = chunk.rfind(sep)
                chunk = chunk[:last_sep + len(sep)]
                break
        chunks.append(chunk.strip())
        start += end - start + chunk_size // 2
    return chunks if chunks else [text]
