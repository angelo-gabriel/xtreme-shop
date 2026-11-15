import { Link, NavLink } from "react-router-dom";

export function Header() {
  return (
    <header className="site-header">
      <div className="container header-content">
        <Link to="/" className="logo">
          XTREME<span>SHOP</span>
        </Link>

        <nav className="navigation">
          <NavLink to="/">Catálogo</NavLink>

          <NavLink to="/recently-viewed">Histórico</NavLink>
        </nav>
      </div>
    </header>
  );
}
