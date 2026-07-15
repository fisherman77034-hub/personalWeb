"""FastAPI 入口 — Web 服务"""
import os
from pathlib import Path
from fastapi import FastAPI, UploadFile, File, Form
from fastapi.responses import HTMLResponse, JSONResponse
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from agent.pdf_parser import parse_pdf
from agent.core.knowledge_base import KnowledgeBase
from agent.responses import ResponseEngine
from agent.config import config


app = FastAPI(title="数字分身 Agent")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

kb = KnowledgeBase()
engine = ResponseEngine()

# 静态文件
web_dir = Path(__file__).parent / "web"
web_dir.mkdir(exist_ok=True)
app.mount("/static", StaticFiles(directory=str(web_dir)), name="static")

@app.get("/", response_class=HTMLResponse)
def index():
    return (web_dir / "index.html").read_text(encoding="utf-8")

@app.post("/api/upload")
async def upload_pdf(file: UploadFile = File(...)):
    """上传 PDF 文件"""
    if not file.filename.endswith(".pdf"):
        return JSONResponse({"error": "仅支持 PDF 文件"}, status_code=400)

    # 保存文件
    save_path = config.data_dir / file.filename
    content = await file.read()
    save_path.write_bytes(content)

    # 解析并入库
    text = parse_pdf(str(save_path))
    chunk_ids = kb.add_document(file.filename, text)

    return JSONResponse({
        "message": f"成功上传 {file.filename}",
        "chunks": len(chunk_ids),
        "total_docs": kb.get_document_count(),
    })

@app.post("/api/chat")
async def chat(question: str = Form(...)):
    """回答 HR 问题"""
    response = engine.get_response(question)
    return JSONResponse({"answer": response})

@app.get("/api/recommend")
def recommend():
    """推荐岗位"""
    jobs = engine.recommend_jobs()
    return JSONResponse({"jobs": jobs})

@app.get("/api/status")
def status():
    """知识库状态"""
    docs = kb.list_documents()
    return JSONResponse({
        "document_count": kb.get_document_count(),
        "documents": docs,
    })

@app.post("/api/clear")
def clear_kb():
    """清空知识库"""
    kb.clear()
    return JSONResponse({"message": "知识库已清空"})

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host=config.web_host, port=config.web_port)
