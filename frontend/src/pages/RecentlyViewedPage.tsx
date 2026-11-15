import { useQuery } from "@tanstack/react-query";

import { ProductCard } from "../components/products/ProductCard";
import { getRecentlyViewedProducts } from "../services/products";

export function RecentlyViewedPage() {
  const {
    data: products,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["recently-viewed"],
    queryFn: getRecentlyViewedProducts,
  });

  if (isLoading) {
    return <main className="container">Carregando histórico...</main>;
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
      <h1>Produtos visualizados recentemente</h1>

      <p>Aqui estão os últimos produtos que você consultou.</p>

      {!products?.length ? (
        <p>Você ainda não visualizou nenhum produto.</p>
      ) : (
        <section className="product-grid">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </section>
      )}
    </main>
  );
}
