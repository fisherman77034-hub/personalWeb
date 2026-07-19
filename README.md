# 数字分身 Agent — HR 面试问答系统

## 概述

这是一个基于大语言模型的 Web 服务，让 HR 或面试官可以通过网页向你提问，Agent 以你的口吻和专业风格自动回答。

## 核心功能

- **PDF 知识导入**：上传简历/项目文档，Agent 自动解析并建立知识库
- **HR 问答**：HR 通过网页提问，Agent 基于你的资料自动回答
- **岗位推荐**：Agent 根据你的技能自动推荐适合的岗位
- **正式专业风格**：回答风格像简历描述，专业严谨

## 快速开始

### 1. 安装依赖

```bash
pip install -r requirements.txt
```

### 2. 配置环境变量

编辑 `.env` 文件，填入你的 DeepSeek API Key：

```env
DEEPSEEK_API_KEY=your_api_key_here
DEEPSEEK_BASE_URL=https://api.deepseek.com
WEB_PORT=8000
```

### 3. 上传 PDF 文档

**方式一：命令行上传（推荐）**

```bash
# 上传单个 PDF
python upload.py resume.pdf

# 批量上传文件夹下所有 PDF
python upload.py ./pdfs/
```

**方式二：后端 API 直接调用**

```bash
curl -X POST "http://localhost:8000/api/upload" ^
  -F "file=@resume.pdf"
```

### 4. 启动服务

```bash
python main.py
```

服务启动后访问：http://localhost:8000

## 项目结构

```
.
├── main.py              # FastAPI 入口
├── upload.py            # PDF 上传脚本
├── requirements.txt     # Python 依赖
├── .env                 # 环境变量配置
├── web/
│   └── index.html       # 前端页面
├── agent/
│   ├── config.py        # 配置管理
│   ├── pdf_parser.py    # PDF 解析
│   ├── responses.py     # 应答引擎
│   └── core/
│       ├── knowledge_base.py  # 知识库存储
│       └── llm_adapter.py     # LLM 适配器
└── data/
    ├── knowledge.json   # 知识库数据
    └── *.pdf            # 上传的 PDF 文件
```

## API 接口

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/` | 前端页面 |
| POST | `/api/upload` | 上传 PDF（仅后端） |
| POST | `/api/chat` | 发送问题，获取回答 |
| GET | `/api/recommend` | 获取岗位推荐 |
| GET | `/api/status` | 查看知识库状态 |
| POST | `/api/clear` | 清空知识库 |

## 注意事项

- PDF 上传仅通过后端 API 或 `upload.py` 脚本进行，前端页面不提供上传入口
- 知识库数据存储在 `data/knowledge.json`
- 首次使用前必须先上传至少一个 PDF 文档
