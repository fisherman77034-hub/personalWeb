"""PDF 上传脚本 — 命令行直接上传简历到知识库（不走 HTTP 接口）"""
import sys
import os
from pathlib import Path

# 确保能导入项目模块
sys.path.insert(0, str(Path(__file__).resolve().parent))

from agent.pdf_parser import parse_pdf
from agent.core.knowledge_base import KnowledgeBase


def upload_pdf(file_path: str):
    """上传单个 PDF 文件到知识库"""
    pdf_path = Path(file_path)

    if not pdf_path.exists():
        print(f"[错误] 文件不存在: {pdf_path}")
        sys.exit(1)

    if not pdf_path.suffix.lower() == ".pdf":
        print(f"[错误] 仅支持 PDF 文件: {pdf_path.name}")
        sys.exit(1)

    print(f"[上传] {pdf_path.name} ...")

    try:
        # 解析 PDF
        text = parse_pdf(str(pdf_path))
        if not text.strip():
            print("[警告] PDF 内容为空")
            sys.exit(1)

        # 写入知识库
        kb = KnowledgeBase()
        chunk_ids = kb.add_document(pdf_path.name, text)

        print(f"[成功] 解析完成")
        print(f"  文件名: {pdf_path.name}")
        print(f"  解析片段数: {len(chunk_ids)}")
        print(f"  知识库总数: {kb.get_document_count()} 个文档")

    except Exception as e:
        print(f"[错误] {e}")
        sys.exit(1)


def upload_batch(folder_path: str):
    """批量上传文件夹下所有 PDF"""
    folder = Path(folder_path)
    if not folder.exists() or not folder.is_dir():
        print(f"[错误] 文件夹不存在: {folder}")
        sys.exit(1)

    pdf_files = sorted(folder.glob("*.pdf"))
    if not pdf_files:
        print(f"[提示] 文件夹中没有 PDF 文件: {folder}")
        sys.exit(0)

    print(f"[批量] 发现 {len(pdf_files)} 个 PDF 文件\n")

    kb = KnowledgeBase()
    for pdf in pdf_files:
        print(f"处理: {pdf.name}")
        try:
            text = parse_pdf(str(pdf))
            if text.strip():
                chunk_ids = kb.add_document(pdf.name, text)
                print(f"  -> {len(chunk_ids)} 个片段")
            else:
                print(f"  -> 内容为空，跳过")
        except Exception as e:
            print(f"  -> 错误: {e}")
        print()

    print(f"[完成] 知识库总计 {kb.get_document_count()} 个文档")


if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("用法:")
        print("  python upload.py <pdf文件路径>")
        print("  python upload.py <包含PDF的文件夹>")
        print("")
        print("示例:")
        print("  python upload.py resume.pdf")
        print("  python upload.py ./docs/")
        sys.exit(0)

    target = sys.argv[1]
    target_path = Path(target)

    if target_path.is_dir():
        upload_batch(target)
    else:
        upload_pdf(target)