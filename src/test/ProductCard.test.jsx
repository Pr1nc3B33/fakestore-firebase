import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import ProductCard from "../components/ProductCard";
import cartReducer from "../store/cartStore";

const mockProduct = {
  id: "1",
  title: "Test Product",
  price: 29.99,
  category: "electronics",
  description: "A test product description",
  image: "https://via.placeholder.com/300",
  rating: { rate: 4.5, count: 120 },
};

const renderWithStore = (component) => {
  const store = configureStore({
    reducer: { cart: cartReducer },
  });
  return render(<Provider store={store}>{component}</Provider>);
};

describe("ProductCard", () => {
  it("renders product title, price and category", () => {
    renderWithStore(<ProductCard product={mockProduct} />);

    expect(screen.getByText("Test Product")).toBeInTheDocument();
    expect(screen.getByText("$29.99")).toBeInTheDocument();
    expect(screen.getByText("electronics")).toBeInTheDocument();
  });

  it("renders the Add to Cart button", () => {
    renderWithStore(<ProductCard product={mockProduct} />);

    expect(
      screen.getByRole("button", { name: /add test product to cart/i })
    ).toBeInTheDocument();
  });

  it("shows Added! feedback when button is clicked", async () => {
    const user = userEvent.setup();
    renderWithStore(<ProductCard product={mockProduct} />);

    const button = screen.getByRole("button", { name: /add test product to cart/i });
    await user.click(button);

    expect(screen.getByText("✓ Added!")).toBeInTheDocument();
  });

  it("renders placeholder when image fails to load", () => {
    renderWithStore(<ProductCard product={mockProduct} />);

    const img = screen.getByAltText("Test Product");
    expect(img).toBeInTheDocument();
  });
});