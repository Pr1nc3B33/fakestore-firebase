import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect } from "vitest";
import { Provider } from "react-redux";
import { configureStore, createSlice } from "@reduxjs/toolkit";
import ProductCard from "../components/ProductCard";
import Cart from "../components/Cart";

const testCartSlice = createSlice({
  name: "cart",
  initialState: { items: [], checkoutSuccess: false },
  reducers: {
    addToCart: (state, action) => {
      const product = action.payload;
      const existing = state.items.find((i) => i.id === product.id);
      if (existing) {
        existing.count += 1;
      } else {
        const { id, title, price, image, category, rating } = product;
        state.items.push({ id, title, price, image, category, rating, count: 1 });
      }
    },
    removeFromCart: (state, action) => {
      state.items = state.items.filter((i) => i.id !== action.payload);
    },
    updateQuantity: (state, action) => {
      const { id, count } = action.payload;
      if (count <= 0) {
        state.items = state.items.filter((i) => i.id !== id);
      } else {
        const item = state.items.find((i) => i.id === id);
        if (item) item.count = count;
      }
    },
    checkout: (state) => {
      state.items = [];
      state.checkoutSuccess = true;
    },
    dismissCheckoutSuccess: (state) => {
      state.checkoutSuccess = false;
    },
  },
});

const testAuthSlice = createSlice({
  name: "auth",
  initialState: { user: null },
  reducers: {},
});

const mockProduct = {
  id: "1",
  title: "Test Product",
  price: 29.99,
  category: "electronics",
  description: "A test product description",
  image: "https://via.placeholder.com/300",
  rating: { rate: 4.5, count: 120 },
};

const renderWithStore = (components) => {
  const store = configureStore({
    reducer: {
      cart: testCartSlice.reducer,
      auth: testAuthSlice.reducer,
    },
  });
  return render(<Provider store={store}>{components}</Provider>);
};

describe("Cart Integration", () => {
  it("updates cart when a product is added from ProductCard", async () => {
    const user = userEvent.setup();
    renderWithStore(
      <>
        <ProductCard product={mockProduct} />
        <Cart />
      </>
    );

    expect(screen.getByText("Your cart is empty")).toBeInTheDocument();

    await user.click(
      screen.getByRole("button", { name: /add test product to cart/i })
    );

    const titles = screen.getAllByText("Test Product");
    expect(titles.length).toBeGreaterThan(0);
    expect(screen.getByText("$29.99 each")).toBeInTheDocument();
  });

  it("updates total price when product is added", async () => {
    const user = userEvent.setup();
    renderWithStore(
      <>
        <ProductCard product={mockProduct} />
        <Cart />
      </>
    );

    await user.click(
      screen.getByRole("button", { name: /add test product to cart/i })
    );

    expect(screen.getByText("$29.99 each")).toBeInTheDocument();
    expect(screen.getByText("Total price")).toBeInTheDocument();
  });

  it("removes product from cart when delete button is clicked", async () => {
    const user = userEvent.setup();
    renderWithStore(
      <>
        <ProductCard product={mockProduct} />
        <Cart />
      </>
    );

    await user.click(
      screen.getByRole("button", { name: /add test product to cart/i })
    );

    expect(screen.getByText("$29.99 each")).toBeInTheDocument();

    await user.click(
      screen.getByRole("button", { name: /remove test product from cart/i })
    );

    expect(screen.queryByText("$29.99 each")).not.toBeInTheDocument();
    expect(screen.getByText("Your cart is empty")).toBeInTheDocument();
  });
});