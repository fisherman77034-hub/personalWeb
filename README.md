 # 数字分身 Agent — HR 面试问答系统
 
 ## 概述
 
 这是一个基于大语言模型的 Web 服务，让 HR 或面试官可以通过网页向你提问，Agent 以你的口吻和专业风格自动回答。
 
 ## 核心功能
 
 - **PDF 知识导入**：上传简历/项目文档，Agent 自动解析并建立知识库
 - **HR 问答**：HR 通过网页提问，Agent 基于你的资料自动回答
 - **岗位推荐**：Agent 根据你的技能自动推荐适合的岗位
 - **正式专业风格**：回答风格像简历描述，专业严谨
 
 ## 快速开始
 
 ```bash
 # 1. 安装依赖
 pip install -r requirements.txt
 
 # 2. 配置环境变量
 cp .env.example .env
 # 编辑 .env 填入你的 DeepSeek API Key
 
 # 3. 启动 Web 服务
 python main.py
 
 # 4. 打开浏览器访问
 # http://localhost:8000
 ```
 
 ## 项目结构
 
 ```
 agent/
 ├── core/
 │   ├── llm_adapter.py    # LLM 适配器（DeepSeek/本地）
 │   └── knowledge_base.py # 知识库管理
 ├── pdf_parser.py         # PDF 解析器
 ├── main.py               # FastAPI 入口
 └── web/                  # 前端页面
     └── index.html        # 问答界面
 ```
 
 ## 技术栈
 
 - **LLM**: DeepSeek API
 - **Web**: FastAPI + Uvicorn
 - **PDF 解析**: PyMuPDF
 - **前端**: 原生 HTML/CSS/JS
