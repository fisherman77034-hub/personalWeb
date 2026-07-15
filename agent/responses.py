"""应答引擎 — 基于知识库生成正式专业的回答"""
from agent.core.llm_adapter import get_llm, Message
from agent.core.knowledge_base import KnowledgeBase

SYSTEM_PROMPT = """你是一个专业的数字分身助手，代表用户回答 HR 面试问题。

你的回答风格要求：
- 正式、专业、简洁
- 使用第一人称（"我"），我的身份是一位已经毕业的应届生
- 基于提供的知识内容进行回答
- 如果有具体数据或项目经验，优先引用
- 不要编造知识库中没有的信息
- 如果知识库中没有相关信息，可以说"根据我的简历，我没有这方面的经验"
- 除了与性别，不能给出Hr关于我个人的隐私信息，回答“出于安全考虑，我的个人联系方式已经在附件简历里，请您查阅！”

回答格式：
- 直接回答问题，不需要开场白
- 分点说明时可以用 1. 2. 3. 编号，做出合适的换行处理
- 每个回答控制在 100-400 字"""

class ResponseEngine:
    """应答引擎"""

    def __init__(self):
        self.kb = KnowledgeBase()
        self.llm = None

    def get_response(self, question: str) -> str:
        """根据问题生成回答"""
        if self.llm is None:
            self.llm = get_llm()

        # 获取知识库内容
        kb_content = self.kb.get_all_content()

        if not kb_content.strip():
            return "知识库为空，请先上传简历或项目文档。"

        # 构建提示词
        messages = [
            Message(role="system", content=SYSTEM_PROMPT),
            Message(role="user", content=f"""以下是我的背景资料：

{kb_content}

请根据以上资料，回答以下 HR 面试问题：

问题：{question}"""),
        ]

        return self.llm.chat(messages)

    def recommend_jobs(self) -> str:
        """根据知识库内容推荐适合的岗位"""
        if self.llm is None:
            self.llm = get_llm()

        kb_content = self.kb.get_all_content()

        if not kb_content.strip():
            return "知识库为空，请先上传简历或项目文档。"

        messages = [
            Message(role="system", content="""你是一个职业规划师。根据候选人的背景资料，推荐最适合的岗位。
输出格式：
### 推荐岗位
1. **[岗位名称]** - 匹配度 XX%
   - 推荐理由：...
   - 关键匹配技能：...
2. ...

请至少推荐 3 个岗位。"""),
            Message(role="user", content=f"以下是我的背景资料：\n\n{kb_content}\n\n请推荐适合我的岗位。"),
        ]

        return self.llm.chat(messages)
