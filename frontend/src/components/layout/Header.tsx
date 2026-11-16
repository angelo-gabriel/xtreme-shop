import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

export function Header() {
  const { isAdmin } = useAuth();

  const adminPath = isAdmin ? "/admin/products" : "/admin/login";

  return (
    <header className="site-header">
      <div className="container header-content">
        <Link to="/" className="logo">
          XTREME<span>SHOP</span>
        </Link>

        <nav className="navigation">
          <NavLink to="/">Catálogo</NavLink>

          <NavLink to="/recently-viewed">Histórico</NavLink>

          <Link to={adminPath} className="admin-link">
            Painel administrativo
          </Link>
        </nav>
      </div>
    </header>
  );
}
