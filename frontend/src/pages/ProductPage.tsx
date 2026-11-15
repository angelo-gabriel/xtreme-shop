import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

import { getProductById } from "../services/products";

const currencyFormatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

export function ProductPage() {
  const { id } = useParams<{ id: string }>();

  const {
    data: product,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["product", id],
    queryFn: () => getProductById(id!),
    enabled: Boolean(id),
  });

  if (isLoading) {
    return <main className="container">Carregando produto...</main>;
  }

  if (isError) {
    return (
      <main className="container">
        <p className="error-message">{error.message}</p>
        <Link to="/">Voltar ao catálogo</Link>
      </main>
    );
  }

  if (!product) {
    return <main className="container">Produto não encontrado.</main>;
  }

  return (
    <main className="container product-detail">
      <Link to="/" className="back-link">
        ← Voltar ao catálogo
      </Link>

      <div className="product-detail-content">
        <div className="product-detail-image">
          {product.images[0] ? (
            <img src={product.images[0]} alt={product.name} />
          ) : (
            <div className="product-image-placeholder">Sem imagem</div>
          )}
        </div>

        <div className="product-detail-info">
          <span className="product-category">
            {product.categoryId?.name ?? "Sem categoria"}
          </span>

          <h1>{product.name}</h1>

          <p className="product-description">{product.description}</p>

          <strong className="detail-price">
            {currencyFormatter.format(product.price)}
          </strong>

          <p>
            {product.stock > 0
              ? `${product.stock} unidades disponíveis`
              : "Produto indisponível"}
          </p>
        </div>
      </div>
    </main>
  );
}
