import { useEffect, useState, type SyntheticEvent } from "react";
import type { Product } from "../../types/product";
import {
  createProduct,
  deleteProduct,
  getAdminCategories,
  getAdminProducts,
  updateProduct,
  type Category,
  type ProductInput,
} from "../../services/admin";

const emptyForm: ProductInput = {
  name: "",
  description: "",
  price: 0,
  stock: 0,
  categoryId: "",
  images: [],
  active: true,
};

function getCategoryId(product: Product): string {
  return typeof product.categoryId === "string"
    ? product.categoryId
    : product.categoryId._id;
}

export function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [form, setForm] = useState<ProductInput>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function loadData() {
    setLoading(true);
    setError("");

    try {
      const [productResponse, categoryResponse] = await Promise.all([
        getAdminProducts(),
        getAdminCategories(),
      ]);

      setProducts(productResponse.data);
      setCategories(categoryResponse.data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Erro ao carregar os dados.",
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadData();
  }, []);

  function openCreateForm() {
    setEditingId(null);
    setForm(emptyForm);
    setShowForm(true);
    setError("");
    setSuccess("");
  }

  function openEditForm(product: Product) {
    setEditingId(product._id);
    setForm({
      name: product.name,
      description: product.description,
      price: product.price,
      stock: product.stock,
      categoryId: getCategoryId(product),
      images: product.images ?? [],
      active: product.active,
    });
    setShowForm(true);
    setError("");
    setSuccess("");
  }

  function updateField<K extends keyof ProductInput>(
    field: K,
    value: ProductInput[K],
  ) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  async function handleSubmit(event: SyntheticEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const payload: ProductInput = {
        ...form,
        price: Number(form.price),
        stock: Number(form.stock),
        images: form.images.filter((image) => image.trim() !== ""),
      };

      if (editingId) {
        await updateProduct(editingId, payload);
        setSuccess("Produto atualizado com sucesso.");
      } else {
        await createProduct(payload);
        setSuccess("Produto cadastrado com sucesso.");
      }

      setShowForm(false);
      setEditingId(null);
      setForm(emptyForm);
      await loadData();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Erro ao salvar o produto.",
      );
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    const confirmed = window.confirm(
      "Tem certeza de que deseja remover este produto?",
    );

    if (!confirmed) return;

    setError("");
    setSuccess("");

    try {
      await deleteProduct(id);
      setSuccess("Produto removido com sucesso.");
      await loadData();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Erro ao remover o produto.",
      );
    }
  }

  if (loading) {
    return <p>Carregando produtos...</p>;
  }

  return (
    <section>
      <div className="admin-page-header">
        <div>
          <h1>Produtos</h1>
          <p>Gerencie o catálogo da loja.</p>
        </div>

        <button onClick={openCreateForm}>Adicionar produto</button>
      </div>

      {error && <div className="admin-alert">{error}</div>}
      {success && <div className="admin-success">{success}</div>}

      {showForm && (
        <form className="admin-form" onSubmit={handleSubmit}>
          <h2>{editingId ? "Editar produto" : "Novo produto"}</h2>

          <label>
            Nome
            <input
              value={form.name}
              onChange={(e) => updateField("name", e.target.value)}
              minLength={2}
              maxLength={120}
              required
            />
          </label>

          <label>
            Descrição
            <textarea
              value={form.description}
              onChange={(e) => updateField("description", e.target.value)}
              required
            />
          </label>

          <div className="admin-form__grid">
            <label>
              Preço (R$)
              <input
                type="number"
                min="0"
                step="0.01"
                value={form.price}
                onChange={(e) => updateField("price", Number(e.target.value))}
                required
              />
            </label>

            <label>
              Estoque
              <input
                type="number"
                min="0"
                step="1"
                value={form.stock}
                onChange={(e) => updateField("stock", Number(e.target.value))}
                required
              />
            </label>
          </div>

          <label>
            Categoria
            <select
              value={form.categoryId}
              onChange={(e) => updateField("categoryId", e.target.value)}
              required
            >
              <option value="">Selecione uma categoria</option>

              {categories
                .filter((category) => category.active)
                .map((category) => (
                  <option key={category._id} value={category._id}>
                    {category.name}
                  </option>
                ))}
            </select>
          </label>

          <label>
            Imagens (uma URL por linha)
            <textarea
              value={form.images.join("\n")}
              onChange={(e) =>
                updateField(
                  "images",
                  e.target.value
                    .split("\n")
                    .map((image) => image.trim())
                    .filter(Boolean),
                )
              }
              placeholder="https://exemplo.com/imagem.jpg"
            />
          </label>

          <label className="admin-checkbox">
            <input
              type="checkbox"
              checked={form.active ?? true}
              onChange={(e) => updateField("active", e.target.checked)}
            />
            Produto ativo
          </label>

          <div className="admin-form__actions">
            <button type="submit" disabled={saving}>
              {saving ? "Salvando..." : "Salvar produto"}
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
              <th>Produto</th>
              <th>Preço</th>
              <th>Estoque</th>
              <th>Status</th>
              <th>Ações</th>
            </tr>
          </thead>

          <tbody>
            {products.map((product) => (
              <tr key={product._id}>
                <td>{product.name}</td>

                <td>
                  {product.price.toLocaleString("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  })}
                </td>

                <td>{product.stock}</td>

                <td>
                  <span
                    className={
                      product.active
                        ? "admin-status admin-status--active"
                        : "admin-status admin-status--inactive"
                    }
                  >
                    {product.active ? "Ativo" : "Inativo"}
                  </span>
                </td>

                <td className="admin-table__actions">
                  <button onClick={() => openEditForm(product)}>Editar</button>

                  <button
                    className="admin-delete-button"
                    onClick={() => handleDelete(product._id)}
                  >
                    Remover
                  </button>
                </td>
              </tr>
            ))}

            {products.length === 0 && (
              <tr>
                <td colSpan={5}>Nenhum produto cadastrado.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
