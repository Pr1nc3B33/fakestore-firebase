import { useState } from "react";
import { useCategories } from "../hooks/useApi";
import { useProducts } from "../hooks/useProducts";
import ProductCard from "./ProductCard";
import "./Home.css";

export default function Home() {
  const [category, setCategory] = useState("all");
  const { data: categories, isLoading: catsLoading } = useCategories();
  const { products, loading: prodsLoading, error, refetch } = useProducts(category);

  return (
    <main className="home">
      <section className="home__hero">
        <h1 className="home__headline">Shop Everything</h1>
        <p className="home__sub">Discover our curated collection across all categories.</p>
      </section>

      <div className="home__toolbar">
        <div className="category-select-wrap">
          <label htmlFor="category-select" className="category-label">
            Browse by category
          </label>
          <select
            id="category-select"
            className="category-select"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            disabled={catsLoading}
          >
            <option value="all">All Products</option>
            {categories?.map((cat) => (
              <option key={cat} value={cat}>
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </option>
            ))}
          </select>
        </div>

        <div className="home__toolbar-right">
          {!prodsLoading && !error && (
            <p className="home__count">
              {products?.length ?? 0} product{products?.length !== 1 ? "s" : ""}
            </p>
          )}
        </div>
      </div>

      {prodsLoading && (
        <div className="loading-grid">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="skeleton-card" />
          ))}
        </div>
      )}

      {error && (
        <div className="error-msg">
          <span>⚠️</span>
          <span>Failed to load products.</span>
          <button className="retry-btn" onClick={() => refetch()}>
            Try again
          </button>
        </div>
      )}

      {!prodsLoading && !error && (
        <div className="product-grid">
          {products?.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </main>
  );
}