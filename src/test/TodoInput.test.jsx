import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { Provider } from "react-redux";
import { configureStore, createSlice } from "@reduxjs/toolkit";
import Navbar from "../components/Navbar";

const testCartSlice = createSlice({
  name: "cart",
  initialState: { items: [], checkoutSuccess: false },
  reducers: {},
});

const testAuthSlice = createSlice({
  name: "auth",
  initialState: { user: null },
  reducers: {},
});

const renderWithStore = (cartItems = []) => {
  const store = configureStore({
    reducer: {
      cart: testCartSlice.reducer,
      auth: testAuthSlice.reducer,
    },
    preloadedState: {
      cart: { items: cartItems, checkoutSuccess: false },
      auth: { user: { uid: "123", email: "test@test.com" } },
    },
  });
  return render(
    <Provider store={store}>
      <Navbar page="home" setPage={() => {}} />
    </Provider>
  );
};

describe("Navbar", () => {
  it("renders the FakeStore logo", () => {
    renderWithStore();
    expect(screen.getByText("FakeStore")).toBeInTheDocument();
  });

  it("renders Shop, Cart, Profile, Orders and Manage links", () => {
    renderWithStore();
    expect(screen.getByRole("button", { name: /shop/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /cart/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /profile/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /orders/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /manage/i })).toBeInTheDocument();
  });

  it("does not show cart badge when cart is empty", () => {
    renderWithStore([]);
    expect(screen.queryByText("0")).not.toBeInTheDocument();
  });

  it("shows cart badge with correct count when items are in cart", () => {
    renderWithStore([
      {
        id: "1",
        title: "Test",
        price: 10,
        count: 3,
        image: "",
        category: "",
        rating: { rate: 4, count: 10 },
      },
    ]);
    expect(screen.getByText("3")).toBeInTheDocument();
  });
});