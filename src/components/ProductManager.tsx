import { useState } from "react";
import { useProducts } from "../hooks/useProducts";
import type { Product } from "../hooks/useProducts";
import "./ProductManager.css";

const PLACEHOLDER = "https://via.placeholder.com/60x60?text=No+Image";

const EMPTY_FORM = {
  title: "",
  price: "",
  category: "",
  description: "",
  image: "",
  rating: { rate: 0, count: 0 },
};

interface Props {
  setPage: (page: string) => void;
}

export default function ProductManager({ setPage }: Props) {
  const { products, loading, addProduct, updateProduct, deleteProduct } =
    useProducts("all");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleEdit = (product: Product) => {
    setEditingId(product.id);
    setForm({
      title: product.title,
      price: String(product.price),
      category: product.category,
      description: product.description,
      image: product.image,
      rating: product.rating,
    });
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingId(null);
    setForm(EMPTY_FORM);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const productData = {
      title: form.title,
      price: parseFloat(form.price),
      category: form.category,
      description: form.description,
      image: form.image,
      rating: form.rating,
    };

    if (editingId) {
      await updateProduct(editingId, productData);
    } else {
      await addProduct(productData);
    }

    setSaving(false);
    handleCancel();
  };

  const handleDelete = async (id: string, title: string) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${title}"?`
    );
    if (confirmed) await deleteProduct(id);
  };

  return (
    <main className="pm-page">
      <div className="pm-container">
        <div className="pm-header">
          <div>
            <h1 className="pm-title">Product Manager</h1>
            <p className="pm-sub">{products.length} products in store</p>
          </div>
          <div className="pm-header-actions">
            <button className="pm-back-btn" onClick={() => setPage("home")}>
              ← Back to shop
            </button>
            {!showForm && (
              <button className="pm-add-btn" onClick={() => setShowForm(true)}>
                + Add product
              </button>
            )}
          </div>
        </div>

        {showForm && (
          <form className="pm-form" onSubmit={handleSubmit}>
            <h2 className="pm-form__title">
              {editingId ? "Edit Product" : "New Product"}
            </h2>

            <div className="pm-form__grid">
              <div className="form-group">
                <label>Title</label>
                <input
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  placeholder="Product title"
                  required
                />
              </div>

              <div className="form-group">
                <label>Price</label>
                <input
                  name="price"
                  type="number"
                  step="0.01"
                  value={form.price}
                  onChange={handleChange}
                  placeholder="0.00"
                  required
                />
              </div>

              <div className="form-group">
                <label>Category</label>
                <input
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  placeholder="e.g. electronics"
                  required
                />
              </div>

              <div className="form-group">
                <label>Image URL</label>
                <input
                  name="image"
                  value={form.image}
                  onChange={handleChange}
                  placeholder="https://..."
                />
              </div>

              <div className="form-group form-group--full">
                <label>Description</label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  placeholder="Product description"
                  rows={3}
                  required
                />
              </div>
            </div>

            <div className="pm-form__actions">
              <button
                type="button"
                className="pm-cancel-btn"
                onClick={handleCancel}
              >
                Cancel
              </button>
              <button type="submit" className="pm-save-btn" disabled={saving}>
                {saving ? "Saving..." : editingId ? "Save changes" : "Add product"}
              </button>
            </div>
          </form>
        )}

        {loading ? (
          <div className="pm-loading">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="pm-skeleton" />
            ))}
          </div>
        ) : (
          <div className="pm-list">
            {products.map((product) => (
              <div key={product.id} className="pm-item">
                <div className="pm-item__img-wrap">
                  <img
                    src={product.image}
                    alt={product.title}
                    className="pm-item__img"
                    onError={(e) => {
                      e.currentTarget.src = PLACEHOLDER;
                    }}
                  />
                </div>
                <div className="pm-item__info">
                  <h3 className="pm-item__title">{product.title}</h3>
                  <p className="pm-item__meta">
                    {product.category} · ${product.price.toFixed(2)}
                  </p>
                </div>
                <div className="pm-item__actions">
                  <button
                    className="pm-edit-btn"
                    onClick={() => handleEdit(product)}
                  >
                    Edit
                  </button>
                  <button
                    className="pm-delete-btn"
                    onClick={() => handleDelete(product.id, product.title)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}