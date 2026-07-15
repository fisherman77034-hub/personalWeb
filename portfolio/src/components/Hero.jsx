import { useState, useEffect } from "react";
import "../styles/global.css";

function Hero() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 200);
    return () => clearTimeout(t);
  }, []);

  return (
    <section className="hero" id="hero">
      <div className="hero-bg">
        <div className="hero-orb orb-1" />
        <div className="hero-orb orb-2" />
        <div className="hero-orb orb-3" />
      </div>
      <div className="hero-content">
        <p className={visible ? "hero-eyebrow" : ""} style={{ opacity: visible ? 1 : 0 }}>
          视觉设计师 / AI 设计师 / 品牌设计师
        </p>
        <h1 className={visible ? "hero-title" : ""} style={{ opacity: visible ? 1 : 0, transitionDelay: "100ms" }}>
          Feige
        </h1>
        <p className={visible ? "hero-desc" : ""} style={{ opacity: visible ? 1 : 0, transitionDelay: "200ms" }}>
          用设计构建人与技术的桥梁，让每一个像素都有意义。
        </p>
        <div className={visible ? "hero-actions" : ""} style={{ opacity: visible ? 1 : 0, transitionDelay: "300ms" }}>
          <a href="#about" className="btn btn-primary">了解更多</a>
          <a href="#contact" className="btn btn-ghost">联系我</a>
        </div>
      </div>
      <div className="hero-scroll-indicator">
        <span>向下滚动</span>
        <div className="scroll-line" />
      </div>
    </section>
  );
}

export default Hero;
