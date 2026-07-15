import { useState, useEffect, useRef } from 'react';
import '../styles/global.css';

function About() {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.15 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const stats = [
    { value: '5+', label: '年设计经验' },
    { value: '50+', label: '完成项目' },
    { value: '30+', label: '合作客户' },
    { value: '12', label: 'AI 作品获奖' },
  ];

  return (
    <section className="about" id="about" ref={ref}>
      <div className="about-inner">
        <div className={visible ? 'fade-left' : ''} style={{ opacity: visible ? 1 : 0 }}>
          <div className="avatar-ring">
            <div className="avatar-placeholder">F</div>
          </div>
        </div>
        <div className={visible ? 'fade-right' : ''} style={{ opacity: visible ? 1 : 0 }}>
          <p className="section-label">关于我</p>
          <h2 className="about-title">
            设计是我的语言，<br />
            AI 是我的画笔。
          </h2>
          <p className="about-desc">
            我是 Feige，一名视觉设计师兼 AI 设计师，专注于品牌视觉、UI/UX 设计和生成式 AI 创作。
            我相信好的设计不只是好看，更要解决问题、传递价值。过去五年里，我服务过多家初创公司和科技企业，
            从品牌识别到产品界面，从静态视觉到动态体验，力求在每个项目中做到极致。
          </p>
          <div className="about-contact">
            <div className="contact-item">
              <span className="contact-label">邮箱</span>
              <a href="mailto:hello@feige.design" className="contact-value">hello@feige.design</a>
            </div>
            <div className="contact-item">
              <span className="contact-label">微信</span>
              <span className="contact-value">feige_design</span>
            </div>
            <div className="contact-item">
              <span className="contact-label">所在地</span>
              <span className="contact-value">中国 · 上海</span>
            </div>
          </div>
        </div>
      </div>
      <div className={visible ? 'fade-up' : ''} style={{ opacity: visible ? 1 : 0, transitionDelay: '200ms' }}>
        {stats.map((s, i) => (
          <div key={i} className="stat-card">
            <span className="stat-value">{s.value}</span>
            <span className="stat-label">{s.label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

export default About;
