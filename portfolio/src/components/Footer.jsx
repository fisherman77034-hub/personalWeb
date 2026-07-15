import '../styles/global.css';

function Footer() {
  return (
    <footer className="footer" id="contact">
      <div className="footer-inner">
        <div className="footer-top">
          <div className="footer-brand">
            <span className="footer-logo">Feige</span>
            <p className="footer-tagline">用设计构建人与技术的桥梁。</p>
          </div>
          <div className="footer-cta">
            <p className="footer-cta-text">有项目合作？一起聊聊。</p>
            <a href="mailto:hello@feige.design" className="btn btn-primary btn-large">发送邮件</a>
          </div>
        </div>
        <div className="footer-divider" />
        <div className="footer-bottom">
          <span>© 2026 Feige. All rights reserved.</span>
          <div className="footer-socials">
            <a href="#" className="social-link">Dribbble</a>
            <a href="#" className="social-link">Behance</a>
            <a href="#" className="social-link">LinkedIn</a>
            <a href="#" className="social-link">GitHub</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
