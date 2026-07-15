import { useState, useEffect } from 'react';
import '../styles/global.css';

function Nav() {
  const [menuOpen, setMenuOpen] = useState(false);

  const links = [
    { label: '关于', href: '#about' },
    { label: '能力', href: '#skills' },
    { label: '联系', href: '#contact' },
  ];

  return (
    <nav className="nav" id="nav">
      <div className="nav-inner">
        <a href="#" className="nav-logo">Feige</a>
        <div className="nav-links">
          {links.map(l => (
            <a key={l.href} href={l.href}>{l.label}</a>
          ))}
        </div>
        <button className="nav-menu-btn" onClick={() => setMenuOpen(!menuOpen)}>
          <span className="nav-menu-icon" />
        </button>
      </div>
      {menuOpen && (
        <div className="nav-mobile">
          {links.map(l => (
            <a key={l.href} href={l.href} onClick={() => setMenuOpen(false)}>{l.label}</a>
          ))}
        </div>
      )}
    </nav>
  );
}

export default Nav;
