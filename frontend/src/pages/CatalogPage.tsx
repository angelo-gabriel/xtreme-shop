import { useState } from "react";
import { useQuery } from "@tanstack/react-query";

import { ProductCard } from "../components/products/ProductCard";
import { getProducts } from "../services/products";

export function CatalogPage() {
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("newest");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [page, setPage] = useState(1);

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["products", { search, sort, minPrice, maxPrice, page }],
    queryFn: () =>
      getProducts({
        page,
        limit: 12,
        search: search || undefined,
        sort: sort as
          | "newest"
          | "oldest"
          | "price_asc"
          | "price_desc"
          | "name_asc",
        minPrice: minPrice ? Number(minPrice) : undefined,
        maxPrice: maxPrice ? Number(maxPrice) : undefined,
      }),
  });

  function resetPage() {
    setPage(1);
  }

  if (isLoading) {
    return <main className="container">Carregando produtos...</main>;
  }

  if (isError) {
    return (
      <main className="container">
        <p className="error-message">{error.message}</p>
      </main>
    );
  }

  return (
    <main className="container catalog">
      <section className="catalog-heading">
        <div>
          <h1>Catálogo de produtos</h1>
          <p>Encontre os produtos que você procura.</p>
        </div>
      </section>

      <section className="filters">
        <input
          type="search"
          placeholder="Pesquisar produtos..."
          value={search}
          onChange={(event) => {
            setSearch(event.target.value);
            resetPage();
          }}
        />

        <input
          type="number"
          min="0"
          placeholder="Preço mínimo"
          value={minPrice}
          onChange={(event) => {
            setMinPrice(event.target.value);
            resetPage();
          }}
        />

        <input
          type="number"
          min="0"
          placeholder="Preço máximo"
          value={maxPrice}
          onChange={(event) => {
            setMaxPrice(event.target.value);
            resetPage();
          }}
        />

        <select
          value={sort}
          onChange={(event) => {
            setSort(event.target.value);
            resetPage();
          }}
        >
          <option value="newest">Mais recentes</option>
          <option value="oldest">Mais antigos</option>
          <option value="price_asc">Menor preço</option>
          <option value="price_desc">Maior preço</option>
          <option value="name_asc">Nome (A-Z)</option>
        </select>
      </section>

      {data?.data.length === 0 ? (
        <p>Nenhum produto encontrado.</p>
      ) : (
        <section className="product-grid">
          {data?.data.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </section>
      )}

      {data && data.pagination.totalPages > 1 && (
        <div className="pagination">
          <button
            disabled={page <= 1}
            onClick={() => setPage((current) => current - 1)}
          >
            Anterior
          </button>

          <span>
            Página {data.pagination.page} de {data.pagination.totalPages}
          </span>

          <button
            disabled={page >= data.pagination.totalPages}
            onClick={() => setPage((current) => current + 1)}
          >
            Próxima
          </button>
        </div>
      )}
    </main>
  );
}
