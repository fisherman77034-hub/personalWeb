import { useState, useEffect, useRef } from "react";
import "../styles/global.css";

const skills = [
  {
    icon: "\u25C6",
    title: "品牌视觉设计",
    desc: "从品牌策略到视觉识别系统，打造一致且有记忆点的品牌形象。涵盖 Logo、VI、品牌指南、物料设计等。",
    tags: ["品牌识别", "VI 系统", "视觉规范", "物料延展"],
  },
  {
    icon: "\u25C7",
    title: "UI/UX 设计",
    desc: "以用户为中心的设计思维，从需求分析到高保真原型，覆盖 Web 和移动端产品全链路设计。",
    tags: ["产品设计", "交互原型", "用户研究", "设计系统"],
  },
  {
    icon: "\u25CB",
    title: "AI 生成艺术",
    desc: "运用 Midjourney、Stable Diffusion 等 AI 工具进行创意探索，将技术能力融入艺术表达。",
    tags: ["Midjourney", "SDXL", "ControlNet", "风格迁移"],
  },
  {
    icon: "\u25A1",
    title: "动效与 3D",
    desc: "用 After Effects 和 Blender 制作高品质动效和 3D 视觉，让设计更具表现力和沉浸感。",
    tags: ["AE 动效", "Blender", "Cinema 4D", "Lottie"],
  },
  {
    icon: "\u25B3",
    title: "前端开发",
    desc: "具备 React + Tailwind 前端实现能力，能将设计稿精准还原为高质量代码。",
    tags: ["React", "Tailwind", "Figma API", "像素级还原"],
  },
  {
    icon: "\u2606",
    title: "创意指导",
    desc: "带领团队完成大型项目的视觉方向把控，确保创意执行与品牌调性高度一致。",
    tags: ["创意策划", "团队协作", "项目管理", "设计评审"],
  },
];

function Skills() {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="skills" id="skills" ref={ref}>
      <div className="skills-inner">
        <div className={visible ? "skills-header" : ""} style={{ opacity: visible ? 1 : 0 }}>
          <p className="section-label">核心能力</p>
          <h2 className="section-title">我能为你做什么</h2>
        </div>
        <div className="skills-grid">
          {skills.map((s, i) => (
            <div
              key={i}
              className={visible ? "skill-card" : ""}
              style={{
                opacity: visible ? 1 : 0,
                transitionDelay: `${100 + i * 80}ms`,
              }}
            >
              <div className="skill-icon">{s.icon}</div>
              <h3 className="skill-title">{s.title}</h3>
              <p className="skill-desc">{s.desc}</p>
              <div className="skill-tags">
                {s.tags.map((t, j) => (
                  <span key={j} className="skill-tag">{t}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Skills;
