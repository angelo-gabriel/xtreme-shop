import { useEffect, useState, type SyntheticEvent } from "react";
import {
  createCategory,
  deleteCategory,
  getAdminCategories,
  updateCategory,
  type Category,
  type CategoryInput,
} from "../../services/admin";

const emptyForm: CategoryInput = {
  name: "",
  description: "",
  active: true,
};

export function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [form, setForm] = useState<CategoryInput>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function loadCategories() {
    setLoading(true);
    setError("");

    try {
      const response = await getAdminCategories();
      setCategories(response.data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Erro ao carregar categorias.",
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadCategories();
  }, []);

  function openCreateForm() {
    setEditingId(null);
    setForm(emptyForm);
    setShowForm(true);
    setError("");
    setSuccess("");
  }

  function openEditForm(category: Category) {
    setEditingId(category._id);
    setForm({
      name: category.name,
      description: category.description ?? "",
      active: category.active,
    });
    setShowForm(true);
    setError("");
    setSuccess("");
  }

  async function handleSubmit(event: SyntheticEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");

    try {
      if (editingId) {
        await updateCategory(editingId, form);
        setSuccess("Categoria atualizada com sucesso.");
      } else {
        await createCategory(form);
        setSuccess("Categoria cadastrada com sucesso.");
      }

      setShowForm(false);
      setEditingId(null);
      setForm(emptyForm);
      await loadCategories();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Erro ao salvar a categoria.",
      );
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    const confirmed = window.confirm(
      "Tem certeza de que deseja remover esta categoria?",
    );

    if (!confirmed) return;

    setError("");
    setSuccess("");

    try {
      await deleteCategory(id);
      setSuccess("Categoria removida com sucesso.");
      await loadCategories();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Erro ao remover a categoria.",
      );
    }
  }

  if (loading) {
    return <p>Carregando categorias...</p>;
  }

  return (
    <section>
      <div className="admin-page-header">
        <div>
          <h1>Categorias</h1>
          <p>Organize os produtos da loja.</p>
        </div>

        <button onClick={openCreateForm}>Adicionar categoria</button>
      </div>

      {error && <div className="admin-alert">{error}</div>}
      {success && <div className="admin-success">{success}</div>}

      {showForm && (
        <form className="admin-form" onSubmit={handleSubmit}>
          <h2>{editingId ? "Editar categoria" : "Nova categoria"}</h2>

          <label>
            Nome
            <input
              value={form.name}
              onChange={(e) =>
                setForm((current) => ({ ...current, name: e.target.value }))
              }
              minLength={2}
              maxLength={100}
              required
            />
          </label>

          <label>
            Descrição
            <textarea
              value={form.description ?? ""}
              onChange={(e) =>
                setForm((current) => ({
                  ...current,
                  description: e.target.value,
                }))
              }
              maxLength={500}
            />
          </label>

          <label className="admin-checkbox">
            <input
              type="checkbox"
              checked={form.active ?? true}
              onChange={(e) =>
                setForm((current) => ({
                  ...current,
                  active: e.target.checked,
                }))
              }
            />
            Categoria ativa
          </label>

          <div className="admin-form__actions">
            <button type="submit" disabled={saving}>
              {saving ? "Salvando..." : "Salvar categoria"}
            </button>

            <button
              type="button"
              className="admin-button-secondary"
              onClick={() => setShowForm(false)}
            >
              Cancelar
            </button>
          </div>
        </form>
      )}

      <div className="admin-table-wrapper">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Nome</th>
              <th>Slug</th>
              <th>Status</th>
              <th>Ações</th>
            </tr>
          </thead>

          <tbody>
            {categories.map((category) => (
              <tr key={category._id}>
                <td>{category.name}</td>
                <td>{category.slug}</td>

                <td>
                  <span
                    className={
                      category.active
                        ? "admin-status admin-status--active"
                        : "admin-status admin-status--inactive"
                    }
                  >
                    {category.active ? "Ativa" : "Inativa"}
                  </span>
                </td>

                <td className="admin-table__actions">
                  <button onClick={() => openEditForm(category)}>Editar</button>

                  <button
                    className="admin-delete-button"
                    onClick={() => handleDelete(category._id)}
                  >
                    Remover
                  </button>
                </td>
              </tr>
            ))}

            {categories.length === 0 && (
              <tr>
                <td colSpan={4}>Nenhuma categoria cadastrada.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
