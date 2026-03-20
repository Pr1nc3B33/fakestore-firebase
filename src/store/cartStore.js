import { configureStore, createSlice, current } from '@reduxjs/toolkit';
import authReducer from "./authStore";

const SESSION_KEY = 'fakestore_cart';

const loadCartFromSession = () => {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const persistCart = (plainItems) => {
  try {
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(plainItems));
  } catch {
  }
};

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    items: loadCartFromSession(),
    checkoutSuccess: false,
  },
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
      state.checkoutSuccess = false;
persistCart(JSON.parse(JSON.stringify(state.items)));    },

    removeFromCart: (state, action) => {
  state.items = state.items.filter((i) => i.id !== action.payload);
  persistCart(JSON.parse(JSON.stringify(state.items)));
},

updateQuantity: (state, action) => {
  const { id, count } = action.payload;
  if (count <= 0) {
    state.items = state.items.filter((i) => i.id !== id);
  } else {
    const item = state.items.find((i) => i.id === id);
    if (item) item.count = count;
  }
  persistCart(JSON.parse(JSON.stringify(state.items)));
},

    checkout: (state) => {
      state.items = [];
      state.checkoutSuccess = true;
      sessionStorage.removeItem(SESSION_KEY);
    },

    dismissCheckoutSuccess: (state) => {
      state.checkoutSuccess = false;
    },
  },
});

export const {
  addToCart,
  removeFromCart,
  updateQuantity,
  checkout,
  dismissCheckoutSuccess,
} = cartSlice.actions;

//  Selectors 

export const selectCartItems = (state) => state.cart.items;

export const selectCartTotal = (state) =>
  state.cart.items.reduce((sum, i) => sum + i.price * i.count, 0);

export const selectCartCount = (state) =>
  state.cart.items.reduce((sum, i) => sum + i.count, 0);

export const selectCheckoutSuccess = (state) => state.cart.checkoutSuccess;

//  Store


const appStore = configureStore({
  reducer: {
    cart: cartSlice.reducer,
    auth: authReducer,
  },
});

export default appStore;
