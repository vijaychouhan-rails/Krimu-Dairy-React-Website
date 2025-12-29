import {createSlice, PayloadAction} from "@reduxjs/toolkit"

export interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
  category: string;
}

interface CartState {
  items: CartItem[];
}

const saveCartToLocalStorage = (items: CartItem[]) => {
    if (typeof window === "undefined") return [];

    try {
        localStorage.setItem("cartItems", JSON.stringify(items));
    } catch(error) {
        console.error("Failed to save cart to localStorage:", error);
    }
}

const loadCartFromLocalStorage = () => {
    if (typeof window === "undefined") return [];

    try{
        const cartItems = localStorage.getItem("cartItems");
        return cartItems ? JSON.parse(cartItems) : [];
    } catch(error){
        console.error("Failed to load cart from localStorage:", error);
        return [];
    }
}

const initialState: CartState = {    
    items: loadCartFromLocalStorage(),
}

const cartSlice = createSlice({
    name: "cart",
    initialState,
    reducers: {
        addItem: (state, action: PayloadAction<CartItem>) => {
            const existing = state.items.find(i => i.id == action.payload.id);
            if(existing){
                existing.quantity += action.payload.quantity;
            }else{
                state.items.push(action.payload)
            }
            saveCartToLocalStorage(state.items);
        },
        removeItem: (state, action: PayloadAction<number>) => {
           state.items = state.items.filter(i => i.id !== action.payload);
           saveCartToLocalStorage(state.items);
        },
        updateQuantity: (state, action: PayloadAction<{ id: number; quantity: number }>) => {
            const item = state.items.find(i => i.id === action.payload.id);
            if (item) {
                item.quantity = action.payload.quantity;
                saveCartToLocalStorage(state.items);
            }
        },

        clearCart: (state) => {
            state.items = [];
            localStorage.removeItem("cartItems");
        },
    }
})

export const { addItem, removeItem, updateQuantity, clearCart} = cartSlice.actions;
export default cartSlice.reducer;