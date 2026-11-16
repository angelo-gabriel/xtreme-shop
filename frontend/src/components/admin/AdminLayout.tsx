import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

export function AdminLayout() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  async function handleSignOut() {
    await signOut();
    navigate("/admin/login", { replace: true });
  }

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <h2>Xtreme Shop</h2>
        <span className="admin-sidebar__subtitle">Administração</span>

        <nav>
          <NavLink to="/admin" end>
            Visão geral
          </NavLink>

          <NavLink to="/admin/products">Produtos</NavLink>

          <NavLink to="/admin/categories">Categorias</NavLink>
        </nav>

        <div className="admin-sidebar__footer">
          <span>{user?.email}</span>
          <button onClick={handleSignOut}>Sair</button>
        </div>
      </aside>

      <main className="admin-content">
        <Outlet />
      </main>
    </div>
  );
}
