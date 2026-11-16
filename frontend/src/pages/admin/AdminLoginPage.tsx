import { useState, type SyntheticEvent } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

export function AdminLoginPage() {
  const { signIn, isAdmin, loading } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (!loading && isAdmin) {
    return <Navigate to="/admin" replace />;
  }

  async function handleSubmit(event: SyntheticEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      await signIn(email, password);
      navigate("/admin", { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao realizar login.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="admin-login">
      <form className="admin-login__form" onSubmit={handleSubmit}>
        <h1>Painel administrativo</h1>
        <p>Entre com sua conta administrativa.</p>

        {error && <div className="admin-alert">{error}</div>}

        <label htmlFor="email">E-mail</label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
        />

        <label htmlFor="password">Senha</label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          required
        />

        <button type="submit" disabled={submitting}>
          {submitting ? "Entrando..." : "Entrar"}
        </button>

        <Link to="/">Voltar à loja</Link>
      </form>
    </main>
  );
}
