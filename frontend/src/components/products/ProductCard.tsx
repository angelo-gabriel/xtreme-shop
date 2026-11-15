import { Link } from "react-router-dom";
import type { Product } from "../../types/product";

interface ProductCardProps {
  product: Product;
}

const currencyFormatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

export function ProductCard({ product }: ProductCardProps) {
  const image = product.images[0];

  return (
    <article className="product-card">
      <Link to={`/products/${product._id}`} className="product-image-link">
        {image ? (
          <img src={image} alt={product.name} className="product-image" />
        ) : (
          <div className="product-image-placeholder">Sem imagem</div>
        )}
      </Link>

      <div className="product-info">
        <span className="product-category">
          {product.categoryId?.name ?? "Sem categoria"}
        </span>

        <Link to={`/products/${product._id}`} className="product-name">
          {product.name}
        </Link>

        <strong className="product-price">
          {currencyFormatter.format(product.price)}
        </strong>

        <span className="product-stock">
          {product.stock > 0
            ? `${product.stock} unidades disponíveis`
            : "Produto indisponível"}
        </span>
      </div>
    </article>
  );
}
